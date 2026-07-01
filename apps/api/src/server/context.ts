import * as trpcExpress from '@trpc/server/adapters/express';
import { auth } from "../lib/auth.js";
import { prisma } from "../infrastructure/database/prisma.js";

const getHeaders = (reqHeaders: Record<string, any>): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(reqHeaders)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }
  return headers;
};

export const createContext = async ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
  const headers = getHeaders(req.headers);
  const sessionData = await auth.api.getSession({
    headers,
  });

  if (!sessionData) {
    return { req, res, user: null, session: null, role: "GUEST" };
  }

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

  const roles = userWithRoles?.userRoles?.map((ur) => ur.role?.name) || [];
  const role = roles.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : roles.includes("BOARD")
      ? "BOARD"
      : roles.includes("PASTORAL")
        ? "PASTORAL"
        : roles.includes("MEMBER")
          ? "MEMBER"
          : roles[0] || "USER";

  return {
    req,
    res,
    user: sessionData.user,
    session: sessionData.session,
    role: role.toUpperCase(),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;