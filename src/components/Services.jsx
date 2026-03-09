import React from 'react';
import { Check } from 'lucide-react';

const Services = () => {
    return (
        <section id="pricing-section" className="bg-[#D0D0DA] py-24 px-4 relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#233657_0%,transparent_70%)]"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-stretch">

                {/* Card 1: Emprendedores */}
                <div className="bg-white text-[#233657] rounded-[2rem] p-8 flex flex-col shadow-xl border border-gray-200 min-h-[500px] transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Emprendedores</h3>
                    <div className="mb-6">
                        <div className="text-sm text-gray-500 font-medium mb-1">menos de</div>
                        <span className="text-4xl lg:text-5xl font-black tracking-tight">$10,000</span>
                        <span className="text-xl font-bold text-gray-400 ml-1">mxn</span>
                        <span className="text-sm text-gray-500 font-medium ml-2">/ Facturación mensual</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-8 h-auto font-medium">
                        ¿Estás facturando menos de $10,000 al mes? Que el SAT no te quite el sueño, simplifica tu vida y paga lo justo
                    </p>

                    <button className="w-full bg-transparent text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-gray-50 transition-all border border-gray-300 shadow-sm">
                        Ver Solución Emprendedor
                    </button>

                    <ul className="space-y-4 text-sm flex-grow">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium">Simplifica tu vida fiscal</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium">Servicio Clave: RESICO</span>
                        </li>
                    </ul>
                </div>

                {/* Card 2: Pymes/Negocios */}
                <div className="bg-white text-[#233657] rounded-[2rem] p-8 flex flex-col shadow-xl border border-gray-200 min-h-[500px] transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Pymes y Negocios</h3>
                    <div className="mb-6">
                        <div className="text-sm text-gray-500 font-medium mb-1">entre</div>
                        <span className="text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight">$10,000 - $100,000</span>
                        <span className="text-xl font-bold text-gray-400 ml-1">mxn</span>
                        <span className="text-sm text-gray-500 font-medium ml-2 block mt-1">/ Facturación mensual</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-8 h-auto font-medium">
                        ¿Estás facturando entre $10,000 y $100,000 al mes? ¿Nómina alta y poco margen? Activa los estímulos fronterizos.
                    </p>

                    <button className="w-full bg-transparent text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-gray-50 transition-all border border-gray-300 shadow-sm">
                        Ver Solución Negocio
                    </button>

                    <ul className="space-y-4 text-sm flex-grow">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium">Estímulos fronterizos</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium">Servicio Clave: Regularización</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium">Optimización de Nómina</span>
                        </li>
                    </ul>
                </div>

                {/* Card 3: Corporativo (Highlighted) */}
                <div className="bg-[#111827] text-white rounded-[2rem] p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-800 min-h-[500px] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(15,76,130,0.4)] md:-mt-4 relative overflow-hidden z-20">
                    {/* Subtle glow effect behind */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#0F4C82] rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

                    <h3 className="text-xl font-semibold mb-2 relative z-10 text-gray-300">Corporativo Global</h3>
                    <div className="mb-6 relative z-10">
                        <div className="text-sm text-gray-400 font-medium mb-1">más de</div>
                        <span className="text-4xl lg:text-5xl font-black tracking-tight text-white">$100,000</span>
                        <span className="text-xl font-bold text-gray-400 ml-1">mxn</span>
                        <span className="text-sm text-gray-400 font-medium ml-2 block mt-1">/ Facturación mensual + Ops USA</span>
                    </div>

                    <p className="text-sm text-gray-400 mb-8 h-auto relative z-10 font-medium">
                        ¿Estás facturando más de $100,000 al mes? Estrategia Binacional, Precios de Transferencia y Compliance.
                    </p>

                    <button className="w-full bg-[#0F4C82] text-white font-bold py-3 rounded-full mb-10 hover:bg-[#1565C0] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(15,76,130,0.5)] border border-transparent relative z-10">
                        Ver Solución Corporativo
                    </button>

                    <ul className="space-y-4 text-sm flex-grow relative z-10">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium">Estrategia Binacional</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium">Precios de Transferencia</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium">Auditoria & Compliance</span>
                        </li>
                    </ul>
                </div>

            </div>

            <p className="text-center text-[#233657] opacity-60 text-sm mt-12 relative z-10 font-medium tracking-wide">
                Los precios mostrados están en pesos mexicanos
            </p>
        </section>
    );
};

export default Services;
