import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

const Home = React.lazy(() => import('./pages/Home'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Contact = React.lazy(() => import('./pages/Contact'));
const TaxCompliancePage = React.lazy(() => import('./pages/TaxCompliancePage'));

const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const CookiesPolicy = React.lazy(() => import('./pages/CookiesPolicy'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));

const Articles = React.lazy(() => import('./pages/Articles'));
const ArticleErrors = React.lazy(() => import('./pages/ArticleErrors'));
const ArticleDetail = React.lazy(() => import('./pages/ArticleDetail'));
const ServicesOverview = React.lazy(() => import('./pages/ServicesOverview'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail'));
const Payment = React.lazy(() => import('./pages/Payment'));

// Landings Integración
const LandingEmprendedores = React.lazy(() => import('./pages/LandingEmprendedores'));
const LandingPymes = React.lazy(() => import('./pages/LandingPymes'));
const LandingCorporativo = React.lazy(() => import('./pages/LandingCorporativo'));

const Loader = () => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#233657] text-[#D0D0DA]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-6"></div>
        <h2 className="text-xl font-bold tracking-widest uppercase">Cargando...</h2>
    </div>
);

// Admin Pages (Nuevas)
const Login = React.lazy(() => import('./components/Login'));
const AdminStudio = React.lazy(() => import('./components/AdminStudio'));
const AccrualSora = React.lazy(() => import('./components/AccrualSora'));
const ErrorBoundary = React.lazy(() => import('./components/ErrorBoundary'));
import PrivateRoute from './components/PrivateRoute';
import { Navigate } from 'react-router-dom';

function App() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quienes-somos" element={<AboutUs />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/cumplimiento-tributario" element={<TaxCompliancePage />} />
                    <Route path="/articulos" element={<Articles />} />
                    <Route path="/articulos/errores-comunes" element={<ArticleErrors />} />
                    <Route path="/articulos/:id" element={<ArticleDetail />} />
                    <Route path="/servicios" element={<ServicesOverview />} />
                    <Route path="/servicios/:slug" element={<ServiceDetail />} />
                    <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
                    <Route path="/aviso-de-privacidad" element={<PrivacyPolicy />} />
                    <Route path="/politica-de-cookies" element={<CookiesPolicy />} />
                    <Route path="/buscar" element={<SearchResults />} />
                    <Route path="/pago" element={<Payment />} />
                    
                    {/* Soluciones / Paquetes */}
                    <Route path="/soluciones/emprendedor" element={<LandingEmprendedores />} />
                    <Route path="/soluciones/negocio" element={<LandingPymes />} />
                    <Route path="/soluciones/corporativo" element={<LandingCorporativo />} />
                    
                    {/* Admin Routes (Dashboard Integrado) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/*" element={<ErrorBoundary><PrivateRoute><AdminStudio /></PrivateRoute></ErrorBoundary>} />
                    <Route path="/cm" element={<Navigate to="/admin/calendar" replace />} />
                    <Route path="/studio" element={<Navigate to="/admin/studio" replace />} />
                    <Route path="/accrual-sora" element={<ErrorBoundary><PrivateRoute><AccrualSora /></PrivateRoute></ErrorBoundary>} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
