import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PrivyProvider } from '@privy-io/react-auth'

// Ensure Buffer is available in the browser for libraries that expect Node's Buffer
import { Buffer } from 'buffer'
if (!window.Buffer) {
  window.Buffer = Buffer
}

const appId = import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={appId}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
