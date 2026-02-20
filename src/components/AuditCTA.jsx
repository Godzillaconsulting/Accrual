
import React from 'react';
import backgroundVideo from '../assets/Prompt_cinematic_highend_1080p_2026011.mp4';

const AuditCTA = () => {
    return (
        <section className="py-16 px-8 bg-[#D0D0DA] font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Video */}
                <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group">
                    <video
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        src={backgroundVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Optional overlay if video is too bright, but usually raw video is fine side-by-side */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>

                {/* Right Column: Content */}
                <div className="text-center md:text-right space-y-8 text-[#233657]">
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
                        <span className="block">Tu Cierre</span>
                        <span className="block">Fiscal 2025</span>
                        <span className="block">Está en Riesgo.</span>
                    </h2>

                    <p className="text-lg md:text-xl font-medium opacity-80 max-w-lg ml-auto mr-auto md:mr-0">
                        El SAT ha automatizado sus auditorías. ¿Estás seguro de que tus XMLs
                        coinciden con tus bancos?
                    </p>

                    <div className="max-w-lg ml-auto mr-auto md:mr-0">
                        <p className="font-semibold text-base md:text-lg opacity-80">
                            Obtén nuestra Auditoría de Diagnóstico "Rayos X". Revisamos tu situación
                            fiscal actual, detectamos discrepancias y te entregamos un plan de corrección
                            antes de tu declaración anual.
                        </p>
                    </div>



                    <div className="pt-4 flex flex-col items-center md:items-end gap-4">
                        <button className="bg-[#233657] hover:bg-[#0F4C82] text-white font-bold py-4 px-10 rounded-full uppercase text-lg shadow-xl transition-all transform hover:scale-105">
                            Quiero mi Auditoría Rayos X
                        </button>
                        <p className="text-xs font-semibold opacity-60 max-w-xs text-center md:text-right">
                            Si no encontramos áreas de mejora, te devolvemos tu dinero.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuditCTA;
