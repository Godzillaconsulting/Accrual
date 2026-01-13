import React from 'react';
import Navbar from '../components/Navbar';
import Strategy from '../components/Strategy';
import Compliance from '../components/Compliance';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const TaxCompliancePage = () => {
    return (
        <div className="min-h-screen bg-[#e0e0e0] font-sans">
            <Navbar />
            <Strategy />
            <Compliance />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default TaxCompliancePage;
