import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AppRouter from '@/router/AppRouter'
import { Toaster } from '@/components/ui/sonner'
import '@/i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppRouter />
            <Toaster />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
