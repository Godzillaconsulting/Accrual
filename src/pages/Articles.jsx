import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { ArrowRight, Loader2 } from 'lucide-react';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/articles')
            .then(res => {
                if (!res.ok) throw new Error('Error de conexión con la API');
                return res.json();
            })
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#233657]">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-xl font-bold">Cargando artículos...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 font-bold text-xl">
                            Hubo un error al cargar los artículos.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {articles.map((article) => (
                                <div key={article.id} className="relative h-[450px] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-[#233657]/10 hover:border-[#0F4C82] transition-all duration-300 hover:-translate-y-2">
                                    {/* Full Background Image */}
                                    <img loading="lazy" 
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

                                        <Link to={`/articulos/${article.id}`} className="bg-[#D0D0DA]/20 backdrop-blur-md text-[#D0D0DA] border border-[#D0D0DA]/30 px-6 py-3 rounded-full font-bold text-sm flex items-center w-max hover:bg-[#D0D0DA] hover:text-[#233657] transition-all duration-300 shadow-lg">
                                            Saber más
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Articles;
