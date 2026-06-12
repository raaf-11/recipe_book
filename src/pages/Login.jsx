import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../api/auth'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let data
      if (isLogin) {
        data = await loginUser({ email: formData.email, password: formData.password })
      } else {
        data = await registerUser(formData)
      }

      // Save user + token globally via context
      login(data.user, data.token)

      // Redirect to home
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-orange-500 text-center mb-2">
           Recipe Book
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400 text-sm hover:text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleMode}
            className="text-orange-500 font-semibold ml-1 hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>

      </div>
    </div>
  )
}