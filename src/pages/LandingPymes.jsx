import React, { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { Helmet } from 'react-helmet-async';
import ContactScheduler from '../components/ContactScheduler';

import PymesVideo from '../assets/Pymes_video.mov';

const LandingPymes = () => {
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
            <Helmet>
                <title>Accrual - Ingeniería Fiscal para PYMES y Negocios</title>
                <meta name="description" content="Optimiza tu nómina y aprovecha los estímulos fronterizos. Estrategias fiscales y contables avanzadas para inyectar flujo de caja a tu operación y blindar tu patrimonio." />
                <meta property="og:title" content="Accrual - Ingeniería Fiscal para PYMES" />
                <meta property="og:description" content="Optimiza tu nómina y aprovecha los estímulos fronterizos con estrategias fiscales y contables avanzadas." />
            </Helmet>
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
                    <source src={PymesVideo} />
                    Tu navegador no soporta videos HTML5.
                </video>
                <div className="absolute inset-0 bg-[#233657]/70 pointer-events-none z-0"></div>

                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
                    <div className="absolute top-[0%] left-[0%] w-[100%] h-[150%] bg-[radial-gradient(circle_at_0%_100%,#0F4C82_0%,transparent_70%)]"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-block px-6 py-2 rounded-full border border-blue-400 bg-blue-900/40 text-blue-200 font-bold tracking-widest text-sm mb-10 shadow-lg backdrop-blur-sm">
                        PYMES Y NEGOCIOS
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white drop-shadow-2xl">
                        Detén la fuga silenciosa de capital y <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-100">recupera tus márgenes operativos.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-light leading-relaxed max-w-4xl mb-12 opacity-90 text-gray-300">
                        Activamos estímulos fronterizos e ingeniería de nómina para inyectar flujo de caja inmediato a su operación. <strong className="text-white font-semibold block mt-4">Si estás en la frontera y no usas estos decretos, estás perdiendo dinero cada segundo.</strong>
                    </p>
                    
                    <button 
                        onClick={handleScrollToContact}
                        className="bg-white hover:bg-gray-100 text-[#233657] font-black py-5 px-10 rounded-full text-xl md:text-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] decoration-none"
                    >
                        Recuperar mi Flujo de Caja
                    </button>
                </div>
            </section>

            {/* Strategy Context Section */}
            <section className="bg-white py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-row-reverse md:flex-row">
                    <div className="order-2 md:order-1 relative group">
                        <div className="absolute inset-0 bg-[#233657] rounded-[3rem] transform -translate-x-4 translate-y-4 transition-transform group-hover:-translate-x-6 group-hover:translate-y-6 opacity-20"></div>
                        <img loading="lazy"  
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                            alt="Estrategia Flujo de Caja" 
                            className="rounded-[3rem] relative z-10 w-full h-full object-cover shadow-2xl transition-transform transform group-hover:-translate-y-2"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <TrendingUp className="w-16 h-16 text-[#233657] mb-8" />
                        <h2 className="text-3xl md:text-5xl font-black text-[#233657] mb-6 leading-tight">
                            Dinero con Descuento:<br/> Su nuevo activo operativo
                        </h2>
                        <h3 className="text-xl font-bold text-[#0F4C82] mb-6">La Estrategia</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Muchos negocios medianos ignoran o no aprovechan al máximo las ventajas tributarias legales creadas específicamente para su modelo o ubicación. Como resultado, dejan dinero sobre la mesa que debería estar impulsando su rentabilidad.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            Posicionamos nuestros servicios como la recuperación sistemática del capital que se escapa por impuestos ineficientes y estructuras de nómina mal optimizadas. Identificamos los decretos fiscales de frontera que aplican para usted en el menor plazo posible para convertir en liquidez, literalmente, lo que ya era su dinero.
                        </p>
                    </div>
                </div>
            </section>

            <ContactScheduler />
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default LandingPymes;
