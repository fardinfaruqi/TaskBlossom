# TaskBlossom

TaskBlossom is a professional full-stack task management application built with React on the frontend and Node.js/Express on the backend. The app supports secure Firebase authentication, including email/password and Google sign-in, and stores user tasks in a MySQL database.

## 🔍 Project Overview

TaskBlossom enables authenticated users to:
- create and manage tasks
- edit or delete tasks
- mark tasks as complete
- apply filtering and search
- persist data across sessions with a MySQL backend

The app is designed with a modern responsive UI and secure access controls so each user only sees their own tasks.

## 🌐 Live Demo

Check out the live version of TaskBlossom at: [https://task-blossom-user.vercel.app/](https://task-blossom-user.vercel.app/)

## 🧩 Architecture

### Frontend
- **React** with Vite for fast development and build performance
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI elements
- **Firebase Auth** for authentication and identity management
- **Axios** for API requests to the backend

### Backend
- **Node.js** and **Express** for the REST API
- **MySQL** for task persistence and user storage
- **Firebase Admin SDK** to verify Firebase ID tokens
- **dotenv** for environment configuration

### Database
- **MySQL** stores application data
- `users` table maps Firebase users to local database records
- `todos` table stores tasks linked to `users.id`

## ✅ Key Features

- Firebase authentication with email/password and Google sign-in
- Secure token validation for every API request
- User-specific todo storage in MySQL
- Task creation, updates, deletion, and completion toggling
- Responsive dashboard with task statistics
- Clean separation between frontend and backend logic

## 🚀 Local Setup

### Prerequisites
- Node.js (recommended 18.0+)
- npm
- MySQL server running

### Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:8080`

### Backend Setup

```sh
cd backend
npm install
npm start
```

Backend default URL: `http://localhost:5000`

## 🛠️ Environment Variables

### Frontend `.env`

Set the Firebase config values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend `backend/.env`

Set the MySQL connection and Firebase admin settings:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=...
DB_NAME=task_blossom_db
PORT=5000
FIREBASE_PROJECT_ID=task-blossom-d3031
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

> Note: `serviceAccountKey.json` should be downloaded from Firebase Console > Project Settings > Service Accounts.

## 🧪 Database Setup

Create the MySQL database manually if needed:

```sql
CREATE DATABASE task_blossom_db;
```

Then run the backend migration script in `backend/`:

```sh
cd backend
node migrate.js
```

## 🔐 Authentication

Task Blossom uses Firebase Authentication for:
- email/password login and signup
- Google OAuth login/signup

Every backend API request is protected by Firebase ID token verification so only authenticated users can access their data.

## 📂 Project Structure

- `frontend/` — React frontend application
- `frontend/src/` — frontend source code
- `frontend/src/components/` — UI and page components
- `frontend/src/context/` — auth provider and state management
- `frontend/src/hooks/` — custom React hooks
- `frontend/src/lib/` — Firebase initialization and utilities
- `backend/` — Express API server
- `backend/db.js` — MySQL connection pool
- `backend/routes/` — todo API routes
- `backend/migrate.js` — database migration script

## 🧾 Build

```sh
cd frontend
npm run build
```

## 📌 Notes

- This project is intended for local development and can be extended for cloud deployment.
- Keep sensitive keys out of version control by using `.env` files.
- The backend verifies Firebase tokens to ensure user data privacy.

---

Task Blossom is built for reliability, secure data storage, and smooth task management. Welcome to a cleaner, more productive workflow.