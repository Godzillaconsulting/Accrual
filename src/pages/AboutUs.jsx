import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from '../components/About';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            <About />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default AboutUs;
