import { S3Client } from "@aws-sdk/client-s3";
import cuid from "cuid";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    key: (req, file, cb) => {
      cb(null, `${process.env.PROJECT_NAME}/${cuid()}${file.originalname}`);
    },
    acl: "public-read",
  }),
});

export const post = [
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully", url: file.location });
  },
];
