import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { PortalController } from "./portal.controller.js";

export const portalRouter = router({
  status: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/portal/status",
        tags: ["portal"],
        summary: "Get portal system status",
        description: "Returns system operational status and software version"
      }
    })
    .input(z.void())
    .output(z.object({
      systemStatus: z.string(),
      version: z.string()
    }))
    .query(async () => {
      return PortalController.getPortalStatus();
    })
});
