# Hacker News Bookmarks MERN App

Production-style MERN application for scraping the top 10 Hacker News stories, saving them to MongoDB, and letting authenticated users bookmark stories.

## Tech Stack

- MongoDB, Mongoose
- Express.js, Node.js
- React.js with Vite
- React Context API for auth state
- JWT authentication
- bcrypt password hashing
- axios and cheerio for scraping

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
frontend/
  src/
    api/
    components/
    context/
    pages/
    routes/
    App.jsx
```

## Setup

Install dependencies:

```bash
npm run install:all
```

Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

Set a strong `JWT_SECRET` in `backend/.env`.

Create frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

Make sure MongoDB is running locally or update `MONGO_URI` to point to your MongoDB instance.

## Environment Variables

Backend:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hn_bookmarks
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
RUN_SCRAPER_ON_STARTUP=false
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Frontend: `http://127.0.0.1:5173`

Backend health check: `http://localhost:5000/health`

## API Routes

Auth:

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user and return JWT |
| POST | `/api/auth/login` | Login user and return JWT |

Stories:

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/stories?page=1&limit=10&sortBy=postedAt&order=desc` | Paginated stories |
| GET | `/api/stories/:id` | Single story |
| POST | `/api/stories/:id/bookmark` | Bookmark story, requires Bearer token |

Bookmarks:

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/bookmarks?page=1&limit=10` | Logged-in user's bookmarked stories |

Scraper:

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/scrape` | Scrape top 10 stories from Hacker News and upsert them |

Protected route header:

```http
Authorization: Bearer <jwt>
```

## Deployment

1. Provision MongoDB Atlas or another managed MongoDB instance.
2. Deploy `backend` to Render, Railway, Fly.io, or a Node-capable host.
3. Set backend environment variables in the host dashboard, including `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.
4. Deploy `frontend` to Netlify, Vercel, or static hosting.
5. Set `VITE_API_URL` to the deployed backend URL plus `/api`.
6. Build frontend with `npm run build --prefix frontend`.
7. Confirm `/health`, `/api/scrape`, auth, story listing, and bookmarks work against production URLs.

## Notes

- Duplicate stories are avoided with a unique index on `Story.url` and scraper bulk upserts.
- Passwords are hashed with bcrypt before saving.
- JWT secrets are loaded from environment variables and are not hardcoded.
- `RUN_SCRAPER_ON_STARTUP=true` enables automatic scraping when the backend starts. The manual `POST /api/scrape` route is always available.
