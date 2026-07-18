import { Request, Response, NextFunction } from "express";
import { UploadService } from "./upload.service.js";

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required",
      });
    }

    const folder = String(req.body.folder || "others");

    const data = await UploadService.uploadFile(file, folder);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "File key is required",
      });
    }

    const data = await UploadService.deleteFile(key);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDownloadPresignedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = String(req.query.key);
    const expiresIn = req.query.expiresIn ? Number(req.query.expiresIn) : undefined;

    if (!key || key === "undefined") {
      return res.status(400).json({
        success: false,
        message: "File key is required",
      });
    }

    const data = await UploadService.getDownloadPresignedUrl(key, expiresIn);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};