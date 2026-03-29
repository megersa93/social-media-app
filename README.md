# SocialApp - MERN Stack Social Media

## Setup

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm start              # or: npm run dev (with nodemon)
```

### Frontend
```bash
cd client
npm install
npm run dev
```

App runs at http://localhost:5173, API at http://localhost:5000

## Features
- Register / Login (JWT auth)
- Global feed + Following feed
- Create, edit, delete posts (with image upload)
- Like / unlike posts
- Comments (add, delete)
- Follow / unfollow users
- Profile page with edit support

## API Routes
| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/users/:id | No |
| PUT | /api/users/:id | Yes |
| POST | /api/users/follow/:id | Yes |
| POST | /api/users/unfollow/:id | Yes |
| GET | /api/posts | No |
| GET | /api/posts/feed | Yes |
| POST | /api/posts | Yes |
| GET | /api/posts/:id | No |
| PUT | /api/posts/:id | Yes |
| DELETE | /api/posts/:id | Yes |
| POST | /api/posts/like/:id | Yes |
| POST | /api/posts/comment/:id | Yes |
| DELETE | /api/posts/:id/comment/:commentId | Yes |
"# social-media-app" 
