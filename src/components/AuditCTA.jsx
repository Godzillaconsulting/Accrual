import React from 'react';

const AuditCTA = () => {
    return (
        <section className="bg-[#e0e0e0] py-24 px-4 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[#000]/10"></div>
            <div className="max-w-6xl mx-auto bg-[#2d3830]/40 backdrop-blur-2xl border border-[#e0e0e0]/20 rounded-[3rem] p-12 md:p-16 text-[#e0e0e0] shadow-2xl relative z-10 transition-all duration-500 hover:-translate-y-4 hover:border-[#34d399]/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tight">
                        Tu Cierre Fiscal 2025 <br />
                        Está en Riesgo.
                    </h2>

                    <p className="text-xl md:text-2xl opacity-90">
                        El SAT ha automatizado sus auditorías. ¿Estás seguro de que tus XMLs
                        coinciden con tus bancos?
                    </p>

                    <div className="max-w-3xl mx-auto bg-transparent border-none">
                        <p className="font-semibold text-lg mb-4 opacity-90">
                            Obtén nuestra Auditoría de Diagnóstico "Rayos X". Revisamos tu situación
                            fiscal actual, detectamos discrepancias y te entregamos un plan de corrección
                            antes de tu declaración anual.
                        </p>
                    </div>

                    <div className="space-y-0">
                        <p className="text-xl md:text-2xl font-bold uppercase opacity-80">Por solo</p>
                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tight">$2,500 MXN</h3>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-4">
                        <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-10 rounded-full uppercase text-lg shadow-xl transition-all transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20">
                            Quiero mi Auditoría Rayos X
                        </button>
                        <p className="text-sm opacity-70">Si no encontramos áreas de mejora, te devolvemos tu dinero.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuditCTA;
