import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { increaseCartItem, reduceCartItem, removeFromCart, clearCart } from '@/features/cart/cartSlice'
import { resolveImageUrl, imgFallback } from '@/lib/utils'

const CartPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.cart)
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const [coupon, setCoupon] = useState('')

  // Derived values — computed before any early returns
  const subtotal = items.reduce(
    (sum, item) => sum + (item.hasDiscount ? item.discountPrice : item.price) * item.quantity,
    0,
  )
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 font-poppins">
        <ShoppingBag size={64} className="text-gray-200" />
        <p className="text-lg text-gray-500">{t('cart.please_login')}</p>
        <Link to="/login" className="px-8 py-3 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors">
          {t('cart.log_in')}
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 font-poppins">
        <ShoppingBag size={64} className="text-gray-200" />
        <p className="text-lg text-gray-500">{t('cart.empty')}</p>
        <Link to="/products" className="px-8 py-3 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-black dark:text-gray-200 transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-gray-200">{t('nav.cart')}</span>
      </p>

      <div className="space-y-6">
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr] bg-white dark:bg-[#111111] shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded py-5 px-8 text-sm text-black dark:text-gray-200">
          <span>{t('product.description')}</span>
          <span className="text-center">{t('product.price')}</span>
          <span className="text-center">{t('cart.quantity')}</span>
          <span className="text-right">{t('cart.subtotal')}</span>
        </div>

        {/* Cart items */}
        <div className="bg-transparent rounded space-y-8">
          {items.map((item) => {
            const effectivePrice = item.hasDiscount ? item.discountPrice : item.price
            return (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center py-5 px-8 gap-4 max-md:grid-cols-1 max-md:gap-3 bg-white dark:bg-[#111111] shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded"
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <button
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      className="absolute -top-2 -left-2 w-5 h-5 bg-[#E11D48] rounded-full flex items-center justify-center z-10 hover:bg-red-700 transition-colors"
                      aria-label={t('cart.remove')}
                    >
                      <X size={10} className="text-white" strokeWidth={3} />
                    </button>
                    <div className="w-14 h-14 bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded overflow-hidden">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                        onError={imgFallback}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-black dark:text-gray-200">{item.productName}</span>
                </div>

                <div className="text-sm text-black dark:text-gray-200 text-center max-md:hidden">
                  <span>${(effectivePrice || 0).toFixed(2)}</span>
                  {item.hasDiscount && (
                    <span className="block text-xs text-gray-400 line-through">${(item.price || 0).toFixed(2)}</span>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-gray-300 dark:border-[#1a1a1a] rounded h-10 w-24">
                    <span className="flex-1 text-center text-sm font-medium">{String(item.quantity).padStart(2, '0')}</span>
                    <div className="flex flex-col border-l border-gray-300 dark:border-[#1a1a1a] h-full">
                      <button onClick={() => dispatch(increaseCartItem(item.productId))} className="flex-1 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors px-1.5 border-b border-gray-200 dark:border-[#1a1a1a]">
                        <ChevronUp size={12} />
                      </button>
                      <button onClick={() => dispatch(reduceCartItem(item.productId))} className="flex-1 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors px-1.5">
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <span className="text-sm font-medium text-black dark:text-gray-200 text-right">
                  ${((effectivePrice || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <Link to="/products" className="px-10 py-3.5 border border-black dark:border-gray-600 text-black dark:text-gray-200 rounded font-medium hover:bg-black hover:text-white transition-colors text-sm">
            {t('cart.return_to_shop')}
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/cart" className="px-10 py-3.5 border border-black dark:border-gray-600 text-black dark:text-gray-200 rounded font-medium hover:bg-black hover:text-white transition-colors text-sm">
              {t('cart.update')}
            </Link>
            <button
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 px-10 py-3.5 border border-[#E11D48] text-[#E11D48] rounded font-medium hover:bg-[#E11D48] hover:text-white transition-colors text-sm"
            >
              <Trash2 size={14} />
              {t('cart.clear')}
            </button>
          </div>
        </div>

        {/* Coupon + Total */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between pt-6">
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={t('cart.coupon_code')}
              className="w-64 border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-3.5 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-black bg-white dark:bg-transparent"
            />
            <button className="px-10 py-3.5 border border-[#E11D48] text-[#E11D48] rounded font-medium hover:bg-[#E11D48] hover:text-white transition-colors text-sm whitespace-nowrap">
              {t('cart.apply')}
            </button>
          </div>

          <div className="w-full lg:w-[470px] border border-black dark:border-gray-600 rounded px-8 py-7 space-y-4">
            <h2 className="font-medium text-xl text-black dark:text-gray-200">{t('cart.cart_total')}</h2>
            <div className="flex justify-between text-sm text-black dark:text-gray-200 border-b border-gray-200 dark:border-[#1a1a1a] pb-4">
              <span>{t('cart.items')}:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm text-black dark:text-gray-200 border-b border-gray-200 dark:border-[#1a1a1a] pb-4">
              <span>{t('cart.subtotal')}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-black dark:text-gray-200 border-b border-gray-200 dark:border-[#1a1a1a] pb-4">
              <span>{t('cart.shipping')}:</span>
              <span>{t('cart.free')}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-black dark:text-gray-200 pt-1">
              <span>{t('cart.total')}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-center pt-2">
              <Link to="/checkout" className="px-12 py-4 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors text-sm">
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
