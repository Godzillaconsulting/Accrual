import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { searchIndex } from '../data/searchIndex';
import { Search, ArrowRight } from 'lucide-react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
        return searchIndex.filter(item => {
            const textToSearch = (item.title + ' ' + item.keywords).toLowerCase();
            return queryWords.every(word => textToSearch.includes(word));
        });
    }, [query]);

    return (
        <div className="font-sans antialiased text-[#233657] bg-[#D0D0DA] flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow pt-32 pb-24 px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col items-center">
                <div className="w-full mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#233657] mb-3">
                        Resultados de búsqueda
                    </h1>
                    <p className="text-lg opacity-80 font-medium bg-white/40 inline-block px-4 py-2 rounded-lg border border-white">
                        Mostrando {results.length} resultado{results.length !== 1 ? 's' : ''} para la búsqueda: "<span className="font-bold text-[#0F4C82]">{query}</span>"
                    </p>
                </div>

                {results.length > 0 ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((result, idx) => (
                            <Link 
                                key={idx} 
                                to={result.path}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-[#233657]/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-[#D0D0DA]/30 p-2 rounded-lg group-hover:bg-[#0F4C82] group-hover:text-white transition-colors">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#233657] group-hover:text-[#0F4C82] transition-colors leading-tight">
                                            {result.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm opacity-60 flex flex-wrap gap-2 mb-6">
                                        {result.keywords.split(' ').slice(0, 4).map(kw => (
                                            <span key={kw} className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                                                {kw}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                                <div className="flex justify-end border-t border-gray-100 pt-4">
                                    <span className="text-sm font-bold uppercase tracking-wider text-[#0F4C82] flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Explorar <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="w-full bg-white p-12 md:p-20 rounded-[2rem] shadow-sm border border-white text-center flex flex-col items-center">
                        <div className="bg-red-50 p-6 rounded-full mb-6">
                            <Search className="w-12 h-12 text-red-300" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase text-[#233657]">Sin coincidencias</h2>
                        <p className="text-lg opacity-70 max-w-lg mx-auto mb-8">
                            No encontramos exactamente lo que buscas con esas palabras clave. Intenta utilizar términos más generales o explora todos nuestros servicios.
                        </p>
                        <Link to="/servicios" className="bg-[#233657] text-white font-bold py-3 px-8 rounded-full uppercase transition-all shadow-lg text-sm tracking-widest hover:bg-[#0F4C82] hover:scale-105">
                            Ver todos los servicios
                        </Link>
                    </div>
                )}
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default SearchResults;
