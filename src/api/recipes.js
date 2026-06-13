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

export async function submitRecipe(recipeData) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(recipeData)
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to submit recipe')
  return data
}

export async function fetchMyRecipes() {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/recipes/mine`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch your recipes')
  return data
}

export async function deleteRecipe(id) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete recipe')
  return data
}

export async function updateVisibility(id, is_public) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/recipes/${id}/visibility`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ is_public })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update visibility')
  return data
}