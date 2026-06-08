const Database=require('better-sqlite3')
const path=require('path')

const db=new Database(path.join(__dirname,'recipes.db'))

function initializeDatabase(){

    db.exec(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
        `)
    
    db.exec(`
    CREATE TABLE IF NOT EXISTS recipes ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      time TEXT NOT NULL,
      servings INTEGER NOT NULL,
      description TEXT,
      image TEXT,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      recipe_id INTEGER NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    )
  `)

  console.log('Database initialized ✅')


}
module.exports = { db, initializeDatabase }
