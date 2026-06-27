import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { registerUser } from '@/features/auth/authThunks'
import { clearError } from '@/features/auth/authSlice'

const RegisterPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)
  const [form, setForm] = useState({ userName: '', phoneNumber: '', email: '', password: '', confirmPassword: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    if (form.password !== form.confirmPassword) return
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-white dark:bg-[#0d0d0d] flex items-center justify-center px-4 font-poppins">
      <div className="w-full max-w-[370px]">
        <h1 className="text-4xl font-medium font-inter text-black dark:text-white tracking-tight mb-3">
          {t('auth.register_title')}
        </h1>
        <p className="text-gray-500 text-base mb-10">{t('auth.register_subtitle')}</p>

        {error && (
          <div className="bg-red-50 border border-[#E11D48] text-[#E11D48] p-3 rounded mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="userName" type="text" placeholder={t('auth.username')}
            className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-black transition-colors dark:bg-[#1a1a1a] dark:border-gray-600"
            value={form.userName} onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder={t('auth.phone')}
            className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-black transition-colors dark:bg-[#1a1a1a] dark:border-gray-600"
            value={form.phoneNumber} onChange={handleChange} required />
          <input name="email" type="email" placeholder={t('auth.email')}
            className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-black transition-colors dark:bg-[#1a1a1a] dark:border-gray-600"
            value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder={t('auth.password')}
            className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-black transition-colors dark:bg-[#1a1a1a] dark:border-gray-600"
            value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder={t('auth.confirm_password')}
            className={`w-full border rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none transition-colors dark:bg-[#1a1a1a] dark:border-gray-600 ${
              form.confirmPassword && form.confirmPassword !== form.password
                ? 'border-[#E11D48] focus:border-[#E11D48]'
                : 'border-gray-300 dark:border-[#1a1a1a] focus:border-black'
            }`}
            value={form.confirmPassword} onChange={handleChange} required />
          {form.confirmPassword && form.confirmPassword !== form.password && (
            <p className="text-xs text-[#E11D48] -mt-2">{t('errors.password_mismatch')}</p>
          )}

          <button type="submit" disabled={loading || (!!form.confirmPassword && form.password !== form.confirmPassword)}
            className="w-full py-4 bg-[#E11D48] text-white font-medium rounded hover:bg-[#BE123C] transition-colors disabled:opacity-50 text-base">
            {loading ? t('messages.loading') : t('auth.register_submit')}
          </button>

          <button type="button" className="w-full py-4 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 text-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="text-black dark:text-white border-b border-black dark:border-white hover:text-[#E11D48] hover:border-[#E11D48] transition-colors font-medium">
            {t('auth.login_submit')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
