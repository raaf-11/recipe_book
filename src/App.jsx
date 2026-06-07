import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import RecipeDetail from './pages/RecipeDetail'
import MyCookbook from './pages/MyCookbook'
import SubmitRecipe from './pages/SubmitRecipe'
import AIGenerator from './pages/AIGenerator'

export default function App() {
  return (
    <BrowserRouter>
      {/* Temporary nav — just for testing today */}
      <nav className="bg-orange-500 p-4 flex gap-4 text-white font-semibold">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/cookbook">Cookbook</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/generate">Generate</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/cookbook" element={<MyCookbook />} />
        <Route path="/submit" element={<SubmitRecipe />} />
        <Route path="/generate" element={<AIGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}