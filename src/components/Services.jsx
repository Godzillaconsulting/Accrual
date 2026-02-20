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
                <div className="bg-[#233657] text-[#D0D0DA] rounded-3xl p-8 flex flex-col shadow-2xl border border-[#D0D0DA]/30 min-h-[500px] transition-all duration-300 hover:border-[#0F4C82] hover:shadow-[0_0_30px_rgba(15,76,130,0.6)] hover:-translate-y-4">
                    <h3 className="text-xl font-medium mb-2">Emprendedores</h3>
                    <div className="mb-6">
                        <div className="text-sm opacity-60">menos de</div>
                        <span className="text-4xl font-bold tracking-tight">$10M</span>
                        <span className="text-sm opacity-60 ml-2">/ Facturación</span>
                    </div>

                    <p className="text-sm opacity-80 mb-8 h-auto">
                        ¿Estás facturando menos de $10,000,000 al mes? Que el SAT no te quite el sueño, simplifica tu vida y paga lo justo
                    </p>

                    <button className="w-full bg-[#D0D0DA] text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-[#0F4C82] hover:text-[#D0D0DA] transition-all transform hover:scale-105 border border-transparent hover:border-[#D0D0DA] shadow-lg">
                        Ver Solución Emprendedor
                    </button>

                    <ul className="space-y-4 text-sm flex-grow">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Para: Facturación &lt; $10M</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Simplifica tu vida fiscal</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Servicio Clave: RESICO</span>
                        </li>
                    </ul>
                </div>

                {/* Card 2: Pymes/Negocios (Highlighted) */}
                <div className="bg-[#233657] text-[#D0D0DA] rounded-3xl p-8 flex flex-col shadow-2xl border border-[#D0D0DA]/30 min-h-[500px] transition-all duration-300 hover:border-[#0F4C82] hover:shadow-[0_0_30px_rgba(15,76,130,0.6)] hover:-translate-y-4">

                    <h3 className="text-xl font-medium mb-2">Pymes y Negocios</h3>
                    <div className="mb-6">
                        <span className="text-4xl font-bold tracking-tight">$10M - $100M</span>
                        <span className="text-sm opacity-60 ml-2">/ Facturación</span>
                    </div>

                    <p className="text-sm opacity-80 mb-8 h-auto">
                        ¿Estás facturando entre $10,000,000 y $100,000,000 al mes? ¿Nómina alta y poco margen? Activa los estímulos fronterizos.
                    </p>

                    <button className="w-full bg-[#D0D0DA] text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-[#0F4C82] hover:text-[#D0D0DA] transition-all transform hover:scale-105 border border-transparent hover:border-[#D0D0DA] shadow-lg">
                        Ver Solución Negocio
                    </button>

                    <ul className="space-y-4 text-sm flex-grow">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Para: Facturación $10M - $100M</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Estímulos fronterizos</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Servicio Clave: Regularización</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Optimización de Nómina</span>
                        </li>
                    </ul>
                </div>

                {/* Card 3: Corporativo */}
                <div className="bg-[#233657] text-[#D0D0DA] rounded-3xl p-8 flex flex-col shadow-2xl border border-[#D0D0DA]/30 min-h-[500px] transition-all duration-300 hover:border-[#0F4C82] hover:shadow-[0_0_30px_rgba(15,76,130,0.6)] hover:-translate-y-4">
                    <h3 className="text-xl font-medium mb-2">Corporativo Global</h3>
                    <div className="mb-6">
                        <div className="text-sm opacity-60">más de</div>
                        <span className="text-3xl font-bold tracking-tight">$100M</span>
                        <span className="text-sm opacity-60 ml-2">/ + Ops USA</span>
                    </div>

                    <p className="text-sm opacity-80 mb-8 h-auto">
                        ¿Estás facturando más de $100,000,000 al mes? Estrategia Binacional, Precios de Transferencia y Compliance.
                    </p>

                    <button className="w-full bg-[#D0D0DA] text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-[#0F4C82] hover:text-[#D0D0DA] transition-all transform hover:scale-105 border border-transparent hover:border-[#D0D0DA] shadow-lg">
                        Ver Solución Corporativo
                    </button>

                    <ul className="space-y-4 text-sm flex-grow">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Para: Facturación &gt; $100M</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Estrategia Binacional</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Precios de Transferencia</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#233657] shrink-0 bg-[#D0D0DA] rounded-full p-1" />
                            <span>Auditoria & Compliance</span>
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
