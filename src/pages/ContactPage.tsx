import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ContactPage = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-10">
        <Link to="/" className="hover:text-black dark:text-gray-200 transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">/</span>
        <span className="text-black dark:text-gray-200">{t('nav.contact')}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 my-20 gap-8">
        {/* Left — Contact info */}
        <div className="bg-white dark:bg-[#0d0d0d] shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E11D48] rounded-full flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <p className="font-medium text-black dark:text-gray-200">{t('contact.call_us')}</p>
            </div>
            <p className="text-sm text-black dark:text-gray-200">{t('contact.call_desc')}</p>
            <p className="text-sm text-black dark:text-gray-200">{t('contact.phone')}: +8801611112222</p>
          </div>

          <div className="border-t border-gray-200 dark:border-[#1a1a1a]" />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E11D48] rounded-full flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <p className="font-medium text-black dark:text-gray-200">{t('contact.write_us')}</p>
            </div>
            <p className="text-sm text-black dark:text-gray-200">{t('contact.write_desc')}</p>
            <p className="text-sm text-black dark:text-gray-200">{t('contact.support_email')}</p>
            <p className="text-sm text-black dark:text-gray-200">{t('contact.sales_email')}</p>
          </div>
        </div>

        {/* Right — Contact form */}
        <div className="md:col-span-2 bg-white dark:bg-[#0d0d0d] shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <p className="text-5xl">✅</p>
              <p className="text-lg font-semibold text-black dark:text-gray-200">{t('contact.sent')}</p>
              <button onClick={() => setSent(false)} className="text-[#E11D48] underline text-sm hover:opacity-80">
                {t('contact.send')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  placeholder={`${t('contact.name')} *`}
                  className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#E11D48]" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  placeholder={`${t('contact.email')} *`}
                  className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#E11D48]" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                  placeholder={`${t('contact.phone_field')} *`}
                  className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-[#E11D48]" />
              </div>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
                rows={8} placeholder={t('contact.message')}
                className="w-full bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded px-4 py-3 text-sm text-black dark:text-gray-200 placeholder:text-gray-400 outline-none resize-none focus:ring-1 focus:ring-[#E11D48]" />
              <div className="flex justify-end">
                <button type="submit" className="px-12 py-4 bg-[#E11D48] text-white rounded font-medium hover:bg-[#BE123C] transition-colors text-sm">
                  {t('contact.send')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactPage
