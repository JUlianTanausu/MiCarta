import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

history.scrollRestoration = 'manual'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
