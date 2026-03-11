import React, { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ContactScheduler from '../components/ContactScheduler';

import EmprendedoresVideo from '../assets/Emprendedores_video.mov';

const LandingEmprendedores = () => {
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
            <section className="relative bg-[#233657] text-[#D0D0DA] py-32 px-6 overflow-hidden min-h-[85vh] flex items-center">
                
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={EmprendedoresVideo} />
                    Tu navegador no soporta videos HTML5.
                </video>
                <div className="absolute inset-0 bg-[#233657]/70 pointer-events-none z-0"></div>

                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
                    <div className="absolute -top-[50%] -right-[10%] w-[100%] h-[150%] bg-[radial-gradient(circle_at_50%_50%,#0F4C82_0%,transparent_60%)]"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-block px-6 py-2 rounded-full border border-[#0F4C82]/50 bg-[#0F4C82]/10 text-white font-bold tracking-widest text-sm mb-10 shadow-lg backdrop-blur-sm">
                        PARA EMPRENDEDORES EN CRECIMIENTO
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white drop-shadow-2xl">
                        Deja de ser el todólogo de su negocio y conviértete en el verdadero <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#87BFFF] to-[#D0D0DA]">CEO de tu empresa.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-light leading-relaxed max-w-4xl mb-12 opacity-90 text-gray-300">
                        ¿Estás facturando pero sientes que el SAT es tu socio mayoritario? <strong className="text-white font-semibold">Construimos la estructura fiscal que soporta su crecimiento sin riesgos.</strong>
                    </p>
                    
                    <button 
                        onClick={handleScrollToContact}
                        className="bg-white hover:bg-gray-100 text-[#233657] font-black py-5 px-10 rounded-full text-xl md:text-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] decoration-none"
                    >
                        Blindar mi Crecimiento
                    </button>
                </div>
            </section>

            {/* Strategy Context Section */}
            <section className="bg-white py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <Briefcase className="w-16 h-16 text-[#233657] mb-8" />
                        <h2 className="text-3xl md:text-5xl font-black text-[#233657] mb-6 leading-tight">
                            El paso clave <br/>para transformar tu operación
                        </h2>
                        <h3 className="text-xl font-bold text-[#0F4C82] mb-6">Nuestra Estrategia</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Sabemos lo agobiante que es intentar llevar la carga operativa y al mismo tiempo descifrar todas las obligaciones fiscales. Si pasas más tiempo apagando fuegos administrativos que liderando, estás frenando tu propio potencial.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            Nuestra metodología se enfoca en la <strong className="text-[#233657]">Transformación</strong>. Nos encargamos de que pases de ser un "auto-empleado" estresado que hace de todo, a un dueño de empresa respaldado por sistemas financieros sólidos, automatizados y 100% en cumplimiento.
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#0F4C82] rounded-[3rem] transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6 opacity-20"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                            alt="Emprendedores Transformación" 
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

export default LandingEmprendedores;
