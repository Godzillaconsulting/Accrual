
import React from 'react';
import { Link } from 'react-router-dom';
import backgroundVideo from '../assets/Prompt_cinematic_highend_1080p_2026011.mp4';
import { useSiteData } from '../context/SiteContext';

const AuditCTA = () => {
    const { getNodeData } = useSiteData();
    const data = getNodeData('auditoria-cta') || {};

    return (
        <section className="py-16 px-8 bg-[#D0D0DA] font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Video/Image */}
                <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group">
                    {data.ctaImageUrl && !data.ctaImageUrl.endsWith('.mp4') ? (
                        <img
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            src={data.ctaImageUrl}
                            alt="Auditoría"
                        />
                    ) : (
                        <video
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            src={data.ctaImageUrl || backgroundVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    )}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>

                {/* Right Column: Content */}
                <div className="text-center md:text-right space-y-8 text-[#233657]">
                    <h2 
                        className="uppercase flex flex-col text-center md:text-right text-4xl md:text-6xl font-black leading-tight"
                        dangerouslySetInnerHTML={{ __html: data.ctaTitle || 'TU CIERRE FISCAL ESTÁ EN RIESGO.' }}
                    />

                    <div className="max-w-lg ml-auto mr-auto md:mr-0">
                        <p 
                            className="font-semibold text-base md:text-lg opacity-80"
                            dangerouslySetInnerHTML={{ __html: data.ctaDesc || 'El SAT ha automatizado sus auditorías. ¿Estás seguro de que tus XMLs coinciden con tus bancos? <br/><br/> Obtén nuestra auditoría de diagnóstico "Rayos X". Revisamos tu situación fiscal actual, detectamos discrepancias y te entregamos un plan de corrección antes de tu declaración anual.' }}
                        />
                    </div>

                    <div className="pt-4 flex flex-col items-center md:items-end gap-4">
                        <Link to="/contacto">
                            <button 
                                className="bg-[#233657] hover:bg-[#0F4C82] text-white font-bold py-4 px-10 rounded-full uppercase text-lg shadow-xl transition-all transform hover:scale-105"
                                dangerouslySetInnerHTML={{ __html: data.ctaBtn || 'QUIERO MI AUDITORÍA RAYOS X' }}
                            />
                        </Link>
                        <p 
                            className="text-xs font-semibold opacity-60 max-w-xs text-center md:text-right"
                            dangerouslySetInnerHTML={{ __html: data.ctaGuarantee || 'Si no encontramos áreas de mejora, te devolvemos tu dinero.' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuditCTA;
