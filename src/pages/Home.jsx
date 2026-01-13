import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import AuditCTA from '../components/AuditCTA';
import TalkClear from '../components/TalkClear';
import LeadMagnet from '../components/LeadMagnet';
import ContactScheduler from '../components/ContactScheduler';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#e0e0e0] font-sans">
            <Navbar />
            <Hero />
            <Services />
            <AuditCTA />
            <TalkClear />
            <LeadMagnet />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Home;
