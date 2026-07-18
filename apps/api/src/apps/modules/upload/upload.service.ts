import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { TRPCError } from "@trpc/server"
import { r2Client } from "../../../utils/r2"
import { generateFileName } from "./upload.utils"

export class UploadService {
  /**
   * Uploads a file to Cloudflare R2
   */
  static async uploadFile(file: Express.Multer.File, folder: string) {
    try {
      const key = generateFileName(file.originalname, folder)

      await r2Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      )

      return { key, url: `${process.env.R2_PUBLIC_URL}/${key}` }
    } catch (error: any) {
      console.error("R2 Upload Error:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload file to storage",
        cause: error,
      })
    }
  }

  /**
   * Deletes a file from Cloudflare R2
   */
  static async deleteFile(key: string) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
        })
      )
      return { success: true }
    } catch (error: any) {
      console.error("R2 Delete Error:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete file from storage",
        cause: error,
      })
    }
  }

  /**
   * Generates a presigned GET URL for temporary access to private files
   */
  static async getDownloadPresignedUrl(key: string, expiresInSeconds = 3600) {
    try {
      const url = await getSignedUrl(
        r2Client,
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
        }),
        { expiresIn: expiresInSeconds }
      )
      return { url }
    } catch (error: any) {
      console.error("R2 Presigned GET URL Error:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate download presigned URL",
        cause: error,
      })
    }
  }
}
