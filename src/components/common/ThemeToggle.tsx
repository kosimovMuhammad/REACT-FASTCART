import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

interface ThemeToggleProps {
  className?: string
  iconSize?: number
  showText?: boolean
}

const ThemeToggle = ({ className = '', iconSize = 20, showText = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`text-black dark:text-gray-200 hover:text-[#E11D48] dark:hover:text-[#E11D48] transition-colors ${className}`}
    >
      {theme === 'dark' ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
      {showText && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  )
}

export default ThemeToggle
