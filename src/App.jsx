import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import TaxCompliancePage from './pages/TaxCompliancePage';

import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

import Articles from './pages/Articles';
import ArticleErrors from './pages/ArticleErrors';
import ArticleDetail from './pages/ArticleDetail';
import ServicesOverview from './pages/ServicesOverview';
import ServiceDetail from './pages/ServiceDetail';
import Payment from './pages/Payment';

// Landings Integración
import LandingEmprendedores from './pages/LandingEmprendedores';
import LandingPymes from './pages/LandingPymes';
import LandingCorporativo from './pages/LandingCorporativo';

function App() {
    return (
        <>
            <ScrollToTop />
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
                <Route path="/pago" element={<Payment />} />
                
                {/* Soluciones / Paquetes */}
                <Route path="/soluciones/emprendedor" element={<LandingEmprendedores />} />
                <Route path="/soluciones/negocio" element={<LandingPymes />} />
                <Route path="/soluciones/corporativo" element={<LandingCorporativo />} />
            </Routes>
        </>
    );
}

export default App;
