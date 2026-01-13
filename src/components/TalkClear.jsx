import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const TalkClear = () => {
    return (
        <section className="bg-[#e0e0e0] py-24 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#47544b]/10 filter blur-[120px]"></div>
            <div className="max-w-6xl mx-auto bg-[#2d3830]/40 backdrop-blur-2xl border border-[#e0e0e0]/20 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative z-10">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left text-[#e0e0e0]">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 uppercase leading-tight">
                        Hablemos <br /> Claro
                    </h2>
                    <p className="text-lg md:text-xl font-medium italic opacity-90 leading-relaxed">
                        En Accrual no somos 'capturistas de datos'. Somos estrategas. Entendemos
                        que tu negocio en la frontera enfrenta retos únicos que un contador del sur no
                        comprendería.
                    </p>
                </div>

                {/* Image Placeholder */}
                <div className="flex-1 w-full">
                    <div className="bg-[#3D3D3D] rounded-3xl aspect-video md:aspect-square flex items-center justify-center relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Meeting" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    </div>
                </div>
            </div>

            {/* Certifications Strip (Visual) */}
            <div className="max-w-4xl mx-auto mt-16 text-center">
                <h3 className="text-2xl font-black uppercase mb-8">Certificaciones</h3>
                <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-[#e0e0e0] rounded-full flex items-center justify-center overflow-hidden p-3">
                            <img src={`https://via.placeholder.com/150?text=Cert+${i}`} alt={`Certificación ${i}`} className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TalkClear;
