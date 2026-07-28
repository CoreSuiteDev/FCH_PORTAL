import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE)
    }
})