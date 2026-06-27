import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import logo from '@/assets/Group 1116606595.png'

const Footer = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-black text-[#FAFAFA] font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Subscribe */}
          <div className="lg:col-span-1 space-y-4">
            <img src={logo} alt="Fastkar" />
            <p className="text-lg font-medium">{t('footer.subscribe')}</p>
            <p className="text-sm text-[#FAFAFA]">{t('footer.subscribe_desc')}</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail('') }}
              className="flex items-center border border-[#FAFAFA] rounded px-3 h-12 gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.enter_email')}
                className="bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/70 outline-none flex-1"
              />
              <button type="submit" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <p className="text-lg font-medium text-white">{t('footer.support')}</p>
            <ul className="space-y-3 text-sm text-[#FAFAFA]">
              <li>{t('footer.address')}</li>
              <li><a href="mailto:exclusive@gmail.com" className="hover:text-[#E11D48] transition-colors">exclusive@gmail.com</a></li>
              <li><a href="tel:+88015-88888-9999" className="hover:text-[#E11D48] transition-colors">+88015-88888-9999</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <p className="text-lg font-medium text-white">{t('footer.account')}</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/account" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.my_account')}</Link></li>
              <li><Link to="/login" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.login_register')}</Link></li>
              <li><Link to="/cart" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.cart')}</Link></li>
              <li><Link to="/wishlist" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.wishlist')}</Link></li>
              <li><Link to="/products" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.shop')}</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div className="space-y-4">
            <p className="text-lg font-medium text-white">{t('footer.quick_link')}</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.privacy_policy')}</Link></li>
              <li><Link to="#" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="#" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="/contact" className="text-[#FAFAFA] hover:text-[#E11D48] transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <p className="text-lg font-medium text-white">Social</p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#E11D48] hover:text-white transition-colors"><FaFacebookF size={14} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#E11D48] hover:text-white transition-colors"><FaTwitter size={14} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#E11D48] hover:text-white transition-colors"><FaInstagram size={14} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#E11D48] hover:text-white transition-colors"><FaLinkedinIn size={14} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-[#FAFAFA]/70">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
