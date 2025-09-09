const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );
    const token = jwt.sign({ id: result.insertId, username }, process.env.JWT_SECRET);
    res.json({ id: result.insertId, username, token });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM users WHERE username=?", [username]);
    if (!rows.length) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ id: user.id, username: user.username, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};
