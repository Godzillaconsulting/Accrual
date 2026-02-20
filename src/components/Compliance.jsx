import React from 'react';
import { Image as ImageIcon, Phone } from 'lucide-react';
import urrutiaImg from '../assets/Urrutia.jpg';

const Compliance = () => {
    const handleScrollToContact = () => {
        const contactForm = document.getElementById('contacto-form');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <section className="bg-[#D0D0DA] text-[#233657] py-24 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase drop-shadow-sm">
                        Cumplimiento <br />
                        Tributario
                    </h2>

                    <p className="text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-12 opacity-90">
                        Asesoría y gestión de cumplimiento tributario para asegurar el cumplimiento con las normativas legales vigentes.
                    </p>

                    <button
                        onClick={handleScrollToContact}
                        className="bg-[#0F4C82] hover:bg-[#233657] text-[#D0D0DA] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 mb-16"
                    >
                        Solicita un presupuesto <span className="text-xl">›</span>
                    </button>

                    <div className="w-full max-w-6xl aspect-video bg-[#233657]/10 rounded-[2rem] relative flex items-center justify-center shadow-2xl overflow-hidden group border border-[#233657]/20 backdrop-blur-xl">
                        <img
                            src="https://images.unsplash.com/photo-1554224154-260327c00c19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                            alt="Cumplimiento Tributario"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* New Info & Profile Section */}
            {/* New Info & Profile Section */}
            <section className="bg-[#233657] py-24 px-6 text-[#D0D0DA] min-h-[600px] flex items-center">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Info */}
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black mb-12 leading-tight">
                            Cumplimiento <br /> Tributario
                        </h2>
                        <div className="text-lg md:text-xl font-light leading-relaxed space-y-8 opacity-90 article-content light-text text-[#D0D0DA]">
                            <p>
                                Asesoría y gestión de cumplimiento tributario para asegurar el cumplimiento con las normativas
                                legales vigentes.
                            </p>
                            <p>
                                Ofrecemos auditorías financieras integrales para evaluar la exactitud y conformidad de sus
                                estados financieros.
                            </p>
                            <p>
                                Nuestro equipo de auditores profesionales utiliza técnicas avanzadas para identificar
                                discrepancias y proporcionar recomendaciones para fortalecer el control interno y mejorar la
                                transparencia financiera.
                            </p>
                        </div>
                    </div>

                    {/* Right: Profile Card */}
                    <div className="flex flex-col items-center lg:items-end gap-6">
                        <div className="bg-[#0F4C82] rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl relative">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#D0D0DA]/20 bg-gray-300">
                                <img
                                    src={urrutiaImg}
                                    alt="Joel Urrutia"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-3xl font-bold mb-1 text-white">Joel Urrutia</h3>
                            <p className="text-[#D0D0DA]/80 text-lg mb-0 font-medium">Contador público</p>
                        </div>

                        <button
                            onClick={handleScrollToContact}
                            className="bg-[#D0D0DA] hover:bg-white text-[#233657] font-bold py-4 px-12 rounded-full text-xl flex items-center justify-center gap-3 transition-all shadow-lg w-full max-w-[400px]"
                        >
                            <Phone className="w-6 h-6 fill-current" />
                            Contáctame
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Compliance;
