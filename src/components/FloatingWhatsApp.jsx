import React from 'react';
import whatsappLogo from '../assets/WhatsApp (white).png';

const FloatingWhatsApp = () => {
    return (
        <a
            href="https://wa.me/526563049604"
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#2d3830] text-[#e0e0e0] p-3 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center w-16 h-16 shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:shadow-[0_0_30px_rgba(37,211,102,0.8)]"
            aria-label="Contact on WhatsApp"
        >
            <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-contain" />
        </a>
    );
};

export default FloatingWhatsApp;
