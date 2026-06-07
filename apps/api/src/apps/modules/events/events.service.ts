export class EventsService {
  /**
   * Fetch all registered events
   */
  static async getAllEvents() {
    return [
      { id: "ev_1", title: "Faith Summit 2026", date: new Date(), location: "Zoom Meeting" }
    ];
  }
}
