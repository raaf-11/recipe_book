# 🍳 Recipe Book

A full-stack recipe management application where users can discover recipes, save their favorites, create and share their own recipes, and generate recipes using AI based on available ingredients.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes for authenticated users

### 🏠 Recipe Discovery

- Browse public recipes
- Filter recipes by category
  - Breakfast
  - Lunch
  - Dinner
  - Dessert
- Search recipes by title
- Responsive recipe cards
- Detailed recipe pages

### 📖 My Cookbook

- Save recipes to a personal cookbook
- Remove saved recipes
- View recipes created by the logged-in user
- Separate saved recipes from personally created recipes

### 👩‍🍳 Create & Share Recipes

- Submit your own recipes
- Add recipe images
- Add ingredients and cooking instructions
- Specify cooking time and servings
- Choose whether a recipe is public or private
- Delete your own recipes
- Change recipe visibility after creation

### 🤖 AI Recipe Generator

- Enter ingredients you already have
- Generate a complete recipe using AI
- Generated recipes include:
  - Recipe title
  - Category
  - Cooking time
  - Servings
  - Description
  - Ingredients
  - Instructions
  - Recipe image when available
- Save generated recipes to your Cookbook
- Choose whether generated recipes are public or private

### 📱 Responsive UI

- Responsive layouts across desktop, tablet, and mobile
- Modern recipe-focused interface
- Consistent typography, spacing, colors, and component styling
- Interactive hover and transition effects

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt

### AI

- Llama-based AI recipe generation

---

## 🏗️ Project Structure

```text
recipe-book/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── cookbook.js
│   │   │   ├── generator.js
│   │   │   └── recipes.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── MyCookbook.jsx
│   │   │   ├── SubmitRecipe.jsx
│   │   │   └── AIGenerator.jsx
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cookbook.js
│   │   ├── recipes.js
│   │   └── generator.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── database.js
│   ├── seed.js
│   └── server.js
│
└── README.md