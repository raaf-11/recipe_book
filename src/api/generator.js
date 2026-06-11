const BASE_URL = 'http://localhost:3000/api'

export async function generateRecipe(ingredients) {
  const res = await fetch(`${BASE_URL}/generator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to generate recipe')
  return data
}