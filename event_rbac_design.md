# Event Access Control Design: Hybrid RBAC + Visibility Matrix

This document outlines the complete architectural design and code implementation for managing **Events** with role-based access controls, including **Super Admin** bypass and **Event Visibility** restrictions.

---

## 🏛️ 1. Architecture Overview

To avoid a heavy, slow database-driven ACL (Access Control List) system with redundant tables and complex joins, we implement a **Lightweight Hybrid RBAC + Code-level Policy Engine**.

1. **Roles in Database**: Roles are stored in the database (`Role` and `UserRole` models) for dynamic assignment.
2. **Access Rules in Code (Hierarchy)**: Permissions are mapped in memory using a simple numeric hierarchical evaluation. This is fast, has zero query overhead, and is extremely easy to maintain.
3. **Decoupled Policy Layer (`event.policy.ts`)**: Keep your security logic separated from database queries and routes.

---

## 🧩 2. Database Schema (Prisma)

Update your schema to define the `Event` model and necessary enums.

### A. Add Enums to `enum.prisma`
```prisma
enum EventVisibility {
  PUBLIC
  FREE_WEBINAR
  MEMBER_ONLY
  PASTORAL_ONLY
  BOARD_ONLY
}
```

### B. Create `event.prisma`
Create a new file `apps/api/prisma/schema/event.prisma`:
```prisma
model Event {
  id          String          @id @default(cuid())
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  title       String
  description String?
  date        DateTime
  location    String

  visibility  EventVisibility @default(PUBLIC)
  isActive    Boolean         @default(true)

  @@index([visibility])
  @@index([isActive])
  @@map("event")
}
```

Run migrations to sync this with your database:
```bash
bunx --bun prisma db push
bunx --bun prisma generate
```

---

## 🧠 3. Policy Engine (`event.policy.ts`)

This engine implements the **Event Visibility Matrix** using a numeric hierarchical evaluation.

Create `apps/api/src/apps/modules/events/event.policy.ts`:

```typescript
import { EventVisibility } from "../../../generated/prisma/client.js";

// Role hierarchy levels (higher numbers represent greater access privileges)
export const ROLE_HIERARCHY: Record<string, number> = {
  GUEST: 0,
  MEMBER: 1,
  PASTORAL: 2,
  BOARD: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

// Event visibility requirement levels
export const VISIBILITY_LEVEL: Record<EventVisibility, number> = {
  PUBLIC: 0,
  FREE_WEBINAR: 0,
  MEMBER_ONLY: 1,
  PASTORAL_ONLY: 2,
  BOARD_ONLY: 3,
};

export class EventPolicy {
  /**
   * Evaluates if a given role can view an event
   */
  static canView(userRole: string | undefined, eventVisibility: EventVisibility): boolean {
    const role = userRole ? userRole.toUpperCase() : "GUEST";
    
    // Admins and Super Admins bypass all visibility checks
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return true;
    }

    const userScore = ROLE_HIERARCHY[role] ?? 0;
    const requiredScore = VISIBILITY_LEVEL[eventVisibility] ?? 0;

    return userScore >= requiredScore;
  }

  /**
   * Filter a list of events to only return what the user has permission to see
   */
  static filterVisibleEvents<T extends { visibility: EventVisibility }>(
    userRole: string | undefined,
    events: T[]
  ): T[] {
    return events.filter((event) => this.canView(userRole, event.visibility));
  }

  /**
   * Evaluates if a given role can manage (create/update/delete) events
   */
  static canManage(userRole: string | undefined): boolean {
    const role = userRole ? userRole.toUpperCase() : "GUEST";
    return role === "SUPER_ADMIN" || role === "ADMIN";
  }
}
```

---

## 🔒 4. tRPC Authentication & Authorization Middlewares

To check the user's role on each protected API request, update your tRPC setup.

### A. Update Context (`apps/api/src/server/context.ts`)
Update context to retrieve the user's authenticated session and roles during request initialization:

```typescript
import * as trpcExpress from "@trpc/server/adapters/express";
import { auth } from "../lib/auth.js";
import { prisma } from "../infrastructure/database/prisma.js";

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  // Get Better-Auth session
  const sessionData = await auth.api.getSession({
    headers: req.headers,
  });

  if (!sessionData) {
    return { req, res, user: null, role: "GUEST" };
  }

  // Retrieve user's role from database
  const userWithRoles = await prisma.user.findUnique({
    where: { id: sessionData.user.id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const role = userWithRoles?.userRoles?.[0]?.role?.name || "MEMBER";

  return {
    req,
    res,
    user: sessionData.user,
    session: sessionData.session,
    role: role.toUpperCase(),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### B. Add Guards in tRPC (`apps/api/src/server/trpc.ts`)
Define authentication and authorization procedures:

```typescript
import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { Context } from "./context.js";

const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to ensure user is logged in
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in" });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

// Middleware to ensure user is an Admin or Super Admin
const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.user || (ctx.role !== "ADMIN" && ctx.role !== "SUPER_ADMIN")) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires administrator privileges" });
  }
  return next();
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
```

---

## 🚀 5. Module Implementation

Here is how you structure and write the core API endpoints.

### A. Router (`apps/api/src/apps/modules/events/events.router.ts`)
Exposes procedures for both public/member lists and admin modifications:

```typescript
import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../../server/trpc.js";
import { EventsController } from "./events.controller.js";

