import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactScheduler from '../components/ContactScheduler';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            <ContactScheduler showHeader={true} />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Contact;
