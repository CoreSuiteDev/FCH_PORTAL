import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { EventsController } from "./events.controller.js";

export const eventsRouter = router({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/events/list",
        tags: ["events"],
        summary: "List all events",
        description: "Returns an array of registered upcoming events"
      }
    })
    .input(z.void())
    .output(z.array(z.object({
      id: z.string(),
      title: z.string(),
      date: z.date(),
      location: z.string()
    })))
    .query(async () => {
      return EventsController.getEventsList();
    })
});
