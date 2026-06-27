import { Eye, Heart, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addToCart } from '@/features/cart/cartSlice'
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import { toast } from '@/components/ui/sonner'
import { resolveImageUrl, imgFallback } from '@/lib/utils'
import type { Product } from '@/types'

interface Props { product: Product }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i <= rating ? '#FFAD33' : '#e5e7eb'} stroke={i <= rating ? '#FFAD33' : '#e5e7eb'} strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}

const ProductCard = ({ product }: Props) => {
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
    ? Math.round((product.price - product.discountPrice) / product.price * 100) : 0
  const rating = Math.min(5, Math.max(3, (product.id % 3) + 3))

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
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
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleWishlist} className="w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full flex items-center justify-center shadow hover:bg-[#E11D48] hover:text-white transition-colors">
            <Heart size={16} className={isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : 'text-black dark:text-gray-200'} />
          </button>
          <Link to={`/products/${product.id}`} className="w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full flex items-center justify-center shadow hover:bg-[#E11D48] hover:text-white transition-colors text-black dark:text-gray-200">
            <Eye size={16} />
          </Link>
        </div>
        <button onClick={handleAddToCart} disabled={isAdding}
          className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm font-medium py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2 disabled:opacity-70">
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
          <StarRating rating={rating} />
          <span className="text-gray-500 text-xs">({(product.id * 7) % 100 + 10})</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
