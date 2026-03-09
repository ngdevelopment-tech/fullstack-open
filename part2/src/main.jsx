import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Countries from './components/Countries.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Countries />
  </StrictMode>,
)