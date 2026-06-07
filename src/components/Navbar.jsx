import { Link } from 'react-router-dom'

// Props: none — this is the same on every page for now
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Left — App title */}
      <Link to="/" className="text-xl font-bold text-orange-500">
        🍳 Recipe Book
      </Link>

      {/* Right — Icon buttons */}
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
      </div>

    </nav>
  )
}