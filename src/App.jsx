import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import TaxCompliancePage from './pages/TaxCompliancePage';

import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quienes-somos" element={<AboutUs />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/cumplimiento-tributario" element={<TaxCompliancePage />} />
                <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
                <Route path="/aviso-de-privacidad" element={<PrivacyPolicy />} />
            </Routes>
        </>
    );
}

export default App;
