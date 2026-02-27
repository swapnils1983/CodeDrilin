# CodeDrilin

CodeDrilin is a full-stack coding practice platform with:
- user authentication (JWT + cookies)
- problem solving and submissions
- contest creation and participation
- admin problem/contest management
- AI doubt-solving chat for problem context

## Tech Stack

### Frontend
- React + Vite
- Redux Toolkit
- React Router
- Tailwind CSS + DaisyUI
- Monaco Editor

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (cookie-based)
- Socket.IO (contest room connections)
- Judge0 API (code execution)
- Google Gemini API (AI chat)

## Project Structure

```text
CodeDrilin/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── admin/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    │   ├── store/
    │   └── utils/
    └── package.json
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- RapidAPI Judge0 credentials
- Google Gemini API key

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
GEMINI_KEY=your_google_gemini_api_key
JUDGE0_API=https://judge0-ce.p.rapidapi.com/submissions/batch
X_RAPIDAPI_KEY=your_rapidapi_key
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Installation

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

### 1) Start backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 2) Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Available Scripts

### Backend (`backend/package.json`)
- `npm run dev` — start backend with nodemon
- `npm start` — start backend with node

### Frontend (`frontend/package.json`)
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Backend Route Overview

Base URL: `http://localhost:5000`

### Auth (`/user`)
- `POST /user/register`
- `POST /user/login`
- `POST /user/logout`
- `POST /user/admin/register` (admin only)
- `GET /user/check-auth`

### Problems (`/problem`)
- `POST /problem/create` (admin only)
- `PUT /problem/update/:id` (admin only)
- `DELETE /problem/delete/:id` (admin only)
- `GET /problem/problemById/:id`
- `GET /problem/getAllProblem`
- `GET /problem/problemSolvedByUser`

### Submissions (`/submission`)
- `POST /submission/submit/:id`
- `POST /submission/run/:id`
- `GET /submission/get-submissions/:problemId`

### Contests (`/contest`)
- `GET /contest/`
- `GET /contest/:id`
- `POST /contest/create` (admin only)
- `POST /contest/:contestId/register`
- `GET /contest/check/is-registered/:contestId`
- `POST /contest/:contestId/submit/:problemId`

### AI Chat (`/ai`)
- `POST /ai/chat`

## Notes

- Authentication relies on cookies and protected routes use middleware.
- CORS is configured for:
  - `http://localhost:5173`
  - `https://code-drilin.vercel.app`
- In current backend auth code, login/register cookies are set with `secure: true` and `sameSite: 'none'`, so for strict local browser testing you may need HTTPS locally or adjust cookie config in development.

## Deployment

- Frontend includes `vercel.json` and can be deployed to Vercel.
- Set frontend `VITE_API_BASE_URL` to your deployed backend URL.
- Configure backend environment variables in your hosting provider.
