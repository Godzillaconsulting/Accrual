import React from 'react';
import { Play } from 'lucide-react';

const Strategy = () => {
    return (
        <section className="bg-[#e0e0e0] text-[#47544b] py-24 px-4 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase drop-shadow-sm">
                    Para cada empresa <br />
                    hay una estrategia
                </h2>

                <p className="text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-12 opacity-90">
                    Accrual es tu aliado en el mundo fiscal y financiero. Ofrecemos soluciones adaptadas a tus necesidades, ayudándote a
                    cumplir con tus responsabilidades fiscales y a gestionar tu patrimonio de manera eficiente. Descubre cómo nuestros
                    servicios pueden transformar tu situación fiscal y financiera.
                </p>

                <button className="bg-[#47544b] hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 mb-16">
                    Solicita un presupuesto <span className="text-xl">›</span>
                </button>

                {/* Video Placeholder */}
                <div className="w-full max-w-6xl aspect-video bg-[#47544b]/10 rounded-[2rem] relative flex items-center justify-center shadow-2xl overflow-hidden group border border-[#47544b]/20 backdrop-blur-xl">
                    <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#47544b]/80 rounded-full flex items-center justify-center pl-2 md:pl-3 cursor-pointer hover:scale-110 transition-transform shadow-xl z-10 backdrop-blur-xl border border-[#e0e0e0]/30 group-hover:bg-[#47544b]">
                        <Play className="w-12 h-12 md:w-16 md:h-16 text-[#e0e0e0] fill-[#e0e0e0]" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Strategy;
