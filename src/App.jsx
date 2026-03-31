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

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminAboutUs from './pages/admin/AdminAboutUs';
import AdminServices from './pages/admin/AdminServices';
import AdminArticles from './pages/admin/AdminArticles';

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
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="homepage" element={<AdminHomepage />} />
                        <Route path="quienes-somos" element={<AdminAboutUs />} />
                        <Route path="servicios" element={<AdminServices />} />
                        <Route path="articulos" element={<AdminArticles />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
