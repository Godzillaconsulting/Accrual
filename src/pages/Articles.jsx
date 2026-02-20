import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { ArrowRight } from 'lucide-react';

const articles = [
    {
        id: 1,
        title: "Errores comunes en la declaración de impuestos y cómo evitarlos",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Beneficios de contratar un asesor fiscal profesional",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Beneficios del compliance fiscal",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Importancia del presupuesto para la toma de decisiones",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Implicaciones legales de los delitos fiscales",
        image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Suspensión de sellos digitales y sus consecuencias",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Partes relacionadas y los estudios de precio de transferencia",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        title: "Acciones BEPS y la planeación fiscal agresiva",
        image: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const Articles = () => {
    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans">
            <Navbar />

            <main>
                {/* Hero / Header Section */}
                <section className="bg-[#233657] text-[#D0D0DA] py-20 px-6 font-sans">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
                            Artículos
                        </h1>
                        <p className="text-xl opacity-80 max-w-2xl mx-auto">
                            Mantente informado con las últimas noticias, análisis y estrategias fiscales para tu negocio.
                        </p>
                    </div>
                </section>

                {/* Articles Grid */}
                <section className="py-20 px-6 max-w-[1920px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {articles.map((article) => (
                            <div key={article.id} className="relative h-[450px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-[#233657]/10 hover:border-[#0F4C82] transition-all duration-300 hover:-translate-y-2">
                                {/* Full Background Image */}
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#233657] via-[#233657]/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-[#D0D0DA]">
                                    <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6 text-white drop-shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2">
                                        {article.title}
                                    </h3>

                                    {article.id === 1 ? (
                                        <Link to="/articulos/errores-comunes" className="bg-[#D0D0DA]/20 backdrop-blur-md text-[#D0D0DA] border border-[#D0D0DA]/30 px-6 py-3 rounded-full font-bold text-sm flex items-center w-max hover:bg-[#D0D0DA] hover:text-[#233657] transition-all duration-300 shadow-lg">
                                            Saber más
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    ) : (
                                        <Link to={`/articulos/${article.id}`} className="bg-[#D0D0DA]/20 backdrop-blur-md text-[#D0D0DA] border border-[#D0D0DA]/30 px-6 py-3 rounded-full font-bold text-sm flex items-center w-max hover:bg-[#D0D0DA] hover:text-[#233657] transition-all duration-300 shadow-lg">
                                            Saber más
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    )}
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

export default Articles;
