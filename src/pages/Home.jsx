import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import AuditCTA from '../components/AuditCTA';
import Testimonials from '../components/Testimonials';
import ContactScheduler from '../components/ContactScheduler';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            <Hero />
            <Services />
            <AuditCTA />
            <Testimonials />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Home;
