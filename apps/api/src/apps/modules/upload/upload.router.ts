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
})
