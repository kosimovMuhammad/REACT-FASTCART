import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, ChevronLeft, ChevronRight, Eye,
  Headphones, Heart, Loader2, ShieldCheck, Truck,
} from 'lucide-react'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCategories } from '@/features/categories/categoryThunks'
import { fetchProducts } from '@/features/products/productThunks'
import { addToCart } from '@/features/cart/cartSlice'
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import { toast } from '@/components/ui/sonner'
import { useCountdown } from '@/hooks/useCountdown'
import { imgFallback, resolveImageUrl } from '@/lib/utils'
import type { Product } from '@/types'
import CategoryCard from '@/components/common/CategoryCard'
import Loader from '@/components/common/Loader'
import ProductCard from '@/components/common/ProductCard'

import speakersImg from '@/assets/652e82cd70aa6522dd785109a455904c.png'
import perfumeImg from '@/assets/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png'
import womenImg from '@/assets/attractive-woman-wearing-hat-posing-black-background 1.png'
import ps5Img from '@/assets/ps5-slim-goedkope-playstation_large 1.png'
import img from '@/assets/hero_endframe__cvklg0xk3w6e_large 2.png'
import frame from '@/assets/Frame 694.png'

function pad(n: number) { return String(n).padStart(2, '0') }

function CountdownTimer({ variant = 'default' }: { variant?: 'default' | 'light' }) {
  const target = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(d.getHours() + 11)
    d.setMinutes(d.getMinutes() + 31)
    d.setSeconds(d.getSeconds() + 37)
    return d
  }, [])
  const { days, hours, minutes, seconds } = useCountdown(target)

  if (variant === 'light') {
    const CircleUnit = ({ value, label }: { value: number; label: string }) => (
      <div className="flex flex-col items-center">
        <div className="w-[62px] h-[62px] sm:w-[72px] sm:h-[72px] rounded-full bg-white flex flex-col items-center justify-center">
          <span className="text-black text-lg sm:text-xl font-bold font-inter leading-none">{pad(value)}</span>
          <span className="text-black text-[10px] sm:text-xs font-poppins mt-0.5">{label}</span>
        </div>
      </div>
    )
    return (
      <div className="flex items-center gap-4 sm:gap-6">
        <CircleUnit value={hours} label="Hours" />
        <CircleUnit value={days} label="Days" />
        <CircleUnit value={minutes} label="Minutes" />
        <CircleUnit value={seconds} label="Seconds" />
      </div>
    )
  }

  const Unit = ({ value, label, isRed = false }: { value: number; label: string; isRed?: boolean }) => (
    <div className="flex flex-col items-start">
      <span className="text-black/60 dark:text-gray-500 text-[10px] font-poppins font-semibold uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-[28px] sm:text-[32px] font-bold font-inter leading-none tracking-widest ${isRed ? 'text-[#E11D48]' : 'text-black dark:text-white'}`}>{pad(value)}</span>
    </div>
  )
  const Dot = () => (
    <div className="flex flex-col items-center justify-center gap-1.5 mt-4 sm:mt-[22px]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
    </div>
  )
  return (
    <div className="flex items-start gap-3 sm:gap-4 bg-[#F5F5F5]/60 dark:bg-[#111111] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-transparent dark:border-[#2f2f2f] self-start">
      <Unit value={days} label="Days" />
      <Dot />
      <Unit value={hours} label="Hours" />
      <Dot />
      <Unit value={minutes} label="Mins" />
      <Dot />
      <Unit value={seconds} label="Secs" isRed />
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-4 h-10 bg-[#E11D48] rounded" />
      <span className="text-[#E11D48] font-poppins font-semibold text-base">{text}</span>
    </div>
  )
}

