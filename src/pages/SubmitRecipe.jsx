import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  ImagePlus,
  Clock3,
  Users,
  List,
  BookOpen,
  Plus,
  X,
  Globe,
  Lock,
  Send,
  ChefHat,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import { submitRecipe } from '../api/recipes'

export default function SubmitRecipe() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    time: '',
    servings: '',
    description: '',
    ingredients: '',
    steps: '',
    is_public: true,
    source: 'user',
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Convert image file to base64
  function handleImageChange(e) {
    const file = e.target.files[0]

    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    const reader = new FileReader()

    reader.onloadend = () => {
      setImageBase64(reader.result)
    }

    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImagePreview(null)
    setImageBase64(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '')

      const stepsArray = formData.steps
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '')

      if (ingredientsArray.length === 0 || stepsArray.length === 0) {
        setError('Please add at least one ingredient and one step')
        setLoading(false)
        return
      }

      await submitRecipe({
        ...formData,
        servings: Number(formData.servings),
        ingredients: ingredientsArray,
        steps: stepsArray,
        image: imageBase64 || null,
        is_public: formData.is_public ? 1 : 0,
      })

      navigate('/cookbook')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="mb-7 sm:mb-8">
          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-[42px]
              text-[#24211F]
              leading-tight
            "
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
            }}
          >
            Share Your Recipe
          </h1>

          <p className="text-xs sm:text-sm text-[#756E68] mt-1">
            Share your favorite recipe with the community.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            className="
              mb-6
              px-4
              py-3
              rounded-xl
              bg-red-50
              border
              border-red-100
              text-red-500
              text-xs
            "
          >
            {error}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}
        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            lg:grid-cols-[340px_minmax(0,1fr)]
            gap-5
            lg:gap-6
            items-start
          "
        >

          {/* =================================================
              IMAGE UPLOAD
          ================================================== */}
          <section
            className="
              bg-white
              border
              border-[#E9E4DF]
              rounded-2xl
              p-3
              shadow-[0_4px_18px_rgba(36,33,31,0.04)]
            "
          >
            <div
              className="
                relative
                min-h-[360px]
                sm:min-h-[430px]
                lg:min-h-[570px]
                rounded-xl
                border
                border-dashed
                border-[#E7BFA8]
                bg-[#FAF7F2]
                overflow-hidden
                flex
                items-center
                justify-center
              "
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/10" />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                      absolute
                      top-3
                      right-3
                      w-8
                      h-8
                      rounded-full
                      bg-white/95
                      text-[#625C57]
                      flex
                      items-center
                      justify-center
                      hover:text-red-500
                      transition-colors
                      shadow-sm
                    "
                    aria-label="Remove image"
                  >
                    <X size={15} />
                  </button>

                  <label
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      -translate-x-1/2
                      px-4
                      py-2
                      rounded-full
                      bg-white/95
                      text-[#625C57]
                      text-xs
                      font-medium
                      cursor-pointer
                      hover:bg-white
                      transition-colors
                      shadow-sm
                    "
                  >
                    Change image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <label
                  className="
                    w-full
                    h-full
                    min-h-[360px]
                    sm:min-h-[430px]
                    lg:min-h-[570px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    cursor-pointer
                    px-8
                  "
                >
                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-white
                      border
                      border-[#E9E4DF]
                      text-[#756E68]
                      flex
                      items-center
                      justify-center
                      mb-4
                    "
                  >
                    <Upload size={22} strokeWidth={1.7} />
                  </div>

                  <p className="text-sm font-medium text-[#24211F]">
                    Drag & Drop Image
                  </p>

                  <p className="text-xs text-[#756E68] mt-1">
                    or click to browse your files
                  </p>

                  <p className="text-[9px] text-[#9A928C] mt-4 max-w-[180px] leading-relaxed">
                    High quality food photography recommended
                    (JPG, PNG)
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* =================================================
              FORM CONTENT
          ================================================== */}
          <section
            className="
              bg-white
              border
              border-[#E9E4DF]
              rounded-2xl
              shadow-[0_4px_18px_rgba(36,33,31,0.04)]
              p-5
              sm:p-6
              lg:p-7
            "
          >

            {/* ===============================================
                BASIC INFORMATION
            ================================================ */}
            <div className="space-y-5">

              {/* Recipe title */}
              <div>
                <label className="block text-[11px] font-medium text-[#625C57] mb-1.5">
                  Recipe Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Rustic Tomato Basil Pasta"
                  required
                  className="
                    w-full
                    h-10
                    bg-white
                    border
                    border-[#E7E0D9]
                    rounded-lg
                    px-3
                    text-xs
                    text-[#24211F]
                    placeholder:text-[#9A928C]
                    outline-none
                    focus:border-[#F47A32]
                    focus:ring-2
                    focus:ring-[#F47A32]/10
                    transition
                  "
                />
              </div>

              {/* Category + Cook time + Servings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-medium text-[#625C57] mb-1.5">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      h-10
                      bg-white
                      border
                      border-[#E7E0D9]
                      rounded-lg
                      px-3
                      text-xs
                      text-[#24211F]
                      outline-none
                      focus:border-[#F47A32]
                      focus:ring-2
                      focus:ring-[#F47A32]/10
                      transition
                    "
                  >
                    <option value="">Select...</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                {/* Cook time */}
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-medium text-[#625C57] mb-1.5">
                    <Clock3 size={11} />
                    Cook Time
                  </label>

                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="30 mins"
                    required
                    className="
                      w-full
                      h-10
                      bg-white
                      border
                      border-[#E7E0D9]
                      rounded-lg
                      px-3
                      text-xs
                      text-[#24211F]
                      placeholder:text-[#9A928C]
                      outline-none
                      focus:border-[#F47A32]
                      focus:ring-2
                      focus:ring-[#F47A32]/10
                      transition
                    "
                  />
                </div>

                {/* Servings */}
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-medium text-[#625C57] mb-1.5">
                    <Users size={11} />
                    Servings
                  </label>

                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    required
                    className="
                      w-full
                      h-10
                      bg-white
                      border
                      border-[#E7E0D9]
                      rounded-lg
                      px-3
                      text-xs
                      text-[#24211F]
                      placeholder:text-[#9A928C]
                      outline-none
                      focus:border-[#F47A32]
                      focus:ring-2
                      focus:ring-[#F47A32]/10
                      transition
                    "
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-medium text-[#625C57] mb-1.5">
                  Short Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us a little about this recipe..."
                  rows={3}
                  required
                  className="
                    w-full
                    bg-white
                    border
                    border-[#E7E0D9]
                    rounded-lg
                    px-3
                    py-2.5
                    text-xs
                    leading-5
                    text-[#24211F]
                    placeholder:text-[#9A928C]
                    resize-none
                    outline-none
                    focus:border-[#F47A32]
                    focus:ring-2
                    focus:ring-[#F47A32]/10
                    transition
                  "
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E9E4DF] my-6" />

            {/* ===============================================
                INGREDIENTS
            ================================================ */}
            <section>
              <div className="flex items-center gap-2 mb-1">
                <List
                  size={15}
                  className="text-[#C85A1C]"
                  strokeWidth={1.8}
                />

                <h2 className="text-sm font-semibold text-[#24211F]">
                  Ingredients
                </h2>
              </div>

              <p className="text-[10px] text-[#756E68] mb-3">
                Add one ingredient per line.
              </p>

              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder={
                  '2 cups flour\n1 tsp salt\n3 eggs'
                }
                rows={6}
                required
                className="
                  w-full
                  bg-white
                  border
                  border-[#E7E0D9]
                  rounded-lg
                  px-3
                  py-2.5
                  text-xs
                  leading-6
                  text-[#24211F]
                  placeholder:text-[#9A928C]
                  resize-y
                  outline-none
                  focus:border-[#F47A32]
                  focus:ring-2
                  focus:ring-[#F47A32]/10
                  transition
                "
              />
            </section>

            {/* ===============================================
                INSTRUCTIONS
            ================================================ */}
            <section className="mt-6">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen
                  size={15}
                  className="text-[#C85A1C]"
                  strokeWidth={1.8}
                />

                <h2 className="text-sm font-semibold text-[#24211F]">
                  Instructions
                </h2>
              </div>

              <p className="text-[10px] text-[#756E68] mb-3">
                Add one step per line.
              </p>

              <textarea
                name="steps"
                value={formData.steps}
                onChange={handleChange}
                placeholder={
                  'Mix the dry ingredients.\nAdd eggs and stir.\nBake at 180°C for 30 mins.'
                }
                rows={7}
                required
                className="
                  w-full
                  bg-white
                  border
                  border-[#E7E0D9]
                  rounded-lg
                  px-3
                  py-2.5
                  text-xs
                  leading-6
                  text-[#24211F]
                  placeholder:text-[#9A928C]
                  resize-y
                  outline-none
                  focus:border-[#F47A32]
                  focus:ring-2
                  focus:ring-[#F47A32]/10
                  transition
                "
              />
            </section>

            {/* Divider */}
            <div className="h-px bg-[#E9E4DF] my-6" />

            {/* ===============================================
                VISIBILITY
            ================================================ */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E5] text-[#C85A1C] flex items-center justify-center shrink-0">
                    {formData.is_public ? (
                      <Globe size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#24211F]">
                      Visibility
                    </p>

                    <p className="text-[10px] text-[#756E68] mt-0.5 leading-relaxed">
                      {formData.is_public
                        ? 'This recipe will be visible to the community.'
                        : 'This recipe will only be visible in your Cookbook.'}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      is_public: !formData.is_public,
                    })
                  }
                  className="
                    w-12
                    h-6
                    rounded-full
                    relative
                    transition-colors
                    shrink-0
                  "
                  style={{
                    backgroundColor: formData.is_public
                      ? '#F47A32'
                      : '#D8D0C9',
                  }}
                  aria-label="Toggle recipe visibility"
                >
                  <span
                    className={`
                      absolute
                      top-1
                      w-4
                      h-4
                      bg-white
                      rounded-full
                      shadow-sm
                      transition-transform
                      ${
                        formData.is_public
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }
                    `}
                  />
                </button>
              </div>
            </section>

            {/* ===============================================
                SUBMIT
            ================================================ */}
            <div className="flex justify-end mt-7">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  sm:w-auto
                  min-w-[160px]
                  h-10
                  px-6
                  rounded-full
                  bg-[#F47A32]
                  hover:bg-[#E96820]
                  disabled:bg-[#F5B28D]
                  text-white
                  text-xs
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                "
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Recipe
                  </>
                )}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}