import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactScheduler from '../components/ContactScheduler';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#e0e0e0] font-sans">
            <Navbar />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Contact;
