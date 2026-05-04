import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';

const Services = () => {
    const { getNodeData } = useSiteData();
    const data = getNodeData('paquetes') || {};

    return (
        <section id="pricing-section" className="bg-[#D0D0DA] py-24 px-4 relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#233657_0%,transparent_70%)]"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-stretch">

                {/* Card 1: Emprendedores */}
                <div className="bg-white text-[#233657] rounded-[2rem] p-8 flex flex-col shadow-xl border border-gray-200 min-h-[500px] transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 mt-4 md:mt-0">
                    <div className="flex flex-col flex-grow">
                        <h3 
                            className="text-xl font-semibold mb-2"
                            dangerouslySetInnerHTML={{ __html: data.pack1Title || 'Emprendedores' }}
                        />
                        <div className="mb-6">
                            <div className="text-sm text-gray-500 font-medium mb-1" dangerouslySetInnerHTML={{ __html: data.pack1PrePrice || 'menos de' }} />
                            <div>
                                <span 
                                    className="text-3xl xl:text-4xl font-black tracking-tight"
                                    dangerouslySetInnerHTML={{ __html: data.pack1Price || '$3,500,000' }}
                                />
                                <span className="text-xl font-bold text-gray-400 ml-1" dangerouslySetInnerHTML={{ __html: data.pack1PostPrice || 'mxn' }} />
                            </div>
                            <div className="text-sm text-gray-500 font-medium mt-1" dangerouslySetInnerHTML={{ __html: data.pack1Subtitle || '/ Facturación mensual' }} />
                        </div>

                        <p 
                            className="text-sm text-gray-600 mb-8 h-auto font-medium"
                            dangerouslySetInnerHTML={{ __html: data.pack1Desc || '¿Estás facturando menos de $3,500,000 al mes?<br /><br />Deja de perder tiempo en trámites y enfócate en lo que genera dinero. Construimos la estructura fiscal que soporta tu primer millón sin riesgos ante el SAT' }}
                        />
                    </div>

                    <Link to="/soluciones/emprendedor" className="w-full bg-transparent text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-[#233657] hover:text-white transition-all border border-gray-300 hover:border-[#233657] shadow-sm transform hover:scale-105 hover:shadow-md text-center block"
                        dangerouslySetInnerHTML={{ __html: data.pack1Btn || 'Ver Solución Emprendedor' }}
                    />

                    <ul className="space-y-4 text-sm min-h-[120px]">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: data.pack1Bullet1 || 'Simplifica tu vida fiscal' }} />
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: data.pack1Bullet2 || 'Servicio Clave: RESICO' }} />
                        </li>
                    </ul>
                </div>

                {/* Card 2: Pymes/Negocios */}
                <div className="bg-white text-[#233657] rounded-[2rem] p-8 flex flex-col shadow-xl border border-gray-200 min-h-[500px] transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-2 mt-4 md:mt-0">
                    <div className="flex flex-col flex-grow">
                        <h3 
                            className="text-xl font-semibold mb-2"
                            dangerouslySetInnerHTML={{ __html: data.pack2Title || 'Pymes y Negocios' }}
                        />
                        <div className="mb-6">
                            <div className="text-sm text-gray-500 font-medium mb-1" dangerouslySetInnerHTML={{ __html: data.pack2PrePrice || 'entre' }} />
                            <div>
                                <span 
                                    className="text-xl lg:text-[1.35rem] xl:text-2xl font-black tracking-tight"
                                    dangerouslySetInnerHTML={{ __html: data.pack2Price || '$3,500,000 - $30,000,000' }}
                                />
                                <span className="text-base font-bold text-gray-400 ml-1" dangerouslySetInnerHTML={{ __html: data.pack2PostPrice || 'mxn' }} />
                            </div>
                            <div className="text-sm text-gray-500 font-medium mt-1" dangerouslySetInnerHTML={{ __html: data.pack2Subtitle || '/ Facturación mensual' }} />
                        </div>

                        <p 
                            className="text-sm text-gray-600 mb-8 h-auto font-medium"
                            dangerouslySetInnerHTML={{ __html: data.pack2Desc || '¿Estás facturando entre $3,500,000 y $30,000,000 al mes?<br /><br />¿Tu nómina y el SAT se están comiendo tu flujo de caja? Activamos los estímulos fronterizos y optimizamos tu carga laboral para inyectar capital inmediato a tu operación.' }}
                        />
                    </div>

                    <Link to="/soluciones/negocio" className="w-full bg-transparent text-[#233657] font-bold py-3 rounded-full mb-10 hover:bg-[#233657] hover:text-white transition-all border border-gray-300 hover:border-[#233657] shadow-sm transform hover:scale-105 hover:shadow-md text-center block"
                        dangerouslySetInnerHTML={{ __html: data.pack2Btn || 'Ver Solución Negocio' }}
                    />

                    <ul className="space-y-4 text-sm min-h-[120px]">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: data.pack2Bullet1 || 'Estímulos fronterizos' }} />
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: data.pack2Bullet2 || 'Servicio Clave: Regularización' }} />
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={3} />
                            <span className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: data.pack2Bullet3 || 'Optimización de Nómina' }} />
                        </li>
                    </ul>
                </div>

                {/* Card 3: Corporativo (Highlighted) */}
                <div className="bg-[#111827] text-white rounded-[2rem] p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-800 min-h-[500px] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(15,76,130,0.4)] hover:-translate-y-2 md:-mt-4 relative overflow-hidden z-20">
                    {/* Subtle glow effect behind */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#0F4C82] rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

                    <div className="flex flex-col flex-grow relative z-10">
                        <h3 
                            className="text-xl font-semibold mb-2 text-gray-300"
                            dangerouslySetInnerHTML={{ __html: data.pack3Title || 'Corporativo Global' }}
                        />
                        <div className="mb-6">
                            <div className="text-sm text-gray-400 font-medium mb-1" dangerouslySetInnerHTML={{ __html: data.pack3PrePrice || 'más de' }} />
                            <div>
                                <span 
                                    className="text-3xl xl:text-4xl font-black tracking-tight text-white"
                                    dangerouslySetInnerHTML={{ __html: data.pack3Price || '$30,000,000' }}
                                />
                                <span className="text-xl font-bold text-gray-400 ml-1" dangerouslySetInnerHTML={{ __html: data.pack3PostPrice || 'mxn' }} />
                            </div>
                            <div className="text-sm text-gray-400 font-medium mt-1" dangerouslySetInnerHTML={{ __html: data.pack3Subtitle || '/ Facturación mensual + Ops USA' }} />
                        </div>

                        <p 
                            className="text-sm text-gray-400 mb-8 h-auto font-medium"
                            dangerouslySetInnerHTML={{ __html: data.pack3Desc || '¿Estás facturando más de $30,000,000 al mes?<br /><br />Proteja su patrimonio transfronterizo. Sincronizamos su operación México-USA mediante ingeniería fiscal avanzada, precios de transferencia y blindaje legal preventivo' }}
                        />
                    </div>

                    <Link to="/soluciones/corporativo" className="w-full bg-[#0F4C82] text-white font-bold py-3 rounded-full mb-10 hover:bg-white hover:text-[#0F4C82] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(15,76,130,0.5)] border border-transparent relative z-10 text-center block"
                        dangerouslySetInnerHTML={{ __html: data.pack3Btn || 'Ver Solución Corporativo' }}
                    />

                    <ul className="space-y-4 text-sm min-h-[120px] relative z-10">
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium" dangerouslySetInnerHTML={{ __html: data.pack3Bullet1 || 'Estrategia Binacional' }} />
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium" dangerouslySetInnerHTML={{ __html: data.pack3Bullet2 || 'Precios de Transferencia' }} />
                        </li>
                        <li className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 font-medium" dangerouslySetInnerHTML={{ __html: data.pack3Bullet3 || 'Auditoria & Compliance' }} />
                        </li>
                    </ul>
                </div>

            </div>


        </section>
    );
};

export default Services;
