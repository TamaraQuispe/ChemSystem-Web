const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const S3_BUCKET = process.env.S3_UPLOAD_BUCKET || 'chemsystem-uploads';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

const ALLOWED_TYPES = [
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'text/csv',
  'application/zip', 'application/x-rar-compressed',
  'video/mp4', 'video/mpeg', 'video/webm',
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

async function uploadToS3(file, folder = 'assignments') {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${crypto.randomUUID()}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return {
    url: `https://${S3_BUCKET}.s3.amazonaws.com/${key}`,
    name: file.originalname,
    size: file.size,
    type: file.mimetype,
  };
}

module.exports = { upload, uploadToS3, ALLOWED_TYPES, MAX_FILE_SIZE };
