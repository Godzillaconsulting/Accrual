import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import AuditCTA from '../components/AuditCTA';
import Testimonials from '../components/Testimonials';
import TalkClear from '../components/TalkClear';
import LeadMagnet from '../components/LeadMagnet';
import ContactScheduler from '../components/ContactScheduler';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            <Hero />
            <About />
            <AuditCTA />
            <Services />
            <TalkClear />
            <Testimonials />
            <LeadMagnet />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Home;
