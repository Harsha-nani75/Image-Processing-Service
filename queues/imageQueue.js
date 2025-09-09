const Queue = require("bull");
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);
const imageQueue = new Queue("image-transform", process.env.REDIS_URL);

module.exports = { imageQueue, redis };
