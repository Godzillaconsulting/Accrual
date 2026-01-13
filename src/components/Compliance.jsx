import React from 'react';
import { Image as ImageIcon, Phone } from 'lucide-react';

const Compliance = () => {
    return (
        <section className="bg-[#e0e0e0] py-24 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,#47544b_0%,transparent_100%)] opacity-20"></div>
            <div className="max-w-6xl mx-auto bg-[#2d3830]/40 backdrop-blur-2xl border border-[#e0e0e0]/20 rounded-[3rem] p-12 md:p-16 shadow-2xl text-[#e0e0e0] relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black mb-12">
                            Cumplimiento <br />
                            Tributario
                        </h2>

                        <div className="space-y-8 text-lg opacity-90">
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

                        {/* Redundant button removed */}
                    </div>

                    {/* Profile Card & Button */}
                    <div className="flex flex-col items-center gap-8 lg:justify-end">
                        <div className="bg-[#47544b] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
                            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-6 overflow-hidden border-4 border-[#e0e0e0]/10 relative">
                                {/* Placeholder for Joel's image */}
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Adrian Urrutia" className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Adrian Urrutia</h3>
                            <p className="text-sm opacity-70 mb-4">Contador público</p>
                        </div>

                        <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-12 rounded-full uppercase text-xl flex items-center gap-3 transition-all shadow-lg w-full max-w-sm justify-center transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20">
                            <Phone className="w-6 h-6 fill-current" /> Contáctame
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Compliance;
