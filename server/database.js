const { Pool } = require('pg')

// Pool manages multiple connections efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false
})

// Helper — runs a query and returns rows
async function query(text, params) {
  const result = await pool.query(text, params)
  return result
}

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      time TEXT NOT NULL,
      servings INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id),
      is_public INTEGER DEFAULT 1,
      source TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_recipes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      recipe_id INTEGER NOT NULL REFERENCES recipes(id),
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Add columns if they don't exist yet
  await pool.query(`
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_public INTEGER DEFAULT 1
  `).catch(() => {})

  await pool.query(`
    ALTER TABLE recipes ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'user'
  `).catch(() => {})

  console.log('Database initialized ✅')
}

module.exports = { query, initializeDatabase }