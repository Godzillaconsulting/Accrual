import React from 'react';
import { Search, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import accrualLogo from '../assets/Accrual logo (sin slogan).png';
import logoBlue from '../assets/logo-completo-azul.svg';
import { searchIndex } from '../data/searchIndex';
import { playSound } from './trionn/AudioSynth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);

    const handleScrollToTop = (e) => {
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollToAbout = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            const el = document.getElementById('quienes-somos');
            if (el) {
                const navHeight = 80; // approximate navbar height
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            navigate('/#quienes-somos');
        }
    };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
            const results = searchIndex.filter(item => {
                const textToSearch = (item.title + ' ' + item.keywords).toLowerCase();
                return queryWords.every(word => textToSearch.includes(word));
            });
            setSearchResults(results.slice(0, 6)); // Limit to 6 results
        } else {
            setSearchResults([]);
        }
    };

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.services-dropdown')) {
                setIsServicesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={`text-white sticky top-0 z-50 transition-all duration-300 px-6 md:px-12 ${isScrolled ? 'bg-[#040508]/90 backdrop-blur-2xl border-b border-[rgba(65,65,65,0.51)] py-3 shadow-2xl' : 'bg-[#040508]/60 backdrop-blur-md border-b border-white/5 py-4'}`}>
            <div className="flex items-center justify-between max-w-[1920px] mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        onClick={handleScrollToTop}
                        onMouseEnter={() => playSound('hover')}
                        className={`relative group flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'h-10' : 'h-14'}`}
                    >
                        {/* Main Logo */}
                        <img
                            src={accrualLogo}
                            alt="Accrual Logo"
                            className="h-full w-auto object-contain transition-all duration-300"
                        />
                    </Link>
                </div>

                {/* Search Bar - Trionn Glassmorphism */}
                <div className="hidden lg:flex relative items-center bg-white/5 rounded-full px-4 h-11 w-1/3 max-w-xl mx-8 border border-white/10 z-50 focus-within:border-[#00E5FF]/50 transition-all">
                    <input
                        type="text"
                        placeholder="¿Cómo podemos ayudarte?"
                        className="bg-transparent border-none outline-none w-full h-full text-white placeholder-white/40 font-medium text-sm"
                        value={searchQuery}
                        onChange={handleSearch}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                                setIsSearchFocused(false);
                                navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
                            }
                        }}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                    <Search className="w-5 h-5 text-[#00E5FF]" />

                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#08090C]/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-[rgba(65,65,65,0.51)] z-[60] overflow-hidden">
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-4 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5 mb-1">
                                        Sugerencias
                                    </div>
                                    {searchResults.map((result, idx) => (
                                        <Link
                                            key={idx}
                                            to={result.path}
                                            className="flex items-center px-4 py-3 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setIsSearchFocused(false);
                                            }}
                                            onMouseEnter={() => playSound('hover')}
                                        >
                                            <Search className="w-4 h-4 mr-3 opacity-50" />
                                            <span className="text-sm font-medium">{result.title}</span>
                                        </Link>
                                    ))}
                                    <button 
                                        onClick={() => {
                                            setIsSearchFocused(false);
                                            navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
                                        }}
                                        className="w-full text-center px-4 py-3 mt-1 text-xs font-bold text-[#00E5FF] hover:bg-white/5 transition-colors uppercase tracking-wider border-t border-white/5"
                                    >
                                        Ver todos los resultados
                                    </button>
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-center text-[#D8D8D8] text-sm flex flex-col items-center justify-center gap-2">
                                    <Search className="w-6 h-6 opacity-30" />
                                    <span>No encontramos resultados para "<span className="text-white font-medium">{searchQuery}</span>"</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Menu - Trionn Pill Nav Style */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wider">
                    <Link to="/" onClick={handleScrollToTop} onMouseEnter={() => playSound('hover')} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors nav-link flex items-center h-11">INICIO</Link>
                    <a href="/#quienes-somos" onClick={handleScrollToAbout} onMouseEnter={() => playSound('hover')} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors whitespace-nowrap nav-link flex items-center h-11 cursor-pointer">QUIÉNES SOMOS</a>

                    {/* Services Dropdown */}
                    <div className="relative group services-dropdown flex items-center h-11">
                        <div className="flex items-center gap-1">
                            <Link
                                to="/servicios"
                                className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors uppercase nav-link flex items-center h-11"
                                onClick={() => setIsMobileMenuOpen(false)}
                                onMouseEnter={() => playSound('hover')}
                            >
                                SERVICIOS
                            </Link>
                            <button
                                className="text-[#D8D8D8] hover:text-[#00E5FF] p-1 flex items-center transition-all duration-300"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsServicesOpen(!isServicesOpen);
                                }}
                            >
                                <ChevronDown className="w-4 h-4 -ml-1" />
                            </button>
                        </div>
                        {/* Dropdown Menu */}
                        <div
                            onClick={(e) => {
                                if (e.target.tagName === 'A' || e.target.closest('a')) {
                                    setIsServicesOpen(false);
                                }
                            }}
                            className={`absolute top-full left-0 mt-2 w-72 bg-[#08090C]/95 backdrop-blur-xl rounded-xl shadow-2xl py-2 transition-all duration-200 border border-[rgba(65,65,65,0.51)] ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                        >
                            <Link to="/servicios/consultoria" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">Consultoría</Link>
                            <Link to="/servicios/planificacion-fiscal-avanzada" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">Planificación fiscal avanzada</Link>
                            <Link to="/servicios/declaracion-de-impuestos" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">Declaración de impuestos</Link>
                            <Link to="/servicios/imss-e-infonavit" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">IMSS e Infonavit</Link>
                            <Link to="/servicios/repse" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">REPSE</Link>
                            <Link to="/servicios/administracion-de-nomina" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">Administración de nómina</Link>
                            <Link to="/servicios/contabilidad" onMouseEnter={() => playSound('hover')} className="block px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">Contabilidad</Link>

                            {/* Nested Menu for Ver más */}
                            <div className="group/nested relative">
                                <button className="w-full flex items-center justify-between px-6 py-2.5 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] transition-colors whitespace-nowrap text-sm">
                                    <span>Ver más</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                {/* Nested Content */}
                                <div className="absolute top-0 right-full mt-0 w-[500px] bg-[#08090C]/95 backdrop-blur-xl rounded-xl shadow-2xl p-4 transition-all duration-200 border border-[rgba(65,65,65,0.51)] opacity-0 invisible translate-x-2 group-hover/nested:opacity-100 group-hover/nested:visible group-hover/nested:translate-x-0 grid grid-cols-2 gap-x-4">
                                    <Link to="/servicios/asesoria-en-planificacion-fiscal" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Asesoría en planificación fiscal</Link>
                                    <Link to="/servicios/cumplimiento-tributario-servicio" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Cumplimiento tributario</Link>
                                    <Link to="/servicios/cumplimiento-en-seguridad-social" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Cumplimiento en seguridad social</Link>
                                    <Link to="/servicios/consultoria-financiera" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Consultoría financiera</Link>
                                    <Link to="/servicios/auditoria-financiera" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Auditoría financiera</Link>
                                    <Link to="/servicios/asesoria-contable" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Asesoría contable</Link>
                                    <Link to="/servicios/facturacion" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Facturación</Link>
                                    <Link to="/servicios/capacitacion" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">Capacitación</Link>
                                    <Link to="/servicios/lfpiorpi" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-[#D8D8D8] hover:bg-white/5 hover:text-[#00E5FF] rounded transition-colors text-sm">LFPIORPI</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to="/articulos" onMouseEnter={() => playSound('hover')} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors nav-link flex items-center h-11">ARTÍCULOS</Link>
                    <a href="#" onMouseEnter={() => playSound('hover')} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors nav-link flex items-center h-11">RECURSOS</a>
                    <Link to="/contacto" onClick={() => playSound('cta')} onMouseEnter={() => playSound('hover')} className="!bg-[#00E5FF] !text-[#040508] px-8 h-11 rounded-md font-black hover:!bg-white transition-all transform flex items-center justify-center">
                        CONTACTO
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                    <div className="flex items-center bg-white/5 rounded-full px-4 h-10 mb-2 border border-white/10">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="bg-transparent border-none outline-none w-full h-full text-white placeholder-white/40 font-medium text-sm"
                            value={searchQuery}
                            onChange={handleSearch}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                                    setIsMobileMenuOpen(false);
                                    navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                        />
                        <Search className="w-4 h-4 text-[#00E5FF]" />
                    </div>
                    {searchResults.length > 0 && searchQuery.length > 0 && (
                        <div className="flex flex-col gap-2 mb-4 pl-4 border-l-2 border-[#00E5FF]">
                            {searchResults.slice(0, 3).map((result, idx) => (
                                <Link 
                                    key={idx} 
                                    to={result.path}
                                    className="text-sm text-[#D8D8D8] hover:text-[#00E5FF]"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {result.title}
                                </Link>
                            ))}
                        </div>
                    )}
                    <Link to="/" onClick={handleScrollToTop} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors">INICIO</Link>
                    <a href="/#quienes-somos" onClick={handleScrollToAbout} className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors cursor-pointer">QUIÉNES SOMOS</a>
                    <Link to="/cumplimiento-tributario" className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>SERVICIOS</Link>
                    <Link to="/articulos" className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ARTÍCULOS</Link>
                    <Link to="/contacto" className="text-[#D8D8D8] hover:text-[#00E5FF] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTACTO</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
