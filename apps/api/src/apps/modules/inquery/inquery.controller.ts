import { TRPCError } from "@trpc/server";
import { InqueryService } from "./inquery.service.js";

export class InqueryController {
  /**
   * Controller for creating a new inquiry
   */
  static async createInquery(body: {
    name: string;
    email: string;
    message: string;
  }) {
    try {
      const inquery = await InqueryService.createInquery(body);
      return { success: true, data: inquery };
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to submit inquiry: ${error.message}`,
      });
    }
  }

  /**
   * Controller for listing inquiries (paginated)
   */
  static async listInqueries(params: { page: number; limit: number }) {
    try {
      return await InqueryService.findAllInqueries(params);
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve inquiries: ${error.message}`,
      });
    }
  }

  /**
   * Controller for fetching a single inquiry by ID
   */
  static async getInqueryById({ id }: { id: string }) {
    try {
      const inquery = await InqueryService.findInqueryById(id);
      if (!inquery) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Inquiry with ID ${id} not found`,
        });
      }
      return inquery;
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch inquiry details: ${error.message}`,
      });
    }
  }

  /**
   * Controller for updating an inquiry
   */
  static async updateInquery(
    id: string,
    data: {
      name?: string;
      email?: string;
      message?: string;
    }
  ) {
    try {
      const exists = await InqueryService.findInqueryById(id);
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Inquiry with ID ${id} not found`,
        });
      }

      return await InqueryService.updateInquery(id, data);
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to update inquiry: ${error.message}`,
      });
    }
  }

  /**
   * Controller for deleting an inquiry
   */
  static async deleteInquery({ id }: { id: string }) {
    try {
      const exists = await InqueryService.findInqueryById(id);
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Inquiry with ID ${id} not found`,
        });
      }

      return await InqueryService.deleteInquery(id);
    } catch (error: any) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete inquiry: ${error.message}`,
      });
    }
  }
}