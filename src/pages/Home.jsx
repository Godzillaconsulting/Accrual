import { Helmet } from 'react-helmet-async';
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import AuditCTA from '../components/AuditCTA';
import Testimonials from '../components/Testimonials';
import LeadMagnet from '../components/LeadMagnet';
import ContactScheduler from '../components/ContactScheduler';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
                        <Helmet>
                <title>Accrual - Consultoría Fiscal, Contable y Blindaje Patrimonial</title>
                <meta name="description" content="Estrategias fiscales avanzadas, cumplimiento REPSE, gestión de nómina y blindaje tributario transfronterizo en México y Estados Unidos." />
                <link rel="canonical" href="https://accrual.com.mx/" />
                <meta property="og:title" content="Accrual - Consultoría Fiscal Estratégica" />
                <meta property="og:description" content="Blindaje patrimonial, auditoría REPSE y optimización fiscal de alto impacto para empresas y personas físicas." />
                <meta property="og:url" content="https://accrual.com.mx/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://accrual.com.mx/favicon-hd.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Accrual - Consultoría Fiscal Estratégica" />
                <meta name="twitter:description" content="Ingeniería fiscal, auditoría REPSE y soluciones tributarias integrales." />
                <meta name="twitter:image" content="https://accrual.com.mx/favicon-hd.png" />
            </Helmet>
            <Navbar />
            <Hero />
            <About />
            <AuditCTA />
            <Services />
            <Testimonials />
            <LeadMagnet />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Home;
