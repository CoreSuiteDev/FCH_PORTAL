import { Request, Response } from "express";

import { UploadService } from "./upload.service";

export const uploadFile = async (
    req: Request,
    res: Response,
) => {

    const file = req.file;

    if (!file) {
        return res.status(400).json({
            message: "File required",
        });
    }

    const folder =
        String(req.body.folder || "others");

    const data =
        await UploadService.uploadFile(
            file,
            folder,
        );

    return res.json({
        success: true,
        data,
    });
};