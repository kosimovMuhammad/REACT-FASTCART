import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => (
  <div className="min-h-screen bg-black flex items-center justify-center px-4 font-poppins relative overflow-hidden">

    {/* Red radial glow behind the number */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 55% 40% at 50% 42%, rgba(180,20,20,0.55) 0%, rgba(120,10,10,0.25) 45%, transparent 75%)',
      }}
    />

    <div className="relative z-10 flex flex-col items-center text-center select-none">

      {/* 404 */}
      <h1
        className="font-extrabold leading-none tracking-tight"
        style={{
          fontSize: 'clamp(120px, 22vw, 240px)',
          background: 'linear-gradient(180deg, #e8e8e8 0%, #a0a0a0 40%, #5a5a5a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 32px rgba(0,0,0,0.7))',
        }}
      >
        404
      </h1>

      {/* Page Not Found */}
      <h2 className="text-white text-2xl sm:text-3xl font-bold mt-2 mb-4 tracking-tight">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed mb-10">
        Your visited page not found. You may go home page.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold rounded-xl text-base transition-all duration-200 shadow-lg shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 hover:scale-[1.03] active:scale-[0.98]"
      >
        <Home size={18} />
        Back to home page
      </Link>
    </div>
  </div>
)

export default NotFoundPage
