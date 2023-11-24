const { Readable } = require('stream');

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuid } = require('uuid');

const awsCredentials = require('../config/aws.config');

const s3Client = new S3Client({});

const uploadFile = async (file) => {
  const bodyStream = Readable.from(file.buffer);

  // Create an Upload instance
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsCredentials.bucketName,
      Key: `public/upload/profiles/${uuid()}-${file.originalname}`,
      Body: bodyStream,
    },
  });

  return upload.done();
};

module.exports = {
  uploadFile,
};
