import { ResourcesService } from "./resources.service.js";

export class ResourcesController {
  /**
   * Controller for resolving resources listing
   */
  static async listAllResources() {
    return ResourcesService.getResourcesList();
  }
}
