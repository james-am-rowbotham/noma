import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// index.html carries #root. If it ever stops doing so, say so rather than silently rendering
// nothing: a blank page and a failed mount look identical on screen and mean opposite things.
const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html — nothing to render into')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
