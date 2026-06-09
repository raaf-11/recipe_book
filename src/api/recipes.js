const BASE_URL='http://localhost:3000/api'

export async function fetchRecipes({ category, search } = {}) {
  const params = new URLSearchParams() 

   if (category && category !== 'All') params.append('category', category)
  if (search) params.append('search', search)

  const query = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${BASE_URL}/recipes${query}`)

  if (!res.ok) throw new Error('Failed to fetch recipes')
  return res.json()
}


export async function fetchRecipeById(id) {
  const res = await fetch(`${BASE_URL}/recipes/${id}`)

  if (!res.ok) throw new Error('Recipe not found')
  return res.json()
}