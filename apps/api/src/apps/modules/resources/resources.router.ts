import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { ResourcesController } from "./resources.controller.js";

export const resourcesRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/resources/list",
        tags: ["resources"],
        summary: "List all resources",
        description: "Returns an array of all general, pastoral, and board resources"
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      title: z.string(),
      category: z.string(),
      fileUrl: z.string()
    })))
    .query(async () => {
      return ResourcesController.listAllResources();
    })
});
