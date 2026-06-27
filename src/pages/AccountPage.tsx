import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchUserProfile, updateUserProfile } from '@/features/user/userThunks'
import Loader from '@/components/common/Loader'
import { toast } from '@/components/ui/sonner'

const SIDEBAR = [
  {
    title: 'Manage My Account',
    items: [
      { label: 'My Profile',         to: '/account',   active: true },
      { label: 'Address Book',       to: null },
      { label: 'My Payment Options', to: null },
    ],
  },
  {
    title: 'My Orders',
    items: [
      { label: 'My Returns',       to: null },
      { label: 'My Cancellations', to: null },
    ],
  },
  {
    title: 'My WishList',
    items: [],
    to: '/wishlist',
  },
]

const AccountPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { profile, loading } = useAppSelector((s) => s.user)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '',
    currentPassword: '', newPassword: '', confirmPassword: '',
  })

  useEffect(() => { dispatch(fetchUserProfile()) }, [dispatch])

  useEffect(() => {
    if (profile) {
      const parts = (profile.userName || '').split(' ')
      setForm((prev) => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: profile.email || '',
      }))
    }
  }, [profile])

  const handleSave = async () => {
    const result = await dispatch(updateUserProfile({
      userName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phoneNumber: profile?.phoneNumber || '',
    }))
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Changes saved successfully')
    }
  }

  const handleReset = () => {
    if (profile) {
      const parts = (profile.userName || '').split(' ')
      setForm({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: profile.email || '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }

  if (loading && !profile) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">

      {/* Breadcrumb + welcome */}
      <div className="flex items-center justify-between mb-10">
        <p className="text-sm text-gray-400 flex items-center gap-1.5">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          <span className="text-black dark:text-gray-200 font-medium">My Account</span>
        </p>
        <p className="text-sm text-gray-400 hidden sm:block">
          Welcome!{' '}
          <span className="text-[#E11D48] font-semibold">{profile?.userName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* ── Sidebar ── */}
        <aside className="text-sm space-y-6">
          {SIDEBAR.map((section) => (
            <div key={section.title}>
              {/* Section title — some are links (WishList), some are headers */}
              {section.to ? (
                <Link
                  to={section.to}
                  className="block font-bold text-black dark:text-gray-100 hover:text-[#E11D48] transition-colors mb-3"
                >
                  {section.title}
                </Link>
              ) : (
                <p className="font-bold text-black dark:text-gray-100 mb-3">{section.title}</p>
              )}

              {section.items.length > 0 && (
                <ul className="pl-4 space-y-2.5">
                  {section.items.map((item) =>
                    item.to ? (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className={`transition-colors ${
                            item.active
                              ? 'text-[#E11D48] font-medium'
                              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <button
                          onClick={() => navigate('/404')}
                          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-left"
                        >
                          {item.label}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
        </aside>

        {/* ── Profile form ── */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0d0d0d] shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none rounded-2xl px-8 py-8">

          <h2 className="text-lg font-semibold text-[#E11D48] mb-7">Profile</h2>

          {/* Name + Address row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">First name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 bg-transparent outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 bg-transparent outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 bg-transparent outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Street address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 bg-transparent outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>
          </div>

          {/* Password Changes */}
          <p className="text-sm font-semibold text-black dark:text-gray-200 mb-4 mt-2">Password Changes</p>
          <div className="space-y-4 mb-8">
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Current password"
              className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-[#E11D48] transition-colors bg-transparent"
            />
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="New password"
              className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-[#E11D48] transition-colors bg-transparent"
            />
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-[#E11D48] transition-colors bg-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-5">
            <button
              onClick={handleReset}
              className="text-sm text-black dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-10 py-3 bg-[#E11D48] text-white rounded-lg font-semibold hover:bg-[#BE123C] transition-colors disabled:opacity-50 text-sm shadow-sm shadow-[#E11D48]/30"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
