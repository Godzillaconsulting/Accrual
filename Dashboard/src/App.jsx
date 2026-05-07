import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useState, useEffect, memo, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import CustomCursor from './components/CustomCursor';
import PrivateRoute from './components/PrivateRoute';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { SiteProvider, useSiteData } from './context/SiteContext';
import { useTranslation } from 'react-i18next';

// Eliminando CONSTANTS de ColorBends ya que usa ParticleField en Hero

// Componentes críticos cargados inmediatamente (First Contentful Paint)

// Lazy loading para optimizar el peso del compilado de Vite
const AdminStudio = React.lazy(() => import('./components/AdminStudio'));
const ErrorBoundary = React.lazy(() => import('./components/ErrorBoundary'));
const Login = React.lazy(() => import('./components/Login'));
const AccrualSora = React.lazy(() => import('./components/AccrualSora'));

// Animación principal gobernada de forma particular por el Componente Hero.jsx. No requiere background global.

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function PixelTracker() {
  const { pathname } = useLocation();
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}

function AccrualTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      const params = new URLSearchParams(search);
      const utmSource = params.get('utm_source');
      if (utmSource) {
        sessionStorage.setItem('accrual_utm_source', utmSource);
        sessionStorage.setItem('accrual_utm_medium', params.get('utm_medium') || '');
        sessionStorage.setItem('accrual_utm_campaign', params.get('utm_campaign') || '');
      }

      let sessionId = sessionStorage.getItem('accrual_session_id');
      if (!sessionId) {
        sessionId = 'accrual_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('accrual_session_id', sessionId);
      }

      const backendUrl = '' || (import.meta.env.DEV ? 'http://localhost:3000' : '');
      fetch(`${backendUrl}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          url: window.location.href,
          utm_source: sessionStorage.getItem('accrual_utm_source') || null,
          utm_medium: sessionStorage.getItem('accrual_utm_medium') || null,
          utm_campaign: sessionStorage.getItem('accrual_utm_campaign') || null
        })
      }).catch(err => console.debug('Tracker err', err.message));
    } catch (e) { }
  }, [pathname, search]);

  return null;
}

function FloatingWhatsApp() {
  return null;
}

function GlobalSuspenseFallback() {
  const { i18n } = useTranslation();
  const isEng = i18n.resolvedLanguage ? i18n.resolvedLanguage.startsWith('en') : false;
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#233657] text-[#0099CC] font-black text-xl tracking-widest z-50 fixed top-0 left-0">
      <span className="animate-pulse">{isEng ? 'LOADING · ACCRUAL...' : 'CARGANDO · ACCRUAL...'}</span>
    </div>
  );
}

function AppLayout() {
  const { loading } = useSiteData();

  if (loading) {
    return <GlobalSuspenseFallback />;
  }

  return (
    <div className="font-sans text-white bg-[#233657] min-h-screen flex flex-col relative w-full overflow-hidden">
      <div className="relative z-10 flex flex-col flex-grow pointer-events-auto">
        <GlobalErrorBoundary>
          <Suspense fallback={<GlobalSuspenseFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={<ErrorBoundary><PrivateRoute><AdminStudio /></PrivateRoute></ErrorBoundary>} />
              <Route path="/cm" element={<Navigate to="/admin/calendar" replace />} />
              <Route path="/studio" element={<Navigate to="/admin/studio" replace />} />
              <Route path="/accrual-sora" element={<ErrorBoundary><PrivateRoute><AccrualSora /></PrivateRoute></ErrorBoundary>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </GlobalErrorBoundary>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <SiteProvider>
        <Router>
          <CustomCursor />
          <ScrollToHash />
          <ScrollToTop />
          <PixelTracker />
          <AccrualTracker />
          <Suspense fallback={<div className="bg-[#152033] min-h-screen flex items-center justify-center text-white"><div className="animate-pulse tracking-widest text-sm">LOADING ASSETS...</div></div>}>
            <AppLayout />
          </Suspense>
        </Router>
      </SiteProvider>
    </HelmetProvider>
  );
}

export default App;
