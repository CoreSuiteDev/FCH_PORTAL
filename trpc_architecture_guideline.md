# Backend Architecture Guide: tRPC Routers, Controllers, and Services

To keep the Express API clean, robust, and scalable, we use a **three-tier architecture** for our modules:
1. **tRPC Router**: Decouples API path registration, security checks, and schema validation.
2. **Controller (Handler)**: Unwraps variables, invokes business processes, and shapes the returned data.
3. **Service**: Handles core tasks, database queries (Prisma), or integration with external APIs (Stripe, Okta).

---

## 1. Directory Structure

Inside each module (located in `apps/api/src/apps/modules/<module-name>/`), you should organize files as follows:

```
apps/api/src/apps/modules/user/
├── user.router.ts      # tRPC Procedure declarations, Zod inputs/outputs, and OpenAPI meta
├── user.controller.ts  # Route handlers (logic orchestration & parameter mapping)
└── user.service.ts     # Data access layer (Prisma calls, CRUD operations)
```

---

## 2. Coding Guidelines & Implementation Rules

### Rule 1: Use Explicit ES Module Import Extensions
In the backend code, relative imports **must** end with the `.js` extension (e.g. `import { UserService } from "./user.service.js"`). This complies with Node ESM specification.

### Rule 2: Decouple Validation from Controllers
Always define `input` and `output` validation schemas using `zod` inside the `router.ts` file, keeping controllers clean of validation code.

### Rule 3: Use Static Methods for Controllers and Services
Export classes containing static methods (e.g. `class UserService { static async getUser(...) {} }`). This avoids the overhead of manually instantiating classes.

---

## 3. Reference Implementation: User Module

Here is the exact pattern to implement.

### A. The Service Layer (`user.service.ts`)
This class queries the database via the Prisma client.

```typescript
import { prisma } from "../../../lib/prisma.js";

export class UserService {
  /**
   * Fetch a single user by their ID
   */
  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch all registered users
   */
  static async findAllUsers() {
    return prisma.user.findMany();
  }
}
```

### B. The Controller Layer (`user.controller.ts`)
This class coordinates input handling and maps standard outputs or throws tRPC/custom errors.

```typescript
import { TRPCError } from "@trpc/server";
import { UserService } from "./user.service.js";

export class UserController {
  /**
   * Controller for resolving a single user's details
   */
  static async getUserProfile({ userId }: { userId: string }) {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with ID ${userId} not found`,
      });
    }
    return user;
  }

  /**
   * Controller for listing all users
   */
  static async listAllMembers() {
    return UserService.findAllUsers();
  }
}
```

### C. The Router Layer (`user.router.ts`)
This class registers the procedures, maps inputs/outputs, and configures OpenAPI metadata for REST exposure.

```typescript
import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { UserController } from "./user.controller.js";

export const userRouter = router({
  // GET /api/v1/users/profile/:userId
  getProfile: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/profile/{userId}",
        tags: ["users"],
        summary: "Get user profile details",
        description: "Returns a user profile record from the database"
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      image: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }))
    .query(async ({ input }) => {
      return UserController.getUserProfile({ userId: input.userId });
    }),

  // GET /api/v1/users/list
  listMembers: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/users/list",
        tags: ["users"],
        summary: "List all registered members",
        description: "Returns an array of all members"
      },
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      image: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })))
    .query(async () => {
      return UserController.listAllMembers();
    }),
});
```

---

## 4. How to Register Sub-Routers in the Root Router

To expose your new procedures, import and mount the sub-routers inside `apps/api/src/server/index.ts`:

```typescript
import { router, publicProcedure } from "./trpc.js";
import { userRouter } from "../apps/modules/user/user.router.js";
import { authRouter } from "../apps/modules/auth/auth.router.js";
import { dashboardRouter } from "../apps/modules/dashboard/dashboard.router.js";

// Root Router
export const appRouter = router({
  // Expose hello procedure
  hello: publicProcedure.query(() => ({ greeting: "Hello World!" })),

  // Register sub-routers under namespace keys
  user: userRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
```

With this registration, routes will automatically resolve as:
* **tRPC client**: `trpc.user.getProfile.useQuery(...)`
* **REST client**: `GET http://localhost:5000/api/v1/users/profile/:userId`
