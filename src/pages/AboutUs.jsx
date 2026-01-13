import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from '../components/About';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#e0e0e0] font-sans">
            <Navbar />
            <About />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default AboutUs;
