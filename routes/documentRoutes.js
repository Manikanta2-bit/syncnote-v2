const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    return {
      folder: "SyncNote",
      resource_type: "auto",
      public_id: `${Date.now()}-${baseName}`
    };
  }
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
