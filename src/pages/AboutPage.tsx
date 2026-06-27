import { Link } from 'react-router-dom'
import { X, Truck, Headphones, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const STATS_BASE = [
  { icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M28 10H12C10.9 10 10 10.9 10 12V28C10 29.1 10.9 30 12 30H28C29.1 30 30 29.1 30 28V12C30 10.9 29.1 10 28 10ZM14 26V20H18V26H14ZM22 26V14H26V26H22Z" fill="currentColor"/></svg>), number: '10.5k', key: 'stats_sellers' },
  { icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M20 14V20L24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M16 16L20 20L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>), number: '33k', key: 'stats_sales', highlight: true },
  { icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M12 30V18H10L20 10L30 18H28V30H22V22H18V30H12Z" fill="currentColor"/></svg>), number: '45.5k', key: 'stats_customers' },
  { icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM21.5 25H18.5V22H21.5V25ZM21.5 20.5H18.5V15H21.5V20.5Z" fill="currentColor"/></svg>), number: '25k', key: 'stats_gross' },
]

const TEAM = [
  { name: 'Tom Cruise', roleKey: 'ceo', img: '/images/about/tom-cruise.png' },
  { name: 'Emma Watson', roleKey: 'cto', img: '/images/about/emma-watson.png' },
  { name: 'Will Smith', roleKey: 'designer', img: '/images/about/will-smith.png' },
]

const AboutPage = () => {
  const { t } = useTranslation()

  const SERVICES = [
    { icon: <Truck size={28} />, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over $140' },
    { icon: <Headphones size={28} />, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
    { icon: <ShieldCheck size={28} />, title: 'MONEY BACK GUARANTEE', desc: 'We return money within 30 days' },
  ]

  return (
    <div className="bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-10">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-gray-200">{t('nav.about')}</span>
        </p>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold font-inter text-black dark:text-white leading-tight tracking-tight">
              {t('about.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base">{t('about.subtitle')}</p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base">
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img src="/images/about/hero-shopping.png" alt="Shopping" className="w-full h-[400px] object-cover rounded-lg" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {STATS_BASE.map(({ icon, number, key, highlight }) => (
            <div key={key} className={`rounded border p-8 text-center space-y-3 transition-all duration-300 cursor-default group ${
              highlight
                ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-lg shadow-[#E11D48]/20'
                : 'bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-200 border-gray-200 dark:border-[#1a1a1a] hover:bg-[#E11D48] hover:text-white hover:border-[#E11D48] hover:shadow-lg hover:shadow-[#E11D48]/20'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${highlight ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${highlight ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-white/30'}`}>
                  {icon}
                </div>
              </div>
              <p className="text-3xl font-bold font-inter">{number}</p>
              <p className="text-sm opacity-80">{t(`about.${key}`)}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-30 pb-10">
          {TEAM.map(({ name, roleKey, img }) => (
            <div key={name} className="text-center space-y-4">
              <div className="bg-[#F5F5F5] dark:bg-[#1a1a1a] rounded overflow-hidden aspect-[3/4] flex items-end justify-center">
                <img src={img} alt={name} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-2xl font-medium font-inter text-black dark:text-white">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t(`about.${roleKey}`)}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><X size={18} /></a>
                <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><FaInstagram size={18} /></a>
                <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"><FaLinkedinIn size={18} /></a>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="flex items-center justify-center gap-2 mb-16">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-full ${i === 2 ? 'w-3 h-3 bg-[#E11D48] ring-2 ring-[#E11D48]/30' : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600'}`} />
          ))}
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 pt-10 sm:grid-cols-3 my-65 gap-20 pb-10">
          {SERVICES.map(({ icon, title, desc }) => (
            <div key={title} className="text-center space-y-4">
              <div className="w-20 h-20 bg-black dark:bg-gray-800 rounded-full flex items-center justify-center text-white mx-auto ring-[10px] ring-gray-200 dark:ring-gray-700">
                {icon}
              </div>
              <p className="font-semibold text-black dark:text-white text-sm">{title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default AboutPage
