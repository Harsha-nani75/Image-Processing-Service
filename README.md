---

# 🖼️ Image Processing Service API

Backend service similar to [Cloudinary](https://cloudinary.com/) that allows users to upload, transform, and retrieve images. Built with **Node.js**, **Express**, **AWS S3**, **Sharp**, and **Bull/Redis**.

📌 Project idea from [roadmap.sh](https://roadmap.sh/projects/image-processing-service)

---

## 🚀 Features

* **Authentication** with JWT (Sign-up & Login)
* **Image upload** → store in S3 (or R2/GCS)
* **Transformations** (async via Bull queue):

  * Resize, Crop, Rotate
  * Flip, Mirror
  * Grayscale, Sepia, Blur
  * Watermark overlay
  * Convert formats (JPEG, PNG, WebP, etc.)
* **Retrieve & List Images**
* **Caching** (Redis/CDN) for transformed images
* **Rate limiting** on transformation endpoints

---

## 🛠️ Tech Stack

* **Node.js + Express**
* **AWS S3 / Cloudflare R2 / GCS** → Image storage
* **Sharp** → Image transformations
* **Bull + Redis** → Async job queue
* **Multer** → Handle file uploads
* **JWT** → Auth
* **MySQL (optional)** → For user metadata

---

## ⚡ Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/image-processing-service.git
cd image-processing-service
npm install
```

### 2. Configure `.env`

```env
PORT=5000
JWT_SECRET=supersecret

# AWS S3
AWS_ACCESS_KEY=your-key
AWS_SECRET_KEY=your-secret
AWS_REGION=ap-south-1
S3_BUCKET=my-image-bucket

# Redis
REDIS_URL=redis://127.0.0.1:6379
```

### 3. Run

Start API server:

```bash
npm start
```

Start queue worker (separate terminal):

```bash
node workers/imageWorker.js
```

---

## 📡 API Endpoints

### 🔑 Authentication

* `POST /register` → { username, password }
* `POST /login` → { username, password } → returns JWT

### 🖼️ Image Management

* `POST /api/images`
  Upload image (`multipart/form-data`) → returns S3 URL

* `POST /api/images/:key/transform`
  Queue transformation job:

  ```json
  {
    "resize": { "width": 400, "height": 300 },
    "grayscale": true,
    "watermark": true
  }
  ```

* `GET /api/images/:key`
  Retrieve image (optionally from cache)

* `GET /api/images?page=1&limit=10`
  List paginated images with metadata

---

## 🧩 Next Steps

* ✅ Add **rate limiting** (e.g., express-rate-limit)
* ✅ Cache transformed images in **Redis/CDN**
* ✅ Support advanced filters (brightness, contrast)
* ✅ Add pagination & filtering on image list
* ✅ Document API with **OpenAPI/Swagger**

---

## 📖 Reference

Project idea from 👉 [roadmap.sh Image Processing Service](https://roadmap.sh/projects/image-processing-service)

---
