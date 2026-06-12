import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import RecipeDetail from './pages/RecipeDetail'
import MyCookbook from './pages/MyCookbook'
import SubmitRecipe from './pages/SubmitRecipe'
import AIGenerator from './pages/AIGenerator'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route
          path="/cookbook"
          element={
            <ProtectedRoute>
              <MyCookbook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitRecipe />
            </ProtectedRoute>
          }
        />
        <Route path="/generate" element={<AIGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}