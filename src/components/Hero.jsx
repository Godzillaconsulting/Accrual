import React, { useState } from 'react';
import { Play, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import heroVideo from '../assets/AdobeStock_468157733.mov';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState('fiscal');

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === 'fiscal' ? 'strategy' : 'fiscal'));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 'fiscal' ? 'strategy' : 'fiscal'));
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src={heroVideo} type="video/quicktime" />
                    <source src={heroVideo} type="video/mp4" />
                </video>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 shadow-inner"></div>
            </div>

            {/* Carousel Content */}
            <div className="w-full max-w-7xl px-8 flex flex-col relative z-10 h-full justify-center pt-20">

                {currentSlide === 'fiscal' ? (
                    // Slide 1: Ingeniería Fiscal
                    <div className="w-full flex flex-col items-start text-left animate-fade-in py-10">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#e0e0e0] mb-6 leading-tight tracking-tight uppercase max-w-none drop-shadow-2xl">
                            Ingeniería Fiscal y Patrimonial <br />
                            para la Frontera Norte
                        </h1>

                        <p className="text-base md:text-lg text-[#e0e0e0] font-medium max-w-2xl mb-10 drop-shadow-lg">
                            Optimizamos tu carga tributaria en México y coordinamos tu cumplimiento
                            internacional. Desde RESICO hasta Precios de Transferencia.
                        </p>

                        <div className="flex flex-row gap-6">
                            <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20">
                                Solicitar Auditoría <br className="hidden sm:block" /> de Blindaje
                            </button>
                            <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20">
                                Ver <br className="hidden sm:block" /> Servicios
                            </button>
                        </div>
                    </div>
                ) : (
                    // Slide 2: Original Content
                    <div className="w-full flex flex-col items-center text-center animate-fade-in pt-20 pb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-[#e0e0e0] mb-8 leading-tight tracking-tight drop-shadow-2xl">
                            Para cada empresa <br />
                            hay una estrategia
                        </h1>

                        <p className="text-base md:text-lg text-[#e0e0e0] font-medium leading-relaxed max-w-3xl mb-12 drop-shadow-lg">
                            Accrual es tu aliado en el mundo fiscal y financiero. Ofrecemos soluciones adaptadas a tus necesidades, ayudándote a
                            cumplir con tus responsabilidades fiscales y a gestionar tu patrimonio de manera eficiente. Descubre cómo nuestros
                            servicios pueden transformar tu situación fiscal y financiera.
                        </p>

                        <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20 mb-12">
                            Solicita un presupuesto <span className="text-xl">›</span>
                        </button>

                        {/* Video Placeholder */}
                        <div className="w-full max-w-6xl aspect-video bg-[#47544b]/50 rounded-[2rem] relative flex items-center justify-center shadow-2xl overflow-hidden group border border-[#e0e0e0]/20 backdrop-blur-sm">
                            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#e0e0e0]/10 rounded-full transition-colors hidden md:block z-20"
            >
                <ChevronLeft className="w-12 h-12 text-[#e0e0e0]" strokeWidth={3} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#e0e0e0]/10 rounded-full transition-colors hidden md:block z-20"
            >
                <ChevronRight className="w-12 h-12 text-[#e0e0e0]" strokeWidth={3} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 flex gap-4 z-20">
                <button
                    onClick={() => setCurrentSlide('fiscal')}
                    className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 'fiscal' ? 'bg-[#e0e0e0]' : 'bg-[#e0e0e0]/30'}`}
                />
                <button
                    onClick={() => setCurrentSlide('strategy')}
                    className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 'strategy' ? 'bg-[#e0e0e0]' : 'bg-[#e0e0e0]/30'}`}
                />
                <span className="w-3 h-3 rounded-full bg-[#e0e0e0]/30"></span>
                <span className="w-3 h-3 rounded-full bg-[#e0e0e0]/30"></span>
                <span className="w-3 h-3 rounded-full bg-[#e0e0e0]/30"></span>
                <span className="w-3 h-3 rounded-full bg-[#e0e0e0]/30"></span>
            </div>
        </section>
    );
};

export default Hero;
