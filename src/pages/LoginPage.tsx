import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginUser } from '@/features/auth/authThunks'
import { clearError } from '@/features/auth/authSlice'

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)
  const [form, setForm] = useState({ userName: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-white dark:bg-[#0d0d0d] flex items-center justify-center px-4 font-poppins">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium font-inter text-black dark:text-gray-200 tracking-tight mb-2">
            {t('auth.login_title')}
          </h1>
          <p className="text-gray-500 text-sm">{t('auth.login_subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-[#DB4444] text-[#DB4444] p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#0d0d0d] px-1.5 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {t('auth.email_or_phone')}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-[#262626] rounded px-4 py-3.5 bg-transparent text-black dark:text-gray-200 outline-none focus:border-black dark:focus:border-white transition-colors text-sm"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#0d0d0d] px-1.5 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {t('auth.password')}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full border border-gray-300 dark:border-[#262626] rounded px-4 py-3.5 bg-transparent text-black dark:text-gray-200 outline-none focus:border-black dark:focus:border-white transition-colors text-sm pr-12"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-center pt-1">
            <Link to="#" className="text-[#DB4444] text-sm font-medium hover:underline">
              {t('auth.forgot_password')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#DB4444] hover:bg-[#c53737] text-white font-medium rounded transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? t('auth.signing_in') : t('auth.login_submit')}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-black dark:text-gray-200 border-b border-black font-medium">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
