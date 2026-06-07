export class ResourcesService {
  /**
   * Fetch list of available resources
   */
  static async getResourcesList() {
    return [
      { id: "res_1", title: "Liturgy Planning Guide", category: "GENERAL", fileUrl: "http://example.com/guide.pdf" }
    ];
  }
}
