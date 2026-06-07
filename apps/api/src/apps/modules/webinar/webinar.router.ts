import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { WebinarController } from "./webinar.controller.js";

export const webinarRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/webinar/list",
        tags: ["webinar"],
        summary: "List all webinars",
        description: "Returns an array of all general and advanced webinars"
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      title: z.string(),
      duration: z.number(),
      url: z.string()
    })))
    .query(async () => {
      return WebinarController.getWebinarsList();
    })
});
