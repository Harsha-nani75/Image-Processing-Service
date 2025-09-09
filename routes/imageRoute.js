const express = require("express");
const multer = require("multer");
const path = require("path");
const authenticate = require("../middleware/auth");
const { uploadImage, transformImage, listImages, getImage } = require("../controllers/imageController");

const router = express.Router();

// file upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", authenticate, upload.single("image"), uploadImage);
router.post("/:id/transform", authenticate, transformImage);
router.get("/", authenticate, listImages);
router.get("/:id", authenticate, getImage);

module.exports = router;
