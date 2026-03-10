import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Miranda Wiley ND",
        role: "Directora Ejecutiva",
        content: "Desde que trabajamos con Accrual, nuestra planificación fiscal ha dado un salto de calidad increíble. Entienden perfectamente los retos de la frontera.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Ricardo Treviño",
        role: "Empresario Industrial",
        content: "La asesoría en IMSS e Infonavit fue clave para regularizar nuestras operaciones. Son estrategas reales, no solo capturistas.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Sofía Martínez",
        role: "Fundadora de StartUp",
        content: "Excelente servicio de contabilidad y facturación. El equipo es muy profesional y siempre están disponibles para resolver dudas.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Carlos Méndez",
        role: "Director de Logística",
        content: "La implementación de estrategias de cumplimiento tributario nos ahorró tiempo y recursos valiosos. Altamente recomendados.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Elena Gómez",
        role: "Consultora de Negocios",
        content: "Su enfoque en la planeación avanzada es lo que los distingue. Realmente se preocupan por el crecimiento patrimonial de sus clientes.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Javier Ortiz",
        role: "Dueño de Restaurante",
        content: "Tener orden en mis impuestos y nómina me dio la paz mental que necesitaba para enfocarme en mi negocio. Gracias, Accrual.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const sliderRef = useRef(null);

    // Update isMobile on resize
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const itemsPerView = isMobile ? 1 : 3;
    const maxIndex = Math.max(0, testimonials.length - itemsPerView);

    const next = () => {
        if (activeIndex < maxIndex) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const prev = () => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    // Drag handling
    const handleDragStart = (e) => {
        setIsDragging(true);
        setStartX((e.pageX || e.touches[0].pageX) - sliderRef.current.offsetLeft);
        setScrollLeft(activeIndex);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - sliderRef.current.offsetLeft;
        const walk = (x - startX) / 200; // Sensibilidad del arrastre

        if (Math.abs(walk) > 0.5) {
            if (walk > 0) prev();
            else next();
            setIsDragging(false); // Detener drag tras cambio
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <section className="bg-[#D0D0DA] py-24 px-4 overflow-hidden select-none">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-[#233657] text-3xl md:text-5xl font-black mb-20 md:mb-28 tracking-tight uppercase">
                    <span className="block">lo que opinan nuestros clientes</span>
                    <span className="block">de Accrual</span>
                </h2>

                <div className="relative flex items-center justify-center gap-2">
                    {/* Left Button */}
                    <button
                        onClick={prev}
                        className={`hidden md:flex flex-shrink-0 z-20 p-4 rounded-full bg-white text-[#233657] shadow-xl hover:bg-[#233657] hover:text-white transition-all duration-300 transform hover:scale-110 border-2 border-transparent ${activeIndex === 0 ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div
                        ref={sliderRef}
                        className="w-full overflow-hidden cursor-grab active:cursor-grabbing px-4 md:px-6 py-20"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out gap-8"
                            style={{
                                transform: `translateX(calc(-${activeIndex} * (${100 / itemsPerView}% + ${32 / itemsPerView}px)))`
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="w-full md:w-[calc(33.333%-1.35rem)] flex-shrink-0 group"
                                >
                                    <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative flex flex-col justify-between transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] hover:scale-[1.03] hover:z-10 border-b-[12px] border-transparent hover:border-[#233657] mt-16">
                                        <div className="flex flex-col items-center">
                                            {/* Avatar with Shadow Ring */}
                                            <div className="w-28 h-28 rounded-full border-8 border-white shadow-2xl overflow-hidden -mt-24 mb-6 group-hover:scale-110 transition-transform duration-500">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Name & Role */}
                                            <h3 className="text-[#233657] font-black text-2xl mb-2 tracking-tight">{testimonial.name}</h3>
                                            <p className="text-[#233657]/50 text-xs font-black uppercase tracking-[0.2em] mb-8">{testimonial.role}</p>

                                            {/* Content with Decorative Quotes */}
                                            <div className="relative pt-6 border-t border-[#233657]/5 w-full">
                                                <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-[#233657]/10" />
                                                <p className="text-[#233657]/70 text-lg italic font-medium leading-relaxed px-4 text-center">
                                                    "{testimonial.content}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={next}
                        className={`hidden md:flex flex-shrink-0 z-20 p-4 rounded-full bg-white text-[#233657] shadow-xl hover:bg-[#233657] hover:text-white transition-all duration-300 transform hover:scale-110 border-2 border-transparent ${activeIndex >= maxIndex ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>

                {/* Pagination Dots (Optional for better UX with swipe) */}
                <div className="mt-12 flex justify-center gap-3">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-[#233657]' : 'w-2 bg-[#233657]/20'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