function CompactProductCard({ product }: { product: Product }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const wishlistItems = useAppSelector((s) => s.wishlist.items)
  const addingToCartIds = useAppSelector((s) => s.cart.addingToCartIds)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  const isWishlisted = wishlistItems.some((p) => p.id === product.id)
  const isAdding = addingToCartIds.includes(product.id)
  const imageUrl = resolveImageUrl(product.images[0]?.imageUrl)
  const displayPrice = product.hasDiscount ? product.discountPrice : product.price
  const discountPercent = product.hasDiscount && product.price > 0
    ? Math.round((product.price - product.discountPrice) / product.price * 100)
    : 0
  const rating = Math.min(5, Math.max(3, (product.id % 3) + 3))
  const colors = product.colors?.slice(0, 3) || []

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAdding) return
    if (!isAuthenticated) {
      toast.error(t('messages.please_login'), { description: t('messages.login_desc') })
      navigate('/login')
      return
    }
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(t('messages.added_to_cart'), { description: product.productName })
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast(t('messages.removed_from_wishlist'), { description: product.productName })
    } else {
      dispatch(addToWishlist(product))
      toast.success(t('messages.added_to_wishlist'), { description: product.productName })
    }
  }

  return (
    <div className="group font-poppins">
      <div className="relative bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img src={imageUrl} alt={product.productName} className="w-full h-52 object-contain p-6 group-hover:scale-105 transition-transform duration-300" onError={imgFallback} />
        </Link>
        {product.hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-xs font-medium px-2.5 py-1 rounded">-{discountPercent}%</span>
        )}
        {!product.hasDiscount && product.id % 5 === 0 && (
          <span className="absolute top-3 left-3 bg-[#00FF66] text-black dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded">NEW</span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleWishlist} className="w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full flex items-center justify-center shadow hover:bg-[#E11D48] hover:text-white transition-colors">
            <Heart size={16} className={isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : 'text-black dark:text-gray-200'} />
          </button>
          <Link to={`/products/${product.id}`} className="w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full flex items-center justify-center shadow hover:bg-[#E11D48] hover:text-white transition-colors text-black dark:text-gray-200">
            <Eye size={16} />
          </Link>
        </div>
        <button onClick={handleAddToCart} disabled={isAdding} className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm font-medium py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2 disabled:opacity-70">
          {isAdding ? <><Loader2 size={14} className="animate-spin" /> {t('messages.loading')}</> : t('product.add_to_cart')}
        </button>
      </div>
      <div className="mt-3 space-y-1.5 px-1">
        <Link to={`/products/${product.id}`}>
          <p className="text-sm font-medium text-black dark:text-gray-200 line-clamp-2 hover:text-[#E11D48] transition-colors leading-snug">{product.productName}</p>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[#E11D48] font-medium text-sm">${displayPrice}</span>
          {product.hasDiscount && <span className="text-gray-400 text-sm line-through">${product.price}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={i <= rating ? '#FFAD33' : '#e5e7eb'} stroke={i <= rating ? '#FFAD33' : '#e5e7eb'} strokeWidth="1" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-xs">({(product.id * 7) % 100 + 10})</span>
        </div>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {colors.map((c) => (
              <span key={c.id} className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-[#1a1a1a] hover:border-gray-400 transition-colors cursor-pointer" style={{ backgroundColor: c.hexCode }} title={c.colorName} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const HomePage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((s) => s.products)
  const { categories } = useAppSelector((s) => s.categories)

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 100 }))
    dispatch(fetchCategories())
  }, [dispatch])

  const flashSaleProducts = products
  const exploreProducts = products

  const SERVICES = [
    { icon: <Truck size={40} />, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over $140' },
    { icon: <Headphones size={40} />, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
    { icon: <ShieldCheck size={40} />, title: 'MONEY BACK GUARANTEE', desc: 'We return money within 30 days' },
  ]

  return (
    <main className="bg-background text-foreground font-poppins">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Left sidebar — real API categories with HoverCard subcategories */}
          <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-gray-200 dark:border-[#1a1a1a] pr-4 pt-4">
            {categories.length === 0
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-10 my-1 bg-gray-100 dark:bg-[#1a1a1a] rounded animate-pulse" />
                ))
              : categories.slice(0, 9).map((cat) => {
                  const hasSubs = (cat.subCategories?.length ?? 0) > 0

                  if (!hasSubs) {
                    return (
                      <Link
                        key={cat.id}
                        to={`/products?categoryId=${cat.id}`}
                        className="flex items-center justify-between py-3 text-sm text-black dark:text-gray-200 hover:text-[#E11D48] transition-colors group font-poppins"
                      >
                        <span>{cat.categoryName}</span>
                      </Link>
                    )
                  }

                  return (
                    <HoverCard key={cat.id} openDelay={80} closeDelay={120}>
                      <HoverCardTrigger asChild>
                        <Link
                          to={`/products?categoryId=${cat.id}`}
                          className="flex items-center justify-between py-3 text-sm text-black dark:text-gray-200 hover:text-[#E11D48] transition-colors group font-poppins"
                        >
                          <span>{cat.categoryName}</span>
                          <ChevronRight size={14} className="text-gray-400 group-hover:text-[#E11D48] transition-colors" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="right"
                        align="start"
                        sideOffset={16}
                        className="w-56 p-0 overflow-hidden bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#222] shadow-2xl rounded-xl"
                      >
                        {/* Header */}
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#E11D48] ">
                          <ChevronRight size={14} className="text-white/80" />
                          <span className="text-sm font-semibold text-white tracking-wide">
                            {cat.categoryName}
                          </span>
                        </div>

                        {/* Subcategory list */}
                        <div className="py-1.5">
                          {cat.subCategories!.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/products?categoryId=${cat.id}&subCategoryId=${sub.id}`}
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#E11D48]/8 hover:text-[#E11D48] dark:hover:bg-[#E11D48]/10 transition-all duration-150 group/item"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover/item:bg-[#E11D48] transition-colors shrink-0" />
                                <span>{sub.subCategoryName}</span>
                              </div>
                              <ChevronRight size={12} className="text-gray-300 dark:text-gray-600 group-hover/item:text-[#E11D48] opacity-0 group-hover/item:opacity-100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                            </Link>
                          ))}
                        </div>

                        {/* Footer — view all */}
                        <div className="border-t border-gray-100 dark:border-[#222] px-4 py-2.5">
                          <Link
                            to={`/products?categoryId=${cat.id}`}
                            className="flex items-center gap-1.5 text-xs font-medium text-[#E11D48] hover:underline underline-offset-2"
                          >
                            View all in {cat.categoryName}
                            <ChevronRight size={11} />
                          </Link>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )
                })
            }
          </aside>

          {/* Hero Banner */}
          <div className="flex-1 min-w-0">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true, bulletClass: 'swiper-custom-bullet', bulletActiveClass: 'swiper-custom-bullet-active' }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="rounded overflow-hidden bg-black"
            >
              <SwiperSlide>
                <div className="relative min-h-[384px] flex items-center w-full bg-black">
                  <div className="relative z-10 p-8 lg:p-16 max-w-md">
                    <div className="flex items-center gap-4 mb-5">
                      <svg className="w-10 h-10 fill-white" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.13-1.9-14.34-6.08-3.7-3.03-7.61-7.85-11.71-14.43-6.41-10.3-11.39-21.67-14.93-34.14-3.53-12.47-5.3-24.18-5.3-35.14 0-14.06 3.42-25.42 10.27-34.1 6.85-8.67 15.35-13.08 25.5-13.23 4.8 0 10.01 1.34 15.64 4.02 5.62 2.68 9.53 4.02 11.71 4.02 1.8 0 5.61-1.39 11.45-4.17 5.84-2.78 11.16-4.07 15.96-3.87 11.31.51 20.31 4.54 27.01 12.09-10.15 6.13-15.13 14.51-14.93 25.13.2 8.44 3.46 15.53 9.8 21.28 6.33 5.75 14.07 8.84 23.21 9.27-2.02 8.65-5.5 17.14-10.45 25.46zm-31.4-110.9c0 6.64-2.45 12.91-7.36 18.82-5.94 7.07-13 10.87-21.19 11.41-.33-1.12-.5-2.29-.5-3.5 0-6.42 2.6-13.1 7.8-20.03 5.3-6.94 12.07-10.98 20.3-12.12.33 1.8.64 3.61.95 5.42z" />
                      </svg>
                      <span className="text-white text-base font-poppins">iPhone 14 Series</span>
                    </div>
                    <h1 className="text-white font-inter font-semibold text-4xl lg:text-5xl leading-tight mb-6">Up to 10% <br /> off Voucher</h1>
                    <Link to="/products" className="inline-flex items-center gap-2 text-white font-poppins font-medium text-base border-b border-white pb-1 hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                      {t('home.shop_now')} <ArrowRight size={20} />
                    </Link>
                  </div>
                  <div className="absolute right-1 bottom-0 top-0 w-64 lg:w-[600px] flex items-end justify-center overflow-hidden pointer-events-none">
                    <img src={img} alt="iPhone 14" className="w-[500px] object-contain" />
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative min-h-[344px] flex items-center w-full bg-black">
                  <div className="relative z-10 p-8 lg:p-16 max-w-md">
                    <span className="text-gray-400 text-sm font-poppins block mb-3">MacBook Air M2</span>
                    <h1 className="text-white font-inter font-semibold text-4xl lg:text-5xl leading-tight mb-6">Supercharged <br /> by M2 Chip</h1>
                    <Link to="/products" className="inline-flex items-center gap-2 text-white font-poppins font-medium text-base border-b border-white pb-1">
                      {t('home.shop_now')} <ArrowRight size={20} />
                    </Link>
                  </div>
                  <div className="absolute right-1 bottom-[-2] pt-10 top-0 w-64 lg:w-[500px] flex items-end justify-center overflow-hidden pointer-events-none">
                    <img src={img} alt="MacBook" className="w-[500px] object-contain" />
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative min-h-[344px] flex items-center w-full bg-black">
                  <div className="relative z-10 p-8 lg:p-16 max-w-md">
                    <span className="text-[#DB4444] text-sm font-poppins block mb-3">Limited Edition</span>
                    <h1 className="text-white font-inter font-semibold text-4xl lg:text-5xl leading-tight mb-6">Smart Watch <br /> Series 8</h1>
                    <Link to="/products" className="inline-flex items-center gap-2 text-white font-poppins font-medium text-base border-b border-white pb-1">
                      {t('home.explore')} <ArrowRight size={20} />
                    </Link>
                  </div>
                  <div className="absolute right-1 bottom-[-3] pt-10 top-0 w-64 lg:w-[600px] flex items-end justify-center overflow-hidden pointer-events-none">
                    <img src={img} alt="Watch" className="w-[500px] object-contain" />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .swiper-custom-bullet { width:12px;height:12px;display:inline-block;border-radius:50%;background:rgba(255,255,255,0.5);margin:0 4px!important;cursor:pointer;transition:all 0.3s ease; }
          .swiper-custom-bullet-active { background:#DB4444!important;border:2px solid #ffffff;transform:scale(1.15); }
        ` }} />
      </section>

      {/* Flash Sales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200 dark:border-[#1a1a1a]">
        <SectionLabel text={t('home.todays')} />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center md:items-end gap-6 sm:gap-12 lg:gap-20">
            <h2 className="text-3xl lg:text-4xl font-semibold font-inter text-black dark:text-white tracking-tight">{t('home.flash_sales')}</h2>
            <CountdownTimer />
          </div>
          <div className="hidden sm:flex items-center gap-2 md:mb-1.5">
            <button className="flash-prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5] dark:bg-[#202020] text-black dark:text-white flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button className="flash-next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] dark:bg-[#202020] text-black dark:text-white flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        {loading ? <Loader /> : (
          <Swiper modules={[Navigation, Autoplay]} navigation={{ prevEl: '.flash-prev', nextEl: '.flash-next' }} autoplay={{ delay: 5000 }} spaceBetween={20} slidesPerView={2} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} className="pb-4">
            {flashSaleProducts.map((p) => <SwiperSlide key={p.id}><ProductCard product={p} /></SwiperSlide>)}
          </Swiper>
        )}
        <div className="flex justify-center mt-10">
          <Link to="/products" className="px-12 py-4 bg-[#E11D48] text-white font-poppins font-medium rounded hover:bg-[#BE123C] transition-colors">
            {t('home.view_all_products')}
          </Link>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200 dark:border-[#1a1a1a]">
        <SectionLabel text={t('home.categories')} />
        <div className="flex items-center justify-between mt-4 mb-8">
          <h2 className="text-3xl font-semibold font-inter text-black dark:text-gray-200">{t('home.browse_category')}</h2>
          {categories.length > 6 && (
            <div className="flex items-center gap-2">
              <button className="cat-prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5] dark:bg-[#202020] text-black dark:text-white flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors"><ChevronLeft size={24} /></button>
              <button className="cat-next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] dark:bg-[#202020] text-black dark:text-white flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors"><ChevronRight size={24} /></button>
            </div>
          )}
        </div>
        {categories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-[#F5F5F5] dark:bg-gray-800 rounded animate-pulse" />)}
          </div>
        ) : categories.length <= 6 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((c, index) => <CategoryCard key={c.id || index} category={c} />)}
          </div>
        ) : (
          <Swiper modules={[Navigation]} navigation={{ prevEl: '.cat-prev', nextEl: '.cat-next' }} spaceBetween={16} slidesPerView={2} breakpoints={{ 480: { slidesPerView: 3 }, 640: { slidesPerView: 4 }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6 } }} className="pb-4">
            {categories.map((c, index) => <SwiperSlide key={c.id || index}><CategoryCard category={c} /></SwiperSlide>)}
          </Swiper>
        )}
      </section>

      {/* Best Selling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200 dark:border-[#1a1a1a]">
        <SectionLabel text={t('home.this_month')} />
        <div className="flex items-center justify-between mt-4 mb-8">
          <h2 className="text-3xl font-semibold font-inter text-black dark:text-gray-200">{t('home.best_selling')}</h2>
          <Link to="/products" className="px-8 py-3 bg-[#E11D48] text-white font-poppins font-medium rounded hover:bg-[#BE123C] transition-colors text-sm">
            {t('home.view_all')}
          </Link>
        </div>
        {loading ? <Loader /> : (
          <Swiper modules={[Navigation, Autoplay]} navigation={{ prevEl: '.best-prev', nextEl: '.best-next' }} autoplay={{ delay: 6000 }} spaceBetween={20} slidesPerView={2} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} className="pb-4">
            {exploreProducts.map((p, index) => <SwiperSlide key={index}><ProductCard product={p} /></SwiperSlide>)}
          </Swiper>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative bg-black rounded-lg overflow-hidden min-h-[450px] flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#0D6B3F] rounded-full opacity-30 blur-3xl" />
            <div className="absolute right-10 bottom-10 w-96 h-96 bg-[#0D6B3F] rounded-full opacity-20 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full p-8 sm:p-12 lg:p-16 gap-10">
            <div className="flex-1 space-y-8 max-w-xl">
              <p className="text-[#00FF66] font-poppins font-semibold text-sm md:text-base tracking-wider">{t('home.categories')}</p>
              <h2 className="text-white font-inter font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
                {t('home.music_title')}
              </h2>
              <CountdownTimer variant="light" />
              <div>
                <Link to="/products" className="inline-block px-10 py-4 bg-[#00FF66] text-black font-poppins font-semibold text-sm sm:text-base rounded hover:bg-[#00df59] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                  {t('home.buy_now')}
                </Link>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative w-full">
              <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
             <img src={frame} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200 dark:border-[#1a1a1a]">
        <SectionLabel text={t('home.our_products')} />
        <div className="flex items-center justify-between mt-4 mb-8">
          <h2 className="text-3xl font-semibold font-inter text-black dark:text-gray-200">{t('home.explore')}</h2>
          <div className="flex items-center gap-2">
            <button className="explore-prev w-10 h-10 rounded-full bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors"><ChevronLeft size={18} /></button>
            <button className="explore-next w-10 h-10 rounded-full bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        {loading ? <Loader /> : (
          <Swiper modules={[Navigation, Autoplay]} navigation={{ prevEl: '.explore-prev', nextEl: '.explore-next' }} autoplay={{ delay: 7000 }} spaceBetween={20} slidesPerView={2} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} className="pb-4">
            {exploreProducts.map((p) => <SwiperSlide key={p.id}><CompactProductCard product={p} /></SwiperSlide>)}
          </Swiper>
        )}
        <div className="flex justify-center mt-10">
          <Link to="/products" className="px-12 py-4 bg-[#E11D48] text-white font-poppins font-medium rounded hover:bg-[#BE123C] transition-colors">
            {t('home.view_all_products')}
          </Link>
        </div>
      </section>

      {/* New Arrival */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200 dark:border-[#1a1a1a]">
        <SectionLabel text="Featured" />
        <h2 className="text-3xl font-semibold font-inter text-black dark:text-gray-200 mt-4 mb-8">{t('home.new_arrival')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[30px] auto-rows-[284px]">
          <div className="md:col-span-2 md:row-span-2 relative bg-black rounded-md overflow-hidden group cursor-pointer">
            <Link to="/products/ps5" className="block w-full h-full">
              <img src={ps5Img} alt="PlayStation 5" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
              <div className="absolute bottom-8 left-8 z-10 flex flex-col items-start">
                <h3 className="text-white text-2xl font-semibold font-inter tracking-wide mb-2">PlayStation 5</h3>
                <p className="text-neutral-300 text-sm font-normal max-w-[242px] mb-4">Black and White version of the PS5 coming out on sale.</p>
                <span className="text-white font-medium text-base underline underline-offset-8 decoration-1 hover:text-[#E11D48] transition-colors">{t('home.shop_now')}</span>
              </div>
            </Link>
          </div>
          <div className="md:col-span-2 relative bg-[#0D0D0D] rounded-md overflow-hidden group cursor-pointer">
            <Link to="/products/womens-collection" className="block w-full h-full">
              <img src={womenImg} alt="Women's Collections" className="absolute right-0 top-0 h-full w-3/5 object-cover object-left group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/70 to-transparent z-0" />
              <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-start max-w-[240px]">
                <h3 className="text-white text-2xl font-semibold font-inter tracking-wide mb-2">Women's Collections</h3>
                <p className="text-neutral-300 text-xs md:text-sm font-normal mb-4">Featured woman collections that give you another vibe.</p>
                <span className="text-white font-medium text-base underline underline-offset-8 decoration-1 hover:text-[#E11D48] transition-colors">{t('home.shop_now')}</span>
              </div>
            </Link>
          </div>
          <div className="relative bg-[#0D0D0D] rounded-md overflow-hidden group cursor-pointer">
            <Link to="/products/speakers" className="block w-full h-full flex items-center justify-center">
              <img src={speakersImg} alt="Speakers" className="w-3/4 h-3/4 object-contain object-center group-hover:scale-105 transition-transform duration-500 mb-8" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
              <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start">
                <h3 className="text-white text-xl font-semibold font-inter tracking-wide mb-1">Speakers</h3>
                <p className="text-neutral-300 text-xs font-normal mb-2">Amazon wireless speakers</p>
                <span className="text-white font-medium text-sm underline underline-offset-4 decoration-1 hover:text-[#E11D48] transition-colors">{t('home.shop_now')}</span>
              </div>
            </Link>
          </div>
          <div className="relative bg-[#0D0D0D] rounded-md overflow-hidden group cursor-pointer">
            <Link to="/products/perfume" className="block w-full h-full flex items-center justify-center">
              <img src={perfumeImg} alt="Perfume" className="w-3/4 h-3/4 object-contain object-center group-hover:scale-105 transition-transform duration-500 mb-8" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
              <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start">
                <h3 className="text-white text-xl font-semibold font-inter tracking-wide mb-1">Perfume</h3>
                <p className="text-neutral-300 text-xs font-normal mb-2">GUCCI INTENSE OUD EDP</p>
                <span className="text-white font-medium text-sm underline underline-offset-4 decoration-1 hover:text-[#E11D48] transition-colors">{t('home.shop_now')}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {SERVICES.map((s) => (
            <div key={s.title} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-gray-100 dark:ring-gray-800 group-hover:bg-[#E11D48] group-hover:text-white group-hover:ring-[#E11D48]/20 transition-all duration-300">
                {s.icon}
              </div>
              <p className="font-poppins font-bold text-base text-black dark:text-white">{s.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
