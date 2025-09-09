const express = require("express");
const multer = require("multer");
const s3 = require("../config/s3");
const { imageQueue } = require("../queues/imageQueue");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload image
router.post("/", upload.single("image"), async (req, res) => {
  const key = `uploads/${Date.now()}-${req.file.originalname}`;
  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    })
    .promise();

  res.json({ key, url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}` });
});

// Queue transformation
router.post("/:key/transform", async (req, res) => {
  const job = await imageQueue.add({ key: req.params.key, transformations: req.body });
  res.json({ message: "Queued for processing", jobId: job.id });
});

module.exports = router;
