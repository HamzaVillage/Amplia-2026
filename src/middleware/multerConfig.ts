import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

// Create folder if not exists
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    switch (file.fieldname) {
      case "profile":
        uploadPath = "uploads/profile/";
        break;
      case "icon":
        uploadPath = "uploads/category/icons/";
        break;
      case "cover":
        uploadPath = "uploads/cover/";
        break;
      case "media":
        uploadPath = "uploads/message/media/";
        break;
      case "messageFile":
        uploadPath = "uploads/message/files/";
        break;
      case "file":
        uploadPath = "uploads/file/";
        break;
      default:
        uploadPath = "uploads/others/";
    }

    ensureDir(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Allow all file types as per user request
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
