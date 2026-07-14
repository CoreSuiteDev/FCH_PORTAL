import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client } from "../../../utils/r2"
import { generateFileName } from "./upload.utils"

export class UploadService {
  static async uploadFile(file: Express.Multer.File, folder: string) {
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
  }
}
