import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Left — App title */}
      <Link to="/" className="text-xl font-bold text-orange-500">
        🍳 Recipe Book
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Link
          to="/cookbook"
          className="text-2xl hover:scale-110 transition-transform"
          title="My Cookbook"
        >
          📖
        </Link>
        <Link
          to="/generate"
          className="text-2xl hover:scale-110 transition-transform"
          title="AI Generator"
        >
          🤖
        </Link>

        {/* Show username + logout if logged in */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              Hi, {user.name} 👋
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-600 font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm text-orange-500 font-semibold hover:underline"
          >
            Login
          </Link>
        )}
      </div>

    </nav>
  )
}