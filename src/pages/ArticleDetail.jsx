import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';



import { mockArticles } from '../utils/mockArticles';
import { useSiteData } from '../context/SiteContext';

const ArticleDetail = ({ id: propId }) => {
    const params = useParams();
    const id = propId || params.id;
    const [article, setArticle] = useState(null);
    const [allArticles, setAllArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedStartIndex, setRelatedStartIndex] = useState(0);

    const { getNodeData } = useSiteData();
    const dynamicData = getNodeData('articulo-' + id) || {};

    useEffect(() => {
        window.scrollTo(0, 0);
        setRelatedStartIndex(0);
        setLoading(true);

        fetch('/api/public/articles')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar la base de datos');
                return res.json();
            })
            .then(data => {
                const articlesArray = data.articles || [];
                setAllArticles(articlesArray);
                const current = articlesArray.find(a => a.id === parseInt(id));
                setArticle(current);
                setLoading(false);
            })
            .catch(err => {
                console.warn('Usando mock de artículos por error en API:', err);
                setAllArticles(mockArticles);
                const current = mockArticles.find(a => a.id === parseInt(id));
                setArticle(current);
                setError(current ? null : 'Artículo no encontrado');
                setLoading(false);
            });
    }, [id]);

    const otherArticlesHelper = allArticles.filter(a => a.id !== parseInt(id));

    const nextRelated = () => {
        setRelatedStartIndex((prev) => (prev + 1) % Math.max(1, otherArticlesHelper.length));
    };

    const prevRelated = () => {
        setRelatedStartIndex((prev) => (prev - 1 + otherArticlesHelper.length) % Math.max(1, otherArticlesHelper.length));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#233657]">
                <div className="w-12 h-12 border-4 border-[#233657] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold">Cargando artículo...</p>
            </div>
        );
    }

    if (!dynamicData.title && (error || !article)) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-[#233657]">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">{error ? 'Error de conexión' : 'Artículo no encontrado'}</h1>
                    <Link to="/articulos" className="text-[#0F4C82] hover:underline">Volver a Artículos</Link>
                </div>
            </div>
        );
    }

    const finalTitle = dynamicData.title || article?.title || 'Artículo';
    const finalContent = dynamicData.content || article?.content || '';
    const finalImage = dynamicData.imageUrl || article?.image || '';

    return (
        <div className="min-h-screen bg-white font-sans text-[#233657]">
            <Navbar />

            <main>
                {/* Header Section */}
                <section className="bg-[#4B5563] text-white py-24 px-6 font-sans">
                    <div className="max-w-4xl mx-auto text-left">
                        <h1 
                            className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-tight"
                            dangerouslySetInnerHTML={{ __html: finalTitle }}
                        />
                    </div>
                </section>

                <article className="max-w-4xl mx-auto px-6 py-16">

                    {/* Featured Image */}
                    <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-lg mb-16 relative bg-gray-100">
                        <img loading="lazy" 
                            src={finalImage}
                            alt="Artículo"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none text-[#233657]/80 leading-relaxed mb-12 article-content whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: finalContent }}
                    />

                    {/* CTA Button */}
                    <div className="flex justify-center mt-16 mb-8">
                        <Link to="/contacto">
                            <button className="bg-[#233657] hover:bg-[#0F4C82] text-white font-bold py-4 px-10 rounded-full uppercase text-lg shadow-xl transition-all transform hover:scale-105"
                                dangerouslySetInnerHTML={{ __html: dynamicData.ctaBtn || 'Quiero más información' }}
                            />
                        </Link>
                    </div>

                </article>

                {/* Related Articles Section */}
                <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black uppercase text-[#233657]"
                            dangerouslySetInnerHTML={{ __html: dynamicData.relatedTitle || 'Continúa Leyendo' }}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={prevRelated}
                                className="p-2 rounded-full border border-[#233657] text-[#233657] hover:bg-[#233657] hover:text-white transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextRelated}
                                className="p-2 rounded-full border border-[#233657] text-[#233657] hover:bg-[#233657] hover:text-white transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[0, 1, 2].map(offset => {
                            if (otherArticlesHelper.length === 0) return null;
                            const index = (relatedStartIndex + offset) % otherArticlesHelper.length;
                            const targetArticle = otherArticlesHelper[index];

                            const title = targetArticle?.title;
                            const img = targetArticle?.image;
                            const targetId = targetArticle?.id;

                            // Determine link path
                            const linkPath = `/articulos/${targetId}`;

                            return (
                                <div key={targetId} className="group cursor-pointer">
                                    <Link to={linkPath} className="block h-full">
                                        <div className="rounded-[20px] overflow-hidden mb-6 h-64 relative">
                                            <div className="absolute inset-0 bg-[#233657]/0 group-hover:bg-[#233657]/10 transition-colors duration-300 z-10" />
                                            <img loading="lazy" 
                                                src={img}
                                                alt={title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h4 className="text-xl font-bold text-[#233657] group-hover:text-[#0F4C82] transition-colors mb-4 line-clamp-2">
                                            {title}
                                        </h4>
                                        <span className="inline-flex items-center text-[#0F4C82] font-bold group-hover:gap-2 transition-all">
                                            Leer artículo <ArrowRight size={16} className="ml-1" />
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default ArticleDetail;
