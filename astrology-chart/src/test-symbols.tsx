import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VerifySymbols from './VerifySymbols.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VerifySymbols />
  </StrictMode>,
)
