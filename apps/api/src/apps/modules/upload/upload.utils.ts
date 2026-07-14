import { randomUUID } from "crypto"
import path from "path"

export const generateFileName = (originalName: string, folder: string) => {
  const ext = path.extname(originalName)

  const fileName = `${Date.now()}-${randomUUID()}${ext}`

  return `${folder}/${fileName}`
}
