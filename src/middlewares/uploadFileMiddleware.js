// const multerS3 = require('multer-s3');
// const crypto = require('crypto');
// const path = require('path');
// const { S3Client } = require('@aws-sdk/client-s3');
// const fs = require('fs');

const multer = require('multer');
// Generate a unique identifier for each file
// const generateUUID = () => crypto.randomUUID();

// path variable
// const today = new Date();
// const monthName = today
//   .toLocaleString('en-US', { month: 'long' })
//   .toLowerCase();
// const yearName = today.getFullYear();

// Create a folder for Image's Path
// const dir = `public/upload/profiles/${yearName}/${monthName}/`;

// try {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log('Target directory created successfully');
//   }
// } catch (error) {
//   console.error('Error creating target directory:', error);
// }

// Configure multer for S3 storage
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// const awsstorage = multerS3({
//   s3,
//   bucket: process.env.S3_BUCKET_NAME,
//   // acl: 'public-read', // Set the appropriate ACL for your use case
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     const uniqueFileName = `${generateUUID()}_${file.originalname}`;
//     const keyPath = [
//       'upload',
//       'profiles',
//       yearName.toString(),
//       monthName.toString(),
//       uniqueFileName,
//     ];
//     cb(null, path.join(...keyPath));
//   },
// });

// Image Filter
const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Please upload only images. Images type must be png, jpg or jpeg.',
      ),
      false,
    );
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 11000000 },
});

const generateUploadMiddleware = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 11000000, files: 5 },
}).array('product_images', 5);

module.exports = {
  upload,
  generateUploadMiddleware,
};
