const sharp = require("sharp");
const s3 = require("../config/s3");
const { imageQueue } = require("../queues/imageQueue");

imageQueue.process(async (job) => {
  const { key, transformations } = job.data;

  // download image from S3
  const img = await s3.getObject({ Bucket: process.env.S3_BUCKET, Key: key }).promise();

  let pipeline = sharp(img.Body);

  if (transformations.resize) {
    pipeline = pipeline.resize(transformations.resize.width, transformations.resize.height);
  }
  if (transformations.grayscale) {
    pipeline = pipeline.grayscale();
  }
  if (transformations.watermark) {
    pipeline = pipeline.composite([{ input: "watermark.png", gravity: "southeast" }]);
  }

  const output = await pipeline.toBuffer();

  // save transformed image back to S3
  const newKey = `transformed/${Date.now()}-${key}`;
  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET,
      Key: newKey,
      Body: output,
      ContentType: "image/jpeg"
    })
    .promise();

  return { key: newKey, url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${newKey}` };
});
