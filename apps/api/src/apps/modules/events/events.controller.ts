import { EventsService } from "./events.service.js";

export class EventsController {
  /**
   * Controller for resolving events listing
   */
  static async getEventsList() {
    return EventsService.getAllEvents();
  }
}
