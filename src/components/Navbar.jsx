import React from 'react';
import { Search, Menu, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import accrualLogo from '../assets/Accrual logo (sin slogan).png';
import { searchIndex } from '../data/searchIndex';
import { playSound } from './trionn/AudioSynth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const handleScrollToTop = (e) => {
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleScrollToAbout = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (location.pathname === '/') {
            const el = document.getElementById('quienes-somos');
            if (el) {
                const navHeight = 100;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        } else {
            navigate('/#quienes-somos');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
            const results = searchIndex.filter(item => {
                const textToSearch = (item.title + ' ' + item.keywords).toLowerCase();
                return queryWords.every(word => textToSearch.includes(word));
            });
            setSearchResults(results.slice(0, 6));
        } else {
            setSearchResults([]);
        }
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.services-dropdown')) {
                setIsServicesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="pointer-events-auto flex items-center justify-between w-full max-w-6xl bg-[#090d16]/85 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                {/* Logo & Brand */}
                <Link
                    to="/"
                    onClick={handleScrollToTop}
                    onMouseEnter={() => playSound('hover')}
                    className="flex items-center gap-3 shrink-0"
                >
                    <img
                        src={accrualLogo}
                        alt="Accrual Logo"
                        className="h-9 w-auto object-contain"
                    />
                    <span className="hidden sm:inline-block text-[10px] font-extrabold tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded-full uppercase">
                        PRO
                    </span>
                </Link>

                {/* Central Pill Navigation Links */}
                <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
                    <Link
                        to="/"
                        onClick={handleScrollToTop}
                        onMouseEnter={() => playSound('hover')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                            isActive('/')
                                ? 'bg-[#00E5FF] text-[#040508] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        inicio
                    </Link>

                    <a
                        href="/#quienes-somos"
                        onClick={handleScrollToAbout}
                        onMouseEnter={() => playSound('hover')}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                        nosotros
                    </a>

                    {/* Services Dropdown */}
                    <div className="relative group services-dropdown">
                        <Link
                            to="/servicios"
                            onMouseEnter={() => playSound('hover')}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1 ${
                                location.pathname.startsWith('/servicios')
                                    ? 'bg-[#00E5FF] text-[#040508] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            servicios
                            <ChevronDown className="w-3 h-3 opacity-70" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#090d16]/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-2 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <Link to="/servicios/consultoria" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Consultoría Fiscal</Link>
                            <Link to="/servicios/planificacion-fiscal-avanzada" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Planificación Avanzada</Link>
                            <Link to="/servicios/declaracion-de-impuestos" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Declaración de Impuestos</Link>
                            <Link to="/servicios/imss-e-infonavit" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">IMSS e Infonavit</Link>
                            <Link to="/servicios/repse" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Cumplimiento REPSE</Link>
                            <Link to="/servicios/administracion-de-nomina" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Gestión de Nómina</Link>
                            <Link to="/servicios/contabilidad" onMouseEnter={() => playSound('hover')} className="block px-4 py-2 text-xs text-neutral-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-xl transition-colors">Contabilidad Integral</Link>
                        </div>
                    </div>

                    <Link
                        to="/articulos"
                        onMouseEnter={() => playSound('hover')}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                            isActive('/articulos')
                                ? 'bg-[#00E5FF] text-[#040508] font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        artículos
                    </Link>
                </div>

                {/* Right Action Icons (Search & Contact) */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            onClick={() => setIsSearchFocused(!isSearchFocused)}
                            onMouseEnter={() => playSound('hover')}
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"
                            aria-label="Buscar"
                        >
                            <Search className="w-4 h-4 text-[#00E5FF]" />
                        </button>

                        {/* Search Popup Modal */}
                        {isSearchFocused && (
                            <div className="absolute right-0 top-12 w-80 bg-[#090d16]/95 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-2xl z-50">
                                <div className="flex items-center bg-white/5 rounded-full px-3 py-2 border border-white/10 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Buscar temas fiscal..."
                                        className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-neutral-500"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                                                setIsSearchFocused(false);
                                                navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
                                            }
                                        }}
                                    />
                                    <X className="w-4 h-4 text-neutral-400 cursor-pointer" onClick={() => setIsSearchFocused(false)} />
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {searchResults.map((res, i) => (
                                            <Link
                                                key={i}
                                                to={res.path}
                                                onClick={() => setIsSearchFocused(false)}
                                                className="block px-3 py-1.5 text-xs text-neutral-300 hover:text-[#00E5FF] hover:bg-white/5 rounded-lg"
                                            >
                                                {res.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/contacto"
                        onClick={() => playSound('cta')}
                        onMouseEnter={() => playSound('hover')}
                        className="hidden sm:inline-flex items-center gap-1.5 bg-[#00E5FF] text-[#040508] px-5 py-2 rounded-full text-xs font-black tracking-wider hover:bg-white transition-all transform active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    >
                        contacto
                    </Link>

                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="pointer-events-auto absolute top-16 left-4 right-4 bg-[#090d16]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col gap-4 text-center">
                    <Link to="/" onClick={handleScrollToTop} className="text-sm font-bold text-white py-2 border-b border-white/5">INICIO</Link>
                    <a href="/#quienes-somos" onClick={handleScrollToAbout} className="text-sm font-bold text-white py-2 border-b border-white/5">NOSOTROS</a>
                    <Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-white py-2 border-b border-white/5">SERVICIOS</Link>
                    <Link to="/articulos" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-white py-2 border-b border-white/5">ARTÍCULOS</Link>
                    <Link to="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#00E5FF] text-[#040508] py-3 rounded-full font-black text-sm uppercase">CONTACTO</Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
