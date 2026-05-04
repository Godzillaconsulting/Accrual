import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import heroVideo from '../assets/AccrualLPVideo_AM_060325.mp4';

const SLIDES = ['fiscal', 'estrategia'];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { getNodeData } = useSiteData();
    const data = getNodeData('hero') || {};

    // Auto-rotate every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % SLIDES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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
                    <source src={data.videoUrl || heroVideo} type="video/mp4" />
                </video>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 shadow-inner"></div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/40'
                        }`}
                    />
                ))}
            </div>

            {/* Carousel Content */}
            <div className="w-full max-w-7xl px-8 flex flex-col relative z-10 h-full justify-center pt-20">

                {SLIDES[currentSlide] === 'fiscal' ? (
                    // Slide 1: Ingeniería Fiscal
                    <div className="w-full flex flex-col items-start text-left animate-fade-in py-10">
                        <h1
                            className="text-3xl md:text-4xl lg:text-5xl font-black text-[#D0D0DA] mb-6 leading-tight tracking-tight uppercase max-w-none drop-shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: data.heroTitle1 || 'Ingeniería Fiscal y Patrimonial <br /> para la Frontera Norte' }}
                        />

                        <p
                            className="text-base md:text-lg text-[#D0D0DA] font-medium max-w-2xl mb-10 drop-shadow-lg"
                            dangerouslySetInnerHTML={{ __html: data.heroSubtitle1 || 'Optimizamos tu carga tributaria en México y coordinamos tu cumplimiento internacional. Desde RESICO hasta Precios de Transferencia.' }}
                        />

                        <div className="flex flex-row gap-6">
                            <button
                                onClick={scrollToPricing}
                                className="bg-[#D0D0DA]/10 hover:bg-[#0F4C82] text-[#D0D0DA] font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20"
                                dangerouslySetInnerHTML={{ __html: data.heroBtn1 || 'Ver Planes' }}
                            />
                            <Link to="/servicios">
                                <button
                                    className="bg-[#D0D0DA]/10 hover:bg-[#0F4C82] text-[#D0D0DA] font-bold py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20"
                                    dangerouslySetInnerHTML={{ __html: data.heroBtn2 || 'Ver Servicios' }}
                                />
                            </Link>
                        </div>
                    </div>
                ) : (

                    // Slide 2: Original Content
                    <div className="w-full flex flex-col items-center text-center animate-fade-in pt-20 pb-20">
                        <h1 
                            className="text-5xl md:text-7xl font-bold text-[#D0D0DA] mb-8 leading-tight tracking-tight drop-shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: data.heroTitle2 || 'Para cada empresa <br /> hay una estrategia' }}
                        />

                        <p 
                            className="text-base md:text-lg text-[#D0D0DA] font-medium leading-relaxed max-w-3xl mb-12 drop-shadow-lg"
                            dangerouslySetInnerHTML={{ __html: data.heroSubtitle2 || 'Accrual es tu aliado en el mundo fiscal y financiero. Ofrecemos soluciones adaptadas a tus necesidades, ayudándote a cumplir con tus responsabilidades fiscales y a gestionar tu patrimonio de manera eficiente.' }}
                        />

                        <button 
                            className="bg-[#D0D0DA]/10 hover:bg-[#0F4C82] text-[#D0D0DA] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20 mb-12"
                            dangerouslySetInnerHTML={{ __html: data.heroBtn3 || 'Solicita un presupuesto' }}
                        />

                    </div>
                )}
            </div>


        </section>
    );
};

export default Hero;
