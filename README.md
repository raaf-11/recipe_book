# Recipe Book

A full-stack recipe management application where users can discover recipes, save their favorites, create and share their own recipes, and generate recipes using AI based on available ingredients.


## Features

- **Recipe Discovery** — Browse, search, and filter recipes by category
- **Recipe Details** — View ingredients, instructions, servings, and cooking time
- **My Cookbook** — Save and manage your favorite recipes
- **Recipe Sharing** — Create, upload, and share personal recipes
- **AI Recipe Generator** — Generate recipes from available ingredients
- **Public / Private Recipes** — Control recipe visibility
- **Authentication** — JWT-based login/register with bcrypt password hashing
- **Responsive UI** — Responsive recipe-focused interface across devices

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| AI | Groq-based AI Recipe Generator |
| Authentication | JWT + bcrypt |
| Routing | React Router |
| Icons | Lucide React |
| API | REST API |
| Data Format | JSON |

##  Project Architecture




                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │   Vite + Tailwind    │
                         └──────────┬───────────┘
                                    │
                              REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │      Node.js         │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐
       │   PostgreSQL   │  │ Authentication │  │  AI Generator   │
       │    Database    │  │   JWT + bcrypt │  │  Groq-based AI  │
       └────────────────┘  └────────────────┘  └─────────────────┘

## API Endpoints

### Authentication — `/api/auth`

Register and login routes. Authentication is not required for these endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in an existing user |

### Recipes — `/api/recipes`

Public `GET` routes and protected `POST`, `PATCH`, and `DELETE` routes.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | Get public recipes |
| `GET` | `/api/recipes/:id` | Get a recipe by ID |
| `GET` | `/api/recipes/mine` | Get recipes created by the logged-in user |
| `POST` | `/api/recipes` | Create a new recipe |
| `PATCH` | `/api/recipes/:id/visibility` | Update recipe visibility |
| `DELETE` | `/api/recipes/:id` | Delete a recipe |

### Cookbook — `/api/cookbook`

All cookbook routes are protected and use `authMiddleware` to authenticate the user.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cookbook` | Get saved recipes |
| `POST` | `/api/cookbook/:id` | Save a recipe to the cookbook |
| `DELETE` | `/api/cookbook/:id` | Remove a recipe from the cookbook |

### AI Generator — `/api/generator`

Calls the Groq API and Unsplash API and returns a complete recipe object.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generator` | Generate a recipe using the provided ingredients |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js v18+
- PostgreSQL 
- Groq API key — console.groq.com
- Unsplash Access Key — unsplash.com/developers

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/recipe-book
cd recipe-book
```

#### 2. Install frontend dependencies

```bash
npm install
```

#### 3. Install backend dependencies

```bash
cd server
npm install
```

## Environment Setup

Create a `.env` file inside the `server` directory:

```env
DATABASE_URL=your_postgres_connection_string
GROQ_API_KEY=your_groq_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
JWT_SECRET=your_secret_key
PORT=3000
```

## Seed the Database

From the `server` directory:

```bash
cd server
node seed.js
```

## Run the Application

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Frontend

From the project root:

```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API key for Llama 3 |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (default 3000) |

## Future Improvements

- Display recipe creator information more prominently
- Show whether a recipe was user-created or AI-generated
- Polished UI
- User profile
- Google authentication
- Deployed version