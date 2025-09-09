const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const imagePath = path.join("uploads", file.filename);

    // save image metadata in DB
    const [result] = await pool.execute(
      "INSERT INTO images (user_id, filename, url, metadata) VALUES (?, ?, ?, ?)",
      [req.user.id, file.filename, `/uploads/${file.filename}`, JSON.stringify({ size: file.size })]
    );

    res.json({
      id: result.insertId,
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

exports.transformImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { transformations } = req.body;

    const [rows] = await pool.execute("SELECT * FROM images WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Image not found" });

    const img = rows[0];
    const inputPath = path.join("uploads", img.filename);
    const outputPath = path.join("uploads", `t_${Date.now()}_${img.filename}`);

    let transformer = sharp(inputPath);

    if (transformations.resize) {
      transformer = transformer.resize(transformations.resize.width, transformations.resize.height);
    }
    if (transformations.rotate) {
      transformer = transformer.rotate(transformations.rotate);
    }
    if (transformations.format) {
      transformer = transformer.toFormat(transformations.format);
    }
    if (transformations.filters?.grayscale) {
      transformer = transformer.grayscale();
    }
    if (transformations.filters?.sepia) {
      transformer = transformer.tint({ r: 112, g: 66, b: 20 });
    }

    await transformer.toFile(outputPath);

    res.json({ transformedUrl: `/${outputPath}` });
  } catch (err) {
    res.status(500).json({ error: "Transformation failed", details: err.message });
  }
};

exports.listImages = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM images WHERE user_id=?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "List failed", details: err.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM images WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Image not found" });

    const img = rows[0];
    res.sendFile(path.resolve(img.url.replace("/", "")));
  } catch (err) {
    res.status(500).json({ error: "Retrieve failed", details: err.message });
  }
};
