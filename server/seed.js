const { db, initializeDatabase } = require('./database')

initializeDatabase()

const recipes = [
  {
    title: 'Fluffy Pancakes',
    category: 'Breakfast',
    time: '20 mins',
    servings: 4,
    description: 'Light and fluffy pancakes perfect for a weekend morning.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ingredients: JSON.stringify(['1 ½ cups all-purpose flour','2 tbsp sugar','1 tsp baking powder','½ tsp baking soda','1 cup buttermilk','1 egg','2 tbsp melted butter','Pinch of salt']),
    steps: JSON.stringify(['In a large bowl, whisk together flour, sugar, baking powder, baking soda and salt.','In another bowl, mix buttermilk, egg and melted butter.','Pour the wet ingredients into the dry ingredients and stir until just combined. Do not overmix.','Heat a non-stick pan over medium heat and lightly grease it.','Pour ¼ cup of batter per pancake. Cook until bubbles form on top, then flip.','Cook the other side for 1-2 minutes until golden. Serve warm.'])
  },
  {
    title: 'Avocado Toast',
    category: 'Breakfast',
    time: '10 mins',
    servings: 2,
    description: 'Creamy avocado on toasted sourdough with a pinch of chili flakes.',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800',
    ingredients: JSON.stringify(['2 slices sourdough bread','1 ripe avocado','1 tbsp lemon juice','Salt and pepper to taste','Chili flakes','Optional: poached egg on top']),
    steps: JSON.stringify(['Toast the sourdough slices until golden and crisp.','Scoop the avocado into a bowl. Add lemon juice, salt and pepper.','Mash with a fork to your preferred texture — chunky or smooth.','Spread generously on the toast.','Top with chili flakes and serve immediately.'])
  },
  {
    title: 'Grilled Chicken Salad',
    category: 'Lunch',
    time: '25 mins',
    servings: 2,
    description: 'Fresh greens with grilled chicken, cherry tomatoes and lemon dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ingredients: JSON.stringify(['2 chicken breasts','4 cups mixed greens','1 cup cherry tomatoes, halved','½ cucumber, sliced','3 tbsp olive oil','2 tbsp lemon juice','Salt, pepper, garlic powder']),
    steps: JSON.stringify(['Season chicken with salt, pepper and garlic powder.','Grill on medium-high heat for 6-7 minutes per side until cooked through.','Let chicken rest for 5 minutes, then slice.','In a large bowl, combine greens, tomatoes and cucumber.','Whisk olive oil and lemon juice together for the dressing.','Top salad with sliced chicken and drizzle with dressing.'])
  },
  {
    title: 'Spaghetti Bolognese',
    category: 'Dinner',
    time: '45 mins',
    servings: 4,
    description: 'Classic Italian meat sauce slow cooked with tomatoes and herbs.',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
    ingredients: JSON.stringify(['400g spaghetti','500g ground beef','1 onion, diced','3 garlic cloves, minced','400g canned crushed tomatoes','2 tbsp tomato paste','1 tsp dried oregano','Salt, pepper, olive oil']),
    steps: JSON.stringify(['Heat olive oil in a pan. Sauté onion until soft, then add garlic.','Add ground beef and cook until browned, breaking it apart.','Stir in tomato paste and cook for 2 minutes.','Add crushed tomatoes, oregano, salt and pepper.','Simmer on low heat for 20-25 minutes, stirring occasionally.','Cook spaghetti according to package instructions.','Serve sauce over spaghetti with parmesan on top.'])
  },
  {
    title: 'Butter Chicken',
    category: 'Dinner',
    time: '50 mins',
    servings: 4,
    description: 'Rich and creamy tomato-based curry with tender chicken pieces.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
    ingredients: JSON.stringify(['600g chicken breast, cubed','1 cup plain yogurt','2 tsp garam masala','1 tsp turmeric','1 tsp cumin','400g canned tomatoes','1 cup heavy cream','2 tbsp butter','1 onion, diced','3 garlic cloves, minced','1 tsp ginger paste']),
    steps: JSON.stringify(['Marinate chicken in yogurt, garam masala, turmeric and cumin for 30 mins.','Cook chicken in a pan until lightly charred. Set aside.','In the same pan, melt butter and sauté onion until golden.','Add garlic and ginger paste, cook for 1 minute.','Add canned tomatoes and simmer for 10 minutes.','Blend the sauce until smooth, return to pan.','Add cream and chicken, simmer for 10 more minutes.','Serve with naan or basmati rice.'])
  },
  {
    title: 'Chocolate Lava Cake',
    category: 'Dessert',
    time: '25 mins',
    servings: 2,
    description: 'Warm chocolate cake with a gooey molten center. Pure indulgence.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
    ingredients: JSON.stringify(['100g dark chocolate','100g butter','2 eggs','2 egg yolks','80g powdered sugar','2 tbsp all-purpose flour','Butter and cocoa powder for ramekins']),
    steps: JSON.stringify(['Preheat oven to 200°C. Butter and dust ramekins with cocoa powder.','Melt chocolate and butter together in a bowl over hot water.','Whisk eggs, yolks and sugar until pale and slightly thick.','Fold in the chocolate mixture, then sift in the flour and fold gently.','Pour batter into ramekins and bake for 10-12 minutes.','The edges should be set but the center should still wobble.','Run a knife around the edge, flip onto a plate and serve immediately.'])
  }
]

db.exec('DELETE FROM recipes')

const insert = db.prepare(`
  INSERT INTO recipes (title, category, time, servings, description, image, ingredients, steps)
  VALUES (@title, @category, @time, @servings, @description, @image, @ingredients, @steps)
`)

console.log('Database seeded with 6 recipes ✅')