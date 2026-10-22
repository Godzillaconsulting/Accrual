import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import heroVideo from '../assets/AccrualLPVideo_AM_060325.mp4';
import { getYouTubeId } from './MediaPicker';

const Hero = () => {
    const { getNodeData } = useSiteData();
    const data = getNodeData('hero') || {};
    const videoUrl = data.videoUrl || heroVideo;
    const ytId = getYouTubeId(videoUrl);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

    useEffect(() => {
        // Only load heavy 26MB video on desktop and when connection isn't on Save-Data
        const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
        const isSaveData = navigator.connection && navigator.connection.saveData;
        if (!isMobile && !isSaveData) {
            // Defer video loading until after initial paint
            const timer = setTimeout(() => setShouldLoadVideo(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 bg-[#040508]">
            {/* Background Video (Desktop only / deferred) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#090d16] via-[#040508] to-[#040508]">
                {ytId ? (
                    <iframe
                        key={ytId}
                        src={`https://www.youtube.com/embed/${ytId}?controls=0&mute=1&autoplay=1&loop=1&playlist=${ytId}&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                        style={{
                            width: '100vw',
                            height: '56.25vw',
                            minHeight: '100vh',
                            minWidth: '177.77vh',
                            border: 'none'
                        }}
                        loading="lazy"
                        allow="autoplay; encrypted-media"
                    />
                ) : shouldLoadVideo ? (
                    <video
                        key={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover opacity-50 hidden md:block"
                        src={videoUrl}
                    />
                ) : null}
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Hero Content */}
            <div className="w-full max-w-7xl px-6 md:px-8 flex flex-col relative z-10 h-full justify-center pt-24 sm:pt-20">
                <div className="w-full flex flex-col items-start text-left animate-fade-in py-10">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight uppercase max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.heroTitle1 || 'Ingeniería Fiscal y Patrimonial <br /> para la Frontera Norte' }}
                    />

                    <p
                        className="text-sm sm:text-base md:text-lg text-[#D0D0DA] font-medium max-w-2xl mb-10 drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: data.heroSubtitle1 || 'Optimizamos tu carga tributaria en México y coordinamos tu cumplimiento internacional. Desde RESICO hasta Precios de Transferencia.' }}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                        <button
                            onClick={scrollToPricing}
                            className="w-full sm:w-auto bg-[#D0D0DA]/10 hover:bg-[#0F4C82] text-[#D0D0DA] font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20 text-center"
                            dangerouslySetInnerHTML={{ __html: data.heroBtn1 || 'Ver Planes' }}
                        />
                        <Link to="/servicios" className="w-full sm:w-auto">
                            <button
                                className="w-full sm:w-auto bg-[#D0D0DA]/10 hover:bg-[#0F4C82] text-[#D0D0DA] font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20 text-center"
                                dangerouslySetInnerHTML={{ __html: data.heroBtn2 || 'Ver Servicios' }}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
