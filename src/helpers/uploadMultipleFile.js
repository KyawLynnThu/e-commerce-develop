const { Readable } = require('stream');

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuid } = require('uuid');

const awsCredentials = require('../config/aws.config');

const s3Client = new S3Client({});

const uploadMultiProductImages = async (files) => {
  const uploadPromises = files.map(async (file) => {
    try {
      const bodyStream = Readable.from(file.buffer);

      // Create an Upload instance for each file
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: awsCredentials.bucketName,
          Key: `public/upload/product_images/${uuid()}-${file.originalname}`,
          Body: bodyStream,
        },
      });

      const result = await upload.done();
      return { file, result };
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error as needed
      return { file, error };
    }
  });

  // Execute all upload promises asynchronously
  return Promise.all(uploadPromises);
};

module.exports = {
  uploadMultiProductImages,
};
