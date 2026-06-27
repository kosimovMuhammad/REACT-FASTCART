import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, Minus, Plus, Truck, RotateCcw, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProductById, fetchProducts } from '@/features/products/productThunks'
import { addToCart } from '@/features/cart/cartSlice'
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/wishlistSlice'
import { clearSelectedProduct } from '@/features/products/productSlice'
import { toast } from '@/components/ui/sonner'
import { resolveImageUrl, imgFallback } from '@/lib/utils'
import Loader from '@/components/common/Loader'
import ProductCard from '@/components/common/ProductCard'
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const ProductDetailPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedProduct: product, loading, products } = useAppSelector((s) => s.products)
  const wishlistItems = useAppSelector((s) => s.wishlist.items)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isWishlisted = wishlistItems.some((p) => p.id === product?.id)

  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [relatedPage, setRelatedPage] = useState(1)
  const RELATED_PER_PAGE = 4

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)))
      dispatch(fetchProducts({ pageSize: 12 }))
    }
    return () => { dispatch(clearSelectedProduct()) }
  }, [dispatch, id])

  useEffect(() => {
    setActiveImg(0)
    setQuantity(1)
    if (product?.colors?.length) setSelectedColor(product.colors[0].id)
  }, [product?.id])

  const relatedProducts = useMemo(
    () => products.filter((p) => p.id !== product?.id),
    [products, product?.id]
  )
  const totalRelatedPages = Math.ceil(relatedProducts.length / RELATED_PER_PAGE)
  const pagedRelated = relatedProducts.slice(
    (relatedPage - 1) * RELATED_PER_PAGE,
    relatedPage * RELATED_PER_PAGE
  )

  if (loading) return <Loader fullScreen />
  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-poppins">
      <p className="text-gray-500">{t('product.not_found')}</p>
      <button onClick={() => navigate('/products')} className="text-[#DB4444] hover:underline cursor-pointer">
        {t('product.back_to_products')}
      </button>
    </div>
  )

  const displayPrice = product.hasDiscount ? product.discountPrice : product.price

  const handleAddToCart = async () => {
    if (isAddingToCart) return
    if (!isAuthenticated) {
      toast.error(t('messages.please_login'), { description: t('messages.login_desc') })
      navigate('/login')
      return
    }
    setIsAddingToCart(true)
    dispatch(addToCart({ product, quantity }))
    toast.success(t('messages.added_to_cart'), { description: product.productName })
    setTimeout(() => setIsAddingToCart(false), 800)
  }

  const rawImgs = product.images ?? []
  const galleryImages = rawImgs.length > 0
    ? Array.from({ length: 4 }, (_, i) => rawImgs[i % rawImgs.length])
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-10 flex items-center gap-2 select-none">
        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.products')}</Link>
        <span>/</span>
        <span className="text-black dark:text-white font-medium">{product.productName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24">
        {/* Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-[60%] shrink-0">
          {galleryImages.length > 0 && (
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar shrink-0">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-[110px] lg:w-[170px] h-[90px] lg:h-[138px] bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded flex items-center justify-center p-3 transition-all cursor-pointer ${
                    i === activeImg
                      ? 'border-2 border-black dark:border-gray-400 opacity-100 shadow-sm'
                      : 'border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={resolveImageUrl(img.imageUrl)} alt="" className="max-w-full max-h-full object-contain pointer-events-none" onError={imgFallback} />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1 w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded flex items-center justify-center min-h-[380px] lg:min-h-[600px] p-6 lg:p-10 relative">
            {galleryImages[activeImg] ? (
              <img
                src={resolveImageUrl(galleryImages[activeImg].imageUrl)}
                alt={product.productName}
                className="w-full h-full max-h-[500px] object-contain select-none transition-transform duration-500 hover:scale-105"
                onError={imgFallback}
              />
            ) : (
              <div className="text-gray-300 text-6xl">🖼️</div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="lg:w-[40%] space-y-6 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white leading-tight mb-2 tracking-tight">
              {product.productName}
            </h1>
            <div className="flex items-center gap-3 text-sm flex-wrap mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill={i <= 4 ? '#FFAD33' : 'none'}
                      stroke={i <= 4 ? '#FFAD33' : '#a3a3a3'}
                      strokeWidth="2"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400 font-medium">(150 {t('product.reviews')})</span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span className="text-[#00FF66] font-medium">{t('product.in_stock')}</span>
            </div>
          </div>

          <div className="text-2xl font-inter tracking-wide text-black dark:text-white font-medium">
            ${displayPrice}
          </div>

          <p className="text-sm text-black/80 dark:text-gray-300 leading-relaxed border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
            {product.description || "Upgrade your setup with this premium quality gaming gear. Built for high performance and long-lasting durability."}
          </p>

          {(product.colors?.length ?? 0) > 0 && (
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[15px] font-medium text-black dark:text-white tracking-wide">{t('product.color')}:</span>
              <div className="flex gap-2.5">
                {product.colors!.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    title={c.colorName}
                    className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                      selectedColor === c.id
                        ? 'ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-[#0d0d0d] scale-110'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hexCode }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-5">
            <span className="text-[15px] font-medium text-black dark:text-white tracking-wide">{t('product.size')}:</span>
            <div className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 border rounded text-xs font-medium transition-all flex items-center justify-center cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#DB4444] text-white border-[#DB4444] shadow-sm'
                      : 'border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-[#DB4444]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded h-[44px]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-[40px] h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-r border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-l cursor-pointer"
              >
                <Minus size={18} strokeWidth={1.5} />
              </button>
              <span className="w-[60px] text-center text-base font-medium text-black dark:text-white select-none">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-[40px] h-full flex items-center justify-center bg-[#DB4444] hover:bg-[#c53737] text-white transition-colors rounded-r cursor-pointer shadow-sm"
              >
                <Plus size={18} strokeWidth={1.5} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-[#DB4444] text-white h-[44px] rounded font-medium hover:bg-[#c53737] transition-all active:scale-[0.99] text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer shadow-md"
            >
              {isAddingToCart ? <><Loader2 size={16} className="animate-spin" /> {t('messages.loading')}</> : t('product.buy_now')}
            </button>

            <button
              onClick={() => {
                if (isWishlisted) dispatch(removeFromWishlist(product.id))
                else dispatch(addToWishlist(product))
              }}
              className={`w-[44px] h-[44px] border rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isWishlisted
                  ? 'border-[#DB4444] text-[#DB4444] bg-[#DB4444]/5'
                  : 'border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-[#DB4444]'
              }`}
            >
              <Heart size={20} strokeWidth={1.5} className={isWishlisted ? 'fill-[#DB4444] text-[#DB4444]' : ''} />
            </button>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded mt-8 divide-y divide-gray-300 dark:divide-gray-700 overflow-hidden">
            <div className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <Truck size={28} strokeWidth={1.5} className="text-black dark:text-white shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium text-black dark:text-white mb-0.5">{t('product.free_delivery')}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 underline cursor-pointer">
                  {t('product.free_delivery_desc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <RotateCcw size={28} strokeWidth={1.5} className="text-black dark:text-white shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium text-black dark:text-white mb-0.5">{t('product.return_delivery')}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('product.return_delivery_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-32 mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-5 h-10 bg-[#DB4444] rounded block" />
            <h2 className="text-xl font-bold font-inter text-[#DB4444] tracking-tight">{t('product.related_products')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {pagedRelated.map((p, idx) => (
              <ProductCard key={p.id ?? idx} product={p} />
            ))}
          </div>

          {totalRelatedPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setRelatedPage((prev) => Math.max(1, prev - 1))}
                      className={relatedPage === 1 ? 'pointer-events-none opacity-40' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalRelatedPages }, (_, i) => i + 1).map((page) => {
                    const showPage =
                      page === 1 ||
                      page === totalRelatedPages ||
                      Math.abs(page - relatedPage) <= 1
                    const showEllipsisAfter =
                      page === 1 && relatedPage > 3
                    const showEllipsisBefore =
                      page === totalRelatedPages && relatedPage < totalRelatedPages - 2

                    if (showEllipsisAfter) return (
                      <PaginationItem key={`e1-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                    if (showEllipsisBefore) return (
                      <PaginationItem key={`e2-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                    if (!showPage) return null

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={relatedPage === page}
                          onClick={() => setRelatedPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setRelatedPage((prev) => Math.min(totalRelatedPages, prev + 1))}
                      className={relatedPage === totalRelatedPages ? 'pointer-events-none opacity-40' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default ProductDetailPage
