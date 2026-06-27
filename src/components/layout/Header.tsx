import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Heart, ShoppingCart, Search, User, LogOut,
  Menu, X, ShoppingBag, Globe, ChevronDown, Package,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import ThemeToggle from '@/components/common/ThemeToggle'
import logo from '@/assets/Group 1116606595.png'
import logo1 from '@/assets/image.png'

const LANG_OPTIONS = [
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'tj', label: 'Тоҷикӣ', short: 'TJ', flag: '🇹🇯' },
] as const

const NAV_LINKS = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
] as const

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0))
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length)
  const profile = useAppSelector((s) => s.user?.profile)

  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const activeLang = LANG_OPTIONS.find((l) => l.code === i18n.language) ?? LANG_OPTIONS[0]

  const userInitial = profile?.userName
    ? profile.userName.charAt(0).toUpperCase()
    : null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMobileOpen(false)
  }

  const changeLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('i18nextLng', code)
  }

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-[#1a1a1a] sticky top-0 z-40 font-poppins transition-colors duration-200 shadow-[0_1px_8px_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center gap-6 lg:gap-10">

        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <img src={logo1} alt="Fastkar" className="block dark:hidden h-9 w-auto object-contain" />
          <img src={logo} alt="Fastkar" className="hidden dark:block h-9 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex lg:ml-[90px] items-center gap-1">
          {NAV_LINKS.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                isActive(to)
                  ? 'text-[#E11D48] font-semibold bg-[#E11D48]/6'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              {t(key)}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              to="/register"
              className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-all duration-150"
            >
              {t('nav.register')}
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center rounded-xl px-3.5 h-[38px] gap-2 transition-all duration-200 border ${
            searchFocused
              ? 'bg-white dark:bg-[#0a0a0a] border-[#E11D48]/60 shadow-sm shadow-[#E11D48]/10 w-60 lg:w-72'
              : 'bg-[#F5F5F5] dark:bg-[#141414] border-transparent w-44 lg:w-56'
          }`}
        >
          <Search size={15} className={`shrink-0 transition-colors ${searchFocused ? 'text-[#E11D48]' : 'text-gray-400'}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t('buttons.search')}
            className="bg-transparent text-sm text-black dark:text-white placeholder:text-gray-400 outline-none flex-1 min-w-0 font-poppins"
          />
        </form>

        {/* Right icon group */}
        <div className="flex items-center gap-0.5">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative hidden md:flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:text-[#E11D48] hover:bg-[#E11D48]/8 dark:hover:bg-[#E11D48]/10 transition-all duration-150"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-[3px] bg-[#E11D48] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:text-[#E11D48] hover:bg-[#E11D48]/8 dark:hover:bg-[#E11D48]/10 transition-all duration-150"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-[3px] bg-[#E11D48] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <ThemeToggle className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all duration-150" />

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all duration-150 outline-none text-sm font-medium">
                <Globe size={15} />
                <span>{activeLang.short}</span>
                <ChevronDown size={11} className="text-gray-300 dark:text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[148px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] shadow-xl rounded-xl p-1.5 mt-1"
            >
              {LANG_OPTIONS.map(({ code, label, short, flag }) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => changeLang(code)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors dark:focus:bg-[#1a1a1a] ${
                    i18n.language === code
                      ? 'text-[#E11D48] font-semibold bg-[#E11D48]/6'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] focus:bg-gray-50'
                  }`}
                >
                  <span className="text-base leading-none">{flag}</span>
                  <span className="text-xs text-gray-400 w-5 font-mono">{short}</span>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-[#2a2a2a] mx-1.5" />

          {/* ─── User zone ─── */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Avatar button */}
                <button className="hidden md:flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl border border-gray-200 dark:border-[#2a2a2a] hover:border-[#E11D48]/40 hover:bg-[#E11D48]/5 dark:hover:bg-[#E11D48]/8 transition-all duration-150 outline-none group">
                  {/* Avatar circle */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9f1239] flex items-center justify-center shadow-sm shadow-[#E11D48]/30 shrink-0">
                    {userInitial
                      ? <span className="text-white text-xs font-bold leading-none">{userInitial}</span>
                      : <User size={13} className="text-white" />
                    }
                  </div>
                  <ChevronDown
                    size={13}
                    className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] shadow-2xl rounded-2xl p-1.5 mt-1.5"
              >
                {/* Profile header */}
                {profile?.userName && (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9f1239] flex items-center justify-center shadow-sm shadow-[#E11D48]/30 shrink-0">
                        <span className="text-white text-sm font-bold leading-none">{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-black dark:text-white truncate">{profile.userName}</p>
                        <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-[#222]" />
                  </>
                )}

                <DropdownMenuItem
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] focus:bg-gray-50 dark:focus:bg-[#1a1a1a] transition-colors"
                  onClick={() => navigate('/account')}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#222] flex items-center justify-center shrink-0">
                    <User size={14} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  {t('nav.account')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] focus:bg-gray-50 dark:focus:bg-[#1a1a1a] transition-colors"
                  onClick={() => navigate('/products')}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#222] flex items-center justify-center shrink-0">
                    <Package size={14} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  {t('account.order_history')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] focus:bg-gray-50 dark:focus:bg-[#1a1a1a] transition-colors"
                  onClick={() => navigate('/wishlist')}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#222] flex items-center justify-center shrink-0">
                    <Heart size={14} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  {t('nav.wishlist')}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-[#222]" />

                <DropdownMenuItem
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-[#E11D48] hover:bg-[#E11D48]/8 focus:bg-[#E11D48]/8 dark:hover:bg-[#E11D48]/10 dark:focus:bg-[#E11D48]/10 transition-colors"
                  onClick={handleLogout}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                    <LogOut size={14} className="text-[#E11D48]" />
                  </div>
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-xl border border-gray-200 dark:border-[#2a2a2a] hover:border-[#E11D48]/50 hover:bg-[#E11D48]/5 text-gray-600 dark:text-gray-400 hover:text-[#E11D48] text-sm font-medium transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                <User size={13} className="text-gray-500 dark:text-gray-400" />
              </div>
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-all ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[580px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#1a1a1a] px-4 pt-3 pb-5 space-y-0.5">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded-xl px-3.5 h-10 gap-2 mb-3"
          >
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('buttons.search')}
              className="bg-transparent text-sm text-black dark:text-white placeholder:text-gray-400 outline-none flex-1"
            />
          </form>

          {NAV_LINKS.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center py-2.5 px-3 rounded-xl text-sm transition-colors ${
                isActive(to)
                  ? 'bg-[#E11D48]/8 text-[#E11D48] font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              {t(key)}
            </Link>
          ))}

          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Heart size={15} className="text-gray-400" />
              {t('nav.wishlist')}
            </div>
            {wishlistCount > 0 && (
              <span className="bg-[#E11D48] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <div className="border-t border-gray-100 dark:border-[#1a1a1a] !mt-3 !pt-3 flex items-center justify-between px-1">
            <ThemeToggle className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300" iconSize={16} showText={true} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors outline-none">
                  <Globe size={15} />
                  <span>{activeLang.flag}</span>
                  <span>{activeLang.short}</span>
                  <ChevronDown size={11} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[148px] dark:bg-[#111] dark:border-[#222] rounded-xl p-1.5">
                {LANG_OPTIONS.map(({ code, label, short, flag }) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => { changeLang(code); setMobileOpen(false) }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm dark:focus:bg-[#1a1a1a] ${
                      i18n.language === code
                        ? 'text-[#E11D48] font-semibold bg-[#E11D48]/6'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <span>{flag}</span>
                    <span className="text-xs text-gray-400 w-5 font-mono">{short}</span>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="!mt-2 space-y-0.5">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                  <User size={15} className="text-gray-400" /> {t('nav.login')}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                  <ShoppingBag size={15} className="text-gray-400" /> {t('nav.register')}
                </Link>
              </>
            ) : (
              <>
                {profile?.userName && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-gray-50 dark:bg-[#141414] rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9f1239] flex items-center justify-center shadow-sm shadow-[#E11D48]/20 shrink-0">
                      <span className="text-white text-sm font-bold">{userInitial}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-black dark:text-white truncate">{profile.userName}</p>
                      <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                    </div>
                  </div>
                )}
                <Link to="/account" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                  <User size={15} className="text-gray-400" /> {t('nav.account')}
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-[#E11D48] hover:bg-[#E11D48]/8 transition-colors">
                  <LogOut size={15} /> {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
