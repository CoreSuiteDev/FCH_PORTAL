import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';
import { Context } from './context.js';

const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check if user is logged in
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

// Middleware to check if user has SUPER_ADMIN role
const isSuperAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.role !== "SUPER_ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires Super Admin privileges" });
  }
  return next();
});


const isGeneralUser = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.role !== "MEMBER") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires General User privileges" });
  }
  return next();
});

const isPastoralUser = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.role !== "PASTORAL") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires Pastoral User privileges" });
  }
  return next();
});

const isBoardUser = t.middleware(({ next, ctx }) => {
  if (!ctx.user || ctx.role !== "BOARD") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Requires Board User privileges" });
  }
  return next();
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isSuperAdmin);
export const generalUserProcedure = t.procedure.use(isGeneralUser);
export const pastoralUserProcedure = t.procedure.use(isPastoralUser);
export const boardUserProcedure = t.procedure.use(isBoardUser);