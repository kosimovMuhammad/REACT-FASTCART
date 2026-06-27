import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import { addToCart } from '@/features/cart/cartSlice'
import { fetchProducts } from '@/features/products/productThunks'
import { toast } from '@/components/ui/sonner'
import { resolveImageUrl, imgFallback } from '@/lib/utils'
import ProductCard from '@/components/common/ProductCard'

const WishlistPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items } = useAppSelector((s) => s.wishlist)
  const { products } = useAppSelector((s) => s.products)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 12 }))
  }, [dispatch])

  const handleAddToBag = async (product: typeof items[0]) => {
    if (!isAuthenticated) {
      toast.error(t('messages.please_login'), { description: t('messages.login_desc') })
      return navigate('/login')
    }
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(t('messages.added_to_cart'), { description: product.productName })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl text-black dark:text-gray-200">
          {t('wishlist.title')} ({items.length})
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => items.forEach(item => handleAddToBag(item))}
            className="px-8 py-3 border border-black text-black dark:text-gray-200 rounded font-medium hover:bg-black hover:text-white transition-colors text-sm"
          >
            {t('wishlist.move_all')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-gray-400">
          <Heart size={64} className="text-gray-200" />
          <p className="text-lg text-gray-500">{t('wishlist.empty')}</p>
          <Link to="/products" className="px-8 py-3 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors">
            {t('wishlist.browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-16">
          {items.map((product) => (
            <div key={product.id} className="group relative bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded overflow-hidden">
              {product.hasDiscount && (
                <span className="absolute top-3 left-3 bg-[#E11D48] text-white text-xs px-3 py-1 rounded z-10">
                  -{product.price > 0 ? Math.round((product.price - product.discountPrice) / product.price * 100) : 0}%
                </span>
              )}
              <button
                onClick={() => dispatch(removeFromWishlist(product.id))}
                className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-[#0d0d0d] rounded-full flex items-center justify-center shadow-sm hover:bg-[#E11D48] hover:text-white text-black dark:text-gray-200 transition-colors z-10"
              >
                <Trash2 size={16} />
              </button>
              <Link to={`/products/${product.id}`} className="block aspect-square p-8 flex items-center justify-center">
                <img
                  src={resolveImageUrl(product.images?.[0]?.imageUrl || '')}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                  onError={imgFallback}
                />
              </Link>
              <button
                onClick={() => handleAddToBag(product)}
                className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm py-2.5 text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {t('product.add_to_cart')}
              </button>
              <div className="p-3 pt-0 bg-white dark:bg-[#0d0d0d]">
                <p className="text-sm font-medium text-black dark:text-gray-200 truncate">{product.productName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-[#E11D48]">
                    ${product.hasDiscount ? product.discountPrice : product.price}
                  </span>
                  {product.hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">${product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Just For You */}
      <div className="border-t border-gray-200 dark:border-[#1a1a1a] pt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-4 h-10 bg-[#E11D48] rounded" />
            <h2 className="text-xl font-medium text-black dark:text-gray-200">{t('home.just_for_you')}</h2>
          </div>
          <Link to="/products" className="px-8 py-3 border border-black text-black dark:text-gray-200 rounded font-medium hover:bg-black hover:text-white transition-colors text-sm">
            {t('home.see_all')}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.filter(p => !items.some(w => w.id === p.id)).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
