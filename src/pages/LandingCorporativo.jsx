import React, { useEffect } from 'react';
import { Shield, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ContactScheduler from '../components/ContactScheduler';

import CorporativoVideo from '../assets/Corporativo_video.mov';

const LandingCorporativo = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleScrollToContact = () => {
        const contactForm = document.getElementById('contacto-form');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = '/contacto';
        }
    };

    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative bg-[#111827] text-white py-32 px-6 overflow-hidden min-h-[85vh] flex items-center">
                
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 mix-blend-overlay"
                >
                    <source src={CorporativoVideo} type="video/quicktime" />
                    Tu navegador no soporta videos HTML5.
                </video>
                <div className="absolute inset-0 bg-[#111827]/70 pointer-events-none z-0"></div>

                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#0F4C82_0%,transparent_50%)]"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-block px-6 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-300 font-bold tracking-widest text-sm mb-10 shadow-lg flex items-center gap-2">
                        <Globe className="w-4 h-4" /> ESTATUS CORPORATIVO COMPROBADO
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white drop-shadow-2xl">
                        Estrategia Binacional de Élite: <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Sincronización Fiscal México-USA.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-light leading-relaxed max-w-4xl mb-12 opacity-90 text-gray-400">
                        Protege tu patrimonio transfronterizo. <strong className="text-white font-medium">Eliminamos riesgos de Precios de Transferencia y garantizamos el cumplimiento total ante el SAT e IRS</strong> con ingeniería fiscal de alto nivel.
                    </p>
                    
                    <button 
                        onClick={handleScrollToContact}
                        className="bg-white hover:bg-gray-100 text-[#233657] font-black py-5 px-10 rounded-full text-xl md:text-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] decoration-none"
                    >
                        Agendar Sesión Estratégica
                    </button>
                </div>
            </section>

            {/* Strategy Context Section */}
            <section className="bg-white py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <Shield className="w-16 h-16 text-[#233657] mb-8" />
                        <h2 className="text-3xl md:text-5xl font-black text-[#233657] mb-6 leading-tight">
                            Autoridad<br/>y Protección Total
                        </h2>
                        <h3 className="text-xl font-bold text-[#0F4C82] mb-6">Nuestra Filosofía Binacional</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Las empresas de alto impacto con operaciones u oficinas en ambos lados de la frontera enfrentan una red fiscal dual que representa su mayor riesgo operativo. Cualquier incongruencia los expone severamente en dos frentes legales implacables.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            En este ecosistema, los clientes no buscan simples despachos de "contabilidad", buscan firmas que aseguren el <strong className="text-[#233657]">blindaje absoluto contra la doble tributación</strong>. Nuestro enfoque es un control milimétrico del riesgo financiero corporativo para salvaguardar tu posición hoy y a largo plazo.
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gray-900 rounded-[3rem] transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6 opacity-30"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                            alt="Corporativo Global Edificios" 
                            className="rounded-[3rem] relative z-10 w-full h-full object-cover shadow-2xl transition-transform transform group-hover:-translate-y-2"
                        />
                    </div>
                </div>
            </section>

            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default LandingCorporativo;
