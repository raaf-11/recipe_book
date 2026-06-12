const BASE_URL = 'http://localhost:3000/api'


function authHeader() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function getSavedRecipes() {
  const res = await fetch(`${BASE_URL}/cookbook`, {
    headers: authHeader()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch cookbook')
  return data
}

export async function saveRecipe(recipe_id) {
  const res = await fetch(`${BASE_URL}/cookbook`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ recipe_id })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to save recipe')
  return data
}

export async function unsaveRecipe(recipe_id) {
  const res = await fetch(`${BASE_URL}/cookbook/${recipe_id}`, {
    method: 'DELETE',
    headers: authHeader()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to remove recipe')
  return data
}