const ZEventVisibilitySchema = z.enum([
  "PUBLIC",
  "FREE_WEBINAR",
  "MEMBER_ONLY",
  "PASTORAL_ONLY",
  "BOARD_ONLY",
]);

const ZEventOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.date(),
  location: z.string(),
  visibility: ZEventVisibilitySchema,
  isActive: z.boolean(),
});

export const eventsRouter = router({
  // 1. Get all events the current user is permitted to see
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events",
        tags: ["events"],
        summary: "List accessible events",
        description: "Returns list of upcoming events permitted for the current user's role",
      },
    })
    .input(z.void())
    .output(z.array(ZEventOutputSchema))
    .query(async ({ ctx }) => {
      return EventsController.getEventsList(ctx.role);
    }),

  // 2. Fetch details of a single event with access check
  getById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/{id}",
        tags: ["events"],
        summary: "Get event by ID",
        description: "Returns details of an event if permitted by your role",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ZEventOutputSchema)
    .query(async ({ input, ctx }) => {
      return EventsController.getEventById(input.id, ctx.role);
    }),

  // 3. Create an event (Admin only)
  create: adminProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/admin/events",
        tags: ["admin-events"],
        summary: "Create event",
        description: "Creates a new event with a visibility classification level",
      },
    })
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        date: z.coerce.date(),
        location: z.string().min(1),
        visibility: ZEventVisibilitySchema,
      })
    )
    .output(ZEventOutputSchema)
    .mutation(async ({ input }) => {
      return EventsController.createEvent(input);
    }),

  // 4. Update an event (Admin only)
  update: adminProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/admin/events/{id}",
        tags: ["admin-events"],
        summary: "Update event",
        description: "Updates details of an existing event record",
      },
    })
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          date: z.coerce.date().optional(),
          location: z.string().optional(),
          visibility: ZEventVisibilitySchema.optional(),
          isActive: z.boolean().optional(),
        }),
      })
    )
    .output(ZEventOutputSchema)
    .mutation(async ({ input }) => {
      return EventsController.updateEvent(input.id, input.data);
    }),

  // 5. Delete an event (Admin only)
  delete: adminProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/admin/events/{id}",
        tags: ["admin-events"],
        summary: "Delete event",
        description: "Permanently deletes an event record from the database",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return EventsController.deleteEvent(input.id);
    }),
});
```

### B. Controller (`apps/api/src/apps/modules/events/events.controller.ts`)
Bridges the routes and triggers visibility matrix checks:

```typescript
import { TRPCError } from "@trpc/server";
import { EventsService } from "./events.service.js";
import { EventPolicy } from "./event.policy.js";
import { EventVisibility } from "../../../generated/prisma/client.js";

export class EventsController {
  static async getEventsList(userRole: string) {
    const events = await EventsService.getAllEvents();
    // Filter list to only return events permitted for the current user's role
    return EventPolicy.filterVisibleEvents(userRole, events);
  }

  static async getEventById(id: string, userRole: string) {
    const event = await EventsService.findEventById(id);
    if (!event) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
    }

    // Access check using the Policy engine
    if (!EventPolicy.canView(userRole, event.visibility)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to access this event",
      });
    }

    return event;
  }

  static async createEvent(data: {
    title: string;
    description?: string;
    date: Date;
    location: string;
    visibility: EventVisibility;
  }) {
    return EventsService.createEvent(data);
  }

  static async updateEvent(id: string, data: any) {
    return EventsService.updateEvent(id, data);
  }

  static async deleteEvent(id: string) {
    return EventsService.deleteEvent(id);
  }
}
```

### C. Service (`apps/api/src/apps/modules/events/events.service.ts`)
Core database actions:

```typescript
import { prisma } from "../../../infrastructure/database/prisma.js";
import { EventVisibility } from "../../../generated/prisma/client.js";

export class EventsService {
  static async getAllEvents() {
    return prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    });
  }

  static async findEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
    });
  }

  static async createEvent(data: {
    title: string;
    description?: string;
    date: Date;
    location: string;
    visibility: EventVisibility;
  }) {
    return prisma.event.create({
      data,
    });
  }

  static async updateEvent(id: string, data: any) {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  static async deleteEvent(id: string) {
    await prisma.event.delete({
      where: { id },
    });
    return { success: true };
  }
}
```

---

## 🛠️ 6. Test Seed Script

Create a script `apps/api/prisma/seed-events.ts` to test:

```typescript
import { prisma } from "../src/infrastructure/database/prisma.js";

async function run() {
  console.log("Seeding Roles and Events...");

  // Seed default roles
  const roles = ["SUPER_ADMIN", "ADMIN", "BOARD", "PASTORAL", "MEMBER"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }

  // Seed default events
  const events = [
    { title: "Sunday Fellowship Gala", location: "Grand Hall", visibility: "PUBLIC" as const, date: new Date() },
    { title: "Intro to Faith Webinars", location: "Zoom Online", visibility: "FREE_WEBINAR" as const, date: new Date() },
    { title: "Monthly General Member Meeting", location: "Main Chapel", visibility: "MEMBER_ONLY" as const, date: new Date() },
    { title: "Pastor and Leader Council Session", location: "Leadership Office", visibility: "PASTORAL_ONLY" as const, date: new Date() },
    { title: "Confidential Board Audit Meet", location: "Executive Boardroom", visibility: "BOARD_ONLY" as const, date: new Date() },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log("Seeding complete!");
}

run().catch(console.error);
```
