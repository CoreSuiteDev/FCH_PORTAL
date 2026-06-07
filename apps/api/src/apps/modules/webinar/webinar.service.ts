export class WebinarService {
  /**
   * Fetch all webinar video details
   */
  static async getWebinars() {
    return [
      { id: "web_1", title: "Advanced Leadership Seminar", duration: 120, url: "http://example.com/video" }
    ];
  }
}
