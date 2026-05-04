import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

const servicesList = [
    { title: "Consultoría", slug: "consultoria", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Planificación fiscal avanzada", slug: "planificacion-fiscal-avanzada", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Declaración de impuestos", slug: "declaracion-de-impuestos", image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "IMSS e Infonavit", slug: "imss-e-infonavit", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "REPSE", slug: "repse", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Administración de nómina", slug: "administracion-de-nomina", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Contabilidad", slug: "contabilidad", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Asesoría en planificación fiscal", slug: "asesoria-en-planificacion-fiscal", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Cumplimiento tributario", slug: "cumplimiento-tributario-servicio", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Cumplimiento en seguridad social", slug: "cumplimiento-en-seguridad-social", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Consultoría financiera", slug: "consultoria-financiera", image: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Auditoría financiera", slug: "auditoria-financiera", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Asesoría contable", slug: "asesoria-contable", image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Facturación", slug: "facturacion", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Capacitación", slug: "capacitacion", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { title: "Ley federal para la prevención e identificación de operaciones con recursos de procedencia ilícita", slug: "lfpiorpi", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

const ServicesOverview = () => {
    const { getNodeData } = useSiteData();
    const siteData = getNodeData('servicios-grid');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans text-[#233657]">
            <Navbar />

            <main>
                {/* Hero / Header Section */}
                <section className="bg-[#4B5563] text-white py-24 px-6 font-sans relative"
                         style={siteData?.heroImageUrl ? { backgroundImage: `url(${siteData.heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {siteData?.heroImageUrl && <div className="absolute inset-0 bg-[#4B5563]/80 backdrop-blur-sm"></div>}
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <h1 
                            className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6"
                            dangerouslySetInnerHTML={{ __html: siteData?.title || 'Servicios' }}
                        />
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {servicesList.map((service, index) => (
                            <div key={index} className="bg-[#233657] relative h-[350px] rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer border border-[#233657]/10 hover:border-[#0F4C82] transition-all duration-300 hover:-translate-y-2">

                                {/* Full Background Image */}
                                <img loading="lazy" 
                                    src={siteData?.[`img_${service.slug}`] || service.image}
                                    alt={service.title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#233657] via-[#233657]/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-[#D0D0DA]">
                                    <h3 className="text-2xl font-bold leading-tight mb-6 text-white drop-shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2 text-left">
                                        {service.title}
                                    </h3>

                                    <Link to={`/servicios/${service.slug}`} className="bg-[#D0D0DA]/20 backdrop-blur-md text-[#D0D0DA] border border-[#D0D0DA]/30 px-6 py-3 rounded-full font-bold text-sm flex items-center w-max hover:bg-[#D0D0DA] hover:text-[#233657] transition-all duration-300 shadow-lg">
                                        Saber más
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default ServicesOverview;
