import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const TalkClear = () => {
    return (
        <section className="bg-[#D0D0DA] py-24 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#233657]/10 filter blur-[120px]"></div>
            <div className="max-w-6xl mx-auto bg-[#233657]/40 backdrop-blur-2xl border border-[#D0D0DA]/20 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative z-10">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left text-[#D0D0DA]">
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
                    <div className="bg-[#233657] rounded-3xl aspect-video md:aspect-square flex items-center justify-center relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Meeting" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    </div>
                </div>
            </div>


        </section>
    );
};

export default TalkClear;
