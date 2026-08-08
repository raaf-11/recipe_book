import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UtensilsCrossed,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../api/auth'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let data

      if (isLogin) {
        data = await loginUser({
          email: formData.email,
          password: formData.password,
        })
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

    setFormData({
      name: '',
      email: '',
      password: '',
    })

    setError('')
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex">
      {/* =====================================================
          LEFT SIDE — FOOD IMAGE / BRANDING
      ====================================================== */}
      <section className="relative hidden lg:flex lg:w-[45%] min-h-screen overflow-hidden">
        {/* Background image */}
        <img
          src="/images/login-food.png"
          alt="Freshly prepared food"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Slight bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 xl:p-10">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <UtensilsCrossed
              size={21}
              strokeWidth={2.2}
            />

            <span
              className="text-lg font-semibold"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
              }}
            >
              Recipe Book
            </span>
          </div>

          {/* Bottom text */}
          <div className="max-w-[390px]">
            <h1
              className="text-white text-4xl xl:text-5xl leading-[1.02]"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
              }}
            >
              Cook. Create.
              <br />
              Share.
            </h1>

            <p className="mt-4 text-white/90 text-sm xl:text-[15px] leading-relaxed max-w-[340px]">
              Discover thousands of recipes, save your favorites
              and generate recipes using AI.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT SIDE — LOGIN FORM
      ====================================================== */}
      <section className="flex-1 min-h-screen flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#F47A32] flex items-center justify-center text-white">
              <UtensilsCrossed size={18} />
            </div>

            <span
              className="text-xl text-[#24211F]"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
              }}
            >
              Recipe Book
            </span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(36,33,31,0.06)] border border-[#EEE9E4] px-6 py-7 sm:px-8 sm:py-8">
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#C85A1C]">
                <UtensilsCrossed
                  size={18}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Heading */}
            <h2
              className="text-[26px] text-center text-[#24211F] leading-tight"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
              }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <p className="text-center text-[12px] text-[#756E68] mt-1.5 mb-5">
              {isLogin
                ? 'Log in to your account to continue'
                : 'Create your account to get started'}
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Name — Register only */}
              {!isLogin && (
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="
                      w-full
                      h-10
                      bg-[#F8F7FC]
                      border border-[#E7E0D9]
                      rounded-md
                      pl-3.5 pr-3
                      text-xs
                      text-[#24211F]
                      placeholder:text-[#8A837D]
                      outline-none
                      transition
                      focus:border-[#F47A32]
                      focus:ring-2
                      focus:ring-[#F47A32]/10
                    "
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#625C57]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="
                    w-full
                    h-10
                    bg-[#F8F7FC]
                    border border-[#E7E0D9]
                    rounded-md
                    pl-9 pr-3
                    text-xs
                    text-[#24211F]
                    placeholder:text-[#8A837D]
                    outline-none
                    transition
                    focus:border-[#F47A32]
                    focus:ring-2
                    focus:ring-[#F47A32]/10
                  "
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  size={14}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#625C57]"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="
                    w-full
                    h-10
                    bg-[#F8F7FC]
                    border border-[#E7E0D9]
                    rounded-md
                    pl-9 pr-9
                    text-xs
                    text-[#24211F]
                    placeholder:text-[#8A837D]
                    outline-none
                    transition
                    focus:border-[#F47A32]
                    focus:ring-2
                    focus:ring-[#F47A32]/10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#756E68]
                    hover:text-[#24211F]
                    transition-colors
                  "
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-10
                  mt-1
                  rounded-full
                  bg-[#F47A32]
                  hover:bg-[#E96820]
                  disabled:bg-[#F5B28D]
                  text-white
                  text-xs
                  font-medium
                  transition-colors
                  duration-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#F47A32]/20
                "
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                    ? 'Log In'
                    : 'Create Account'}
              </button>
            </form>

            

            {/* Switch login/register */}
            <p className="text-center text-[10px] text-[#756E68] mt-4">
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}

              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 font-semibold text-[#C85A1C] hover:text-[#E96820] transition-colors"
              >
                {isLogin ? 'Create Account' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}