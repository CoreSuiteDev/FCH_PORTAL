import { z } from "zod"
import { publicProcedure, router } from "../../../server/trpc.js"
import { UploadService } from "./upload.service.js"

export const uploadRouter = router({
  uploadFile: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/upload",
        tags: ["upload"],
        summary: "Upload a file",
        description: "Uploads a file (as base64) to R2 storage and returns the public URL",
      },
    })
    .input(
      z.object({
        base64: z.string().min(1, "File content is required"),
        filename: z.string().min(1, "Filename is required"),
        mimetype: z.string().min(1, "MIME type is required"),
        folder: z.string().optional().default("others"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        data: z.object({
          key: z.string(),
          url: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64")

      // Build a minimal Express.Multer.File-compatible object
      const file: Express.Multer.File = {
        fieldname: "file",
        originalname: input.filename,
        encoding: "base64",
        mimetype: input.mimetype,
        buffer,
        size: buffer.byteLength,
        stream: null as any,
        destination: "",
        filename: input.filename,
        path: "",
      }

      const data = await UploadService.uploadFile(file, input.folder)

      return { success: true, data }
    }),

  deleteFile: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/upload/delete",
        tags: ["upload"],
        summary: "Delete a file",
        description: "Deletes a file from R2 storage by its key",
      },
    })
    .input(
      z.object({
        key: z.string().min(1, "File key is required"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await UploadService.deleteFile(input.key)
      return { success: true }
    }),

  getDownloadPresignedUrl: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/upload/presigned-url",
        tags: ["upload"],
        summary: "Get presigned download URL",
        description: "Generates a temporary presigned GET URL for a file",
      },
    })
    .input(
      z.object({
        key: z.string().min(1, "File key is required"),
        expiresIn: z.number().optional(),
      })
    )
    .output(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await UploadService.getDownloadPresignedUrl(input.key, input.expiresIn)
      return result
    }),
})

