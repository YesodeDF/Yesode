import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import '@shared/i18n'
import App from './App'
import { ThemeProvider } from '@shared/context/ThemeContext'
import { AuthProvider } from '@shared/context/AuthContext'
import { SecretLoginModal } from '@shared/components/SecretLoginModal'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <SecretLoginModal />
          <Analytics />
          <SpeedInsights />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
