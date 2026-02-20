import React from 'react';
import whatsappLogo from '../assets/WhatsApp (white).png';

const FloatingWhatsApp = () => {
    return (
        <a
            href="https://wa.me/526563049604"
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#233657] text-[#D0D0DA] p-3 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center w-16 h-16 shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:shadow-[0_0_30px_rgba(37,211,102,0.8)]"
            aria-label="Contact on WhatsApp"
        >
            <div className="absolute top-0 right-0 w-5 h-5 bg-red-600 rounded-full transform translate-x-1 -translate-y-1"></div>
            <img src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-contain" />
        </a>
    );
};

export default FloatingWhatsApp;
