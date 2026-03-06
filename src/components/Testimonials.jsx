import React, { useState } from 'react';
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
    const [activeIndex, setActiveIndex] = useState(1);

    const next = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="bg-[#D0D0DA] py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-[#233657] text-3xl md:text-5xl font-black mb-16 tracking-tight uppercase">
                    Lo que opinan nuestros clientes
                </h2>

                <div className="relative flex items-center justify-center gap-4">
                    {/* Left Button */}
                    <button
                        onClick={prev}
                        className="absolute left-0 md:static z-20 p-3 rounded-full bg-white text-[#233657] shadow-xl hover:bg-[#233657] hover:text-white transition-all transform hover:scale-110 border-2 border-transparent"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center justify-center gap-8 w-full max-w-4xl px-4">
                        {testimonials.map((testimonial, index) => {
                            const isActive = index === activeIndex;
                            const isSide = index === (activeIndex - 1 + testimonials.length) % testimonials.length ||
                                index === (activeIndex + 1) % testimonials.length;

                            if (!isActive && !isSide) return null;

                            return (
                                <div
                                    key={index}
                                    className={`transition-all duration-700 transform flex-shrink-0 w-full md:w-[30%] lg:w-[32%]
                                        ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-60 scale-90 md:opacity-80'}`}
                                >
                                    <div className={`bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative h-full flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] ${isActive ? 'border-b-[10px] border-[#233657]' : 'border-b-[10px] border-transparent'}`}>
                                        <div className="flex flex-col items-center">
                                            {/* Avatar with Shadow Ring */}
                                            <div className="w-28 h-28 rounded-full border-8 border-white shadow-2xl overflow-hidden -mt-20 mb-6 group-hover:scale-105 transition-transform">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Name & Role */}
                                            <h3 className={`text-[#233657] font-black text-2xl mb-2 tracking-tight ${isActive ? '' : 'text-[#233657]/80'}`}>{testimonial.name}</h3>
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
                            );
                        })}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={next}
                        className="absolute right-0 md:static z-20 p-3 rounded-full bg-white text-[#233657] shadow-xl hover:bg-[#233657] hover:text-white transition-all transform hover:scale-110 border-2 border-transparent"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
