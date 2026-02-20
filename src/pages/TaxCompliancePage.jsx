import React from 'react';
import Navbar from '../components/Navbar';
import Strategy from '../components/Strategy';
import Compliance from '../components/Compliance';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ContactScheduler from '../components/ContactScheduler';

const TaxCompliancePage = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            <Strategy />
            <Compliance />
            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default TaxCompliancePage;
