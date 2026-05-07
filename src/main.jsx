import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <SiteProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </SiteProvider>
        </HelmetProvider>
    </StrictMode>,
)
