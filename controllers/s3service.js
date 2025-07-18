const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

module.exports.s3Upload = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${uuid()}-${file.originalname}`,
      Body: file.buffer,
    };
  });
  return Promise.all(
    params.map((el) => {
      return s3.upload(el).promise();
    })
  );
};
