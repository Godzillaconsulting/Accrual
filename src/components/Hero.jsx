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

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                {ytId ? (
                    <iframe
                        key={ytId}
                        src={`https://www.youtube.com/embed/${ytId}?controls=0&mute=1&autoplay=1&loop=1&playlist=${ytId}&playsinline=1`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                        style={{
                            width: '100vw',
                            height: '56.25vw', // 16:9 aspect ratio
                            minHeight: '100vh',
                            minWidth: '177.77vh',
                            border: 'none'
                        }}
                        allow="autoplay; encrypted-media"
                    />
                ) : (
                    <video
                        key={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        src={videoUrl}
                    />
                )}
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Hero Content */}
            <div className="w-full max-w-7xl px-8 flex flex-col relative z-10 h-full justify-center pt-20">
                <div className="w-full flex flex-col items-start text-left animate-fade-in py-10">
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--text-main)] mb-6 leading-tight tracking-tight uppercase max-w-none"
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
            </div>


        </section>
    );
};

export default Hero;
