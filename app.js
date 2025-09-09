const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
// app.use(bodyParser.json());



const authRoutes = require("./routes/authRoute");
const imageRoutes = require("./routes/imageRoute");
const imageRoutess3 = require("./routes/imageRoutes");


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/images/s3", imageRoutess3);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
