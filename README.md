# 🧳 Lost & Found - College Cornerstone Project

A full-stack MERN-based Lost and Found management system built for college campuses. Users can report lost or found items, communicate with finders/owners, and manage item data with admin support.

---

## 📁 Project Structure

```
📦CampusTrack
 ┣ 📂backend      ← Node.js Express API
 ┣ 📂frontend     ← React Vite frontend
 ┗ 📄docker-compose.yml
```

---

## 🚀 Features

- 🔐 Authentication with roles (User, Admin)
- 📦 CRUD for Lost/Found items
- 💬 Messaging between users
- 🔔 Notifications
- 📁 Image uploads with Cloudinary
- 🧠 Smart search and filters
- 🧑‍💻 Admin panel to manage users/items

---

## ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB Atlas (no local DB required)
- Cloudinary Account (for image uploads)
- Docker (for containerized setup)
- Git

---

## 🛠️ Local Setup Instructions (Without Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Swastik007sharma/CampusTrack.git
cd CampusTrack
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### ✅ Backend `.env` Example

Create a `.env` file inside `/backend`:

```env
PORT=5000

# Database
MONGODB_URI=your_mongodb_uri

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Email (Optional for production)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL & CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Other Configs
UPLOADS_FOLDER=./uploads
LOG_FILE_PATH=./logs/access.log
NODE_ENV=development
```

#### 🚀 Run Backend

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### ✅ Frontend `.env` Example

Create a `.env` file inside `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 🚀 Run Frontend

```bash
npm run dev
```

---

## 🐳 Docker Setup (Recommended)

### 1. Add Environment Files

- Copy your backend `.env` to `/backend/.env`
- Frontend uses environment variables at build time, so `VITE_API_BASE_URL` must be defined during `docker build`.

### 2. Build & Start the App

From root:

```bash
docker-compose up --build
```

The services will be available at:

- 🔙 Backend → http://localhost:5000
- 🔜 Frontend → http://localhost:3000

> No local MongoDB setup needed. Uses MongoDB Atlas.

---

## 📸 Screenshots

> _Coming Soon!_

---

## 📚 Docs

- [API Documentation](backend/API_Documentation.md)
- [Frontend Guide](backend/DocForFrontendDev.md)
- [Routes Overview](FinalRoutes.md)

---

## 👨‍💻 Author

Made with ❤️ by [Swastik Sharma](https://github.com/Swastik007sharma)

---

## 📝 License

MIT License
