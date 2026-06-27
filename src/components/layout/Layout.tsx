import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
