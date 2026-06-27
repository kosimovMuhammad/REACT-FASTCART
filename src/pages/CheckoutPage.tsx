import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearCart } from '@/features/cart/cartSlice'
import { resolveImageUrl, imgFallback } from '@/lib/utils'

const CheckoutPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((s) => s.cart)
  const [form, setForm] = useState({
    firstName: '', companyName: '', streetAddress: '', apartment: '',
    city: '', phone: '', email: '', saveInfo: false,
  })
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [submitted, setSubmitted] = useState(false)

  const subtotal = items.reduce(
    (sum, item) => sum + (item.hasDiscount ? item.discountPrice : item.price) * item.quantity,
    0,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-black dark:text-gray-200 transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-black dark:text-gray-200 transition-colors">{t('nav.cart')}</Link>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-gray-200">{t('checkout.title')}</span>
      </p>

      <h1 className="text-4xl font-medium font-inter text-black dark:text-gray-200 tracking-tight mb-10">
        {t('checkout.billing_details')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left — Billing form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.first_name')}<span className="text-[#E11D48]">*</span></label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.company_name')}</label>
            <input name="companyName" value={form.companyName} onChange={handleChange}
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.street_address')}<span className="text-[#E11D48]">*</span></label>
            <input name="streetAddress" value={form.streetAddress} onChange={handleChange} required
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.apartment')}</label>
            <input name="apartment" value={form.apartment} onChange={handleChange}
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.town')}<span className="text-[#E11D48]">*</span></label>
            <input name="city" value={form.city} onChange={handleChange} required
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.phone')}<span className="text-[#E11D48]">*</span></label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('checkout.email_address')}<span className="text-[#E11D48]">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 outline-none focus:ring-1 focus:ring-[#E11D48]" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} className="accent-[#E11D48] w-4 h-4" />
            <span className="text-sm text-black dark:text-gray-200">{t('checkout.save_info')}</span>
          </label>
        </form>

        {/* Right — Order summary */}
        <div className="space-y-6 pt-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded overflow-hidden shrink-0">
                    <img src={resolveImageUrl(item.imageUrl)} alt={item.productName} className="w-full h-full object-contain p-1" onError={imgFallback} />
                  </div>
                  <span className="text-sm text-black dark:text-gray-200">{item.productName}</span>
                </div>
                <span className="text-sm text-black dark:text-gray-200 shrink-0">
                  ${((item.hasDiscount ? item.discountPrice : item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-black dark:text-gray-200 border-b border-gray-300 dark:border-[#1a1a1a] pb-4">
              <span>{t('checkout.subtotal')}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-black dark:text-gray-200 border-b border-gray-300 dark:border-[#1a1a1a] pb-4">
              <span>{t('checkout.shipping')}:</span>
              <span>{t('checkout.free')}</span>
            </div>
            <div className="flex justify-between text-black dark:text-gray-200 font-medium">
              <span>{t('checkout.total')}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-black w-4 h-4" />
                <span className="text-sm text-black dark:text-gray-200">{t('checkout.bank')}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-black w-4 h-4" />
              <span className="text-sm text-black dark:text-gray-200">{t('checkout.cash_delivery')}</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="flex gap-4 pt-2">
            <input type="text" placeholder={t('checkout.coupon_code')}
              className="flex-1 border border-black rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none" />
            <button className="px-8 py-3 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors text-sm whitespace-nowrap">
              {t('checkout.apply_coupon')}
            </button>
          </div>

          <button type="submit" form="checkout-form" className="px-12 py-4 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors text-sm">
            {t('checkout.place_order')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[2px] px-4 font-poppins">
          <div className="bg-[#1a1a1a] border border-[#2f2f2f] w-full max-w-[420px] rounded-2xl p-10 flex flex-col items-center shadow-2xl shadow-black/50">
            <div className="w-[72px] h-[72px] rounded-full bg-[#052e16] flex items-center justify-center mb-6">
              <CheckCircle2 size={36} className="text-[#10b981]" strokeWidth={2.5} />
            </div>
            <h2 className="text-white text-[22px] font-bold text-center mb-3">{t('checkout.order_placed')}</h2>
            <p className="text-gray-400 text-[15px] text-center mb-8 leading-relaxed max-w-[320px]">
              {t('checkout.thank_you')}
            </p>
            <button
              onClick={() => { dispatch(clearCart()); navigate('/products') }}
              className="w-full py-4 bg-[#DB4444] text-white rounded-xl font-medium hover:bg-[#BE123C] transition-colors text-base"
            >
              {t('cart.continue_shopping')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
