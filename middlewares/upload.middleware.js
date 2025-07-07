// middlewares/cloudinary.middleware.js
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Dùng memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Middleware: upload single file, upload lên Cloudinary,
 * rồi gán đường dẫn vào req.body.<fieldname> (vd: req.body.image)
 */
const cloudinaryUploadMiddleware = (fieldName = "image") => [
  upload.single(fieldName),
  async (req, res, next) => {
    if (!req.file) return next();

    try {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      req.body[fieldName] = result.secure_url; // Gán URL cloudinary vào req.body
      next();
    } catch (err) {
      console.error("Upload Cloudinary error:", err);
      res.status(500).json({ message: "Lỗi khi upload ảnh lên Cloudinary", error: err });
    }
  }
];

module.exports = cloudinaryUploadMiddleware;
