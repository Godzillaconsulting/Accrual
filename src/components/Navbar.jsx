import React from 'react';
import { Search, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import accrualLogo from '../assets/Accrual logo (sin slogan).png';
import logoBlue from '../assets/logo-completo-azul.svg';

const searchIndex = [
    { title: 'Inicio', path: '/', keywords: 'home principal accrual' },
    { title: 'Quiénes Somos', path: '/quienes-somos', keywords: 'nosotros empresa equipo about experiencia' },
    { title: 'Servicios Generales', path: '/servicios', keywords: 'servicios portafolio catalogo' },
    { title: 'Consultoría', path: '/servicios/consultoria', keywords: 'consultoria asesoría estrategia' },
    { title: 'Planificación fiscal avanzada', path: '/servicios/planificacion-fiscal-avanzada', keywords: 'planificacion fiscal impuestos patrimonial' },
    { title: 'Declaración de impuestos', path: '/servicios/declaracion-de-impuestos', keywords: 'declaracion impuestos sat anual mensual' },
    { title: 'IMSS e Infonavit', path: '/servicios/imss-e-infonavit', keywords: 'imss infonavit seguridad social cuotas' },
    { title: 'REPSE', path: '/servicios/repse', keywords: 'repse subcontratacion especializada stps' },
    { title: 'Administración de nómina', path: '/servicios/administracion-de-nomina', keywords: 'nomina empleados recursos humanos rrhh recibos' },
    { title: 'Contabilidad', path: '/servicios/contabilidad', keywords: 'contabilidad contadores registros financieros' },
    { title: 'Asesoría en planificación fiscal', path: '/servicios/asesoria-en-planificacion-fiscal', keywords: 'asesoria planificación fiscal' },
    { title: 'Cumplimiento tributario', path: '/servicios/cumplimiento-tributario-servicio', keywords: 'cumplimiento tributario sat obligaciones' },
    { title: 'Cumplimiento en seguridad social', path: '/servicios/cumplimiento-en-seguridad-social', keywords: 'seguridad social imss infonavit' },
    { title: 'Consultoría financiera', path: '/servicios/consultoria-financiera', keywords: 'consultoría financiera finanzas negocios' },
    { title: 'Auditoría financiera', path: '/servicios/auditoria-financiera', keywords: 'auditoría financiera estados financieros' },
    { title: 'Asesoría contable', path: '/servicios/asesoria-contable', keywords: 'asesoría contable contadores' },
    { title: 'Facturación', path: '/servicios/facturacion', keywords: 'facturación cfdi facturas ingresos' },
    { title: 'Capacitación', path: '/servicios/capacitacion', keywords: 'capacitación cursos talleres entrenamiento' },
    { title: 'LFPIORPI (Antilavado)', path: '/servicios/lfpiorpi', keywords: 'lfpiorpi antilavado prevencion lavado dinero' },
    { title: 'Artículos y Blog', path: '/articulos', keywords: 'blog articulos noticias novedades' },
    { title: 'Contacto', path: '/contacto', keywords: 'contacto telefono correo mensaje ubicación formulario' },
];

const Navbar = () => {
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            const results = searchIndex.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) || 
                item.keywords.toLowerCase().includes(query.toLowerCase())
            );
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
        <nav className={`text-white sticky top-0 z-50 border-b transition-all duration-300 px-6 md:px-12 ${isScrolled ? 'bg-[#233657]/95 backdrop-blur-2xl border-white/10 py-2 shadow-2xl' : 'bg-[#233657] border-white/5 py-4'}`}>
            <div className="flex items-center justify-between max-w-[1920px] mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`relative group flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'h-10' : 'h-14'}`}
                    >
                        {/* Main Logo - Shown as is for maximum quality */}
                        <img
                            src={accrualLogo}
                            alt="Accrual Logo"
                            className="h-full w-auto object-contain transition-all duration-300"
                        />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden lg:flex relative items-center !bg-white/10 rounded-full px-4 h-11 w-1/3 max-w-xl mx-8 shadow-inner border border-white/10 z-50">
                    <input
                        type="text"
                        placeholder="¿Cómo podemos ayudarte?"
                        className="bg-transparent border-none outline-none w-full h-full text-white placeholder-white/50 font-medium"
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                    <Search className="w-5 h-5 text-white" />

                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#233657]/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 border border-white/10 z-[60] overflow-hidden">
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-4 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/5 mb-1">
                                        Sugerencias
                                    </div>
                                    {searchResults.map((result, idx) => (
                                        <Link
                                            key={idx}
                                            to={result.path}
                                            className="flex items-center px-4 py-3 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setIsSearchFocused(false);
                                            }}
                                        >
                                            <Search className="w-4 h-4 mr-3 opacity-50" />
                                            <span className="text-sm font-medium">{result.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-center text-[#D0D0DA] text-sm flex flex-col items-center justify-center gap-2">
                                    <Search className="w-6 h-6 opacity-30" />
                                    <span>No encontramos resultados para "<span className="text-white font-medium">{searchQuery}</span>"</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
                    <Link to="/" className="text-[#D0D0DA] hover:text-white transition-colors nav-link flex items-center h-11">INICIO</Link>
                    <Link to="/quienes-somos" className="text-[#D0D0DA] hover:text-white transition-colors whitespace-nowrap nav-link flex items-center h-11">QUIÉNES SOMOS</Link>

                    {/* Services Dropdown */}
                    <div className="relative group services-dropdown flex items-center h-11">
                        <div className="flex items-center gap-1">
                            <Link
                                to="/servicios"
                                className="text-[#D0D0DA] hover:text-white transition-colors uppercase nav-link flex items-center h-11"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                SERVICIOS
                            </Link>
                            <button
                                className="text-[#D0D0DA] hover:text-white p-1 flex items-center transition-all duration-300 hover:-translate-y-[2px]"
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
                            className={`absolute top-full left-0 mt-2 w-72 bg-[#233657]/95 backdrop-blur-xl rounded-lg shadow-2xl py-2 transition-all duration-200 border border-white/10 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                        >
                            <Link to="/servicios/consultoria" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">Consultoria</Link>
                            <Link to="/servicios/planificacion-fiscal-avanzada" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">Planificación fiscal avanzada</Link>
                            <Link to="/servicios/declaracion-de-impuestos" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">Declaración de impuestos</Link>
                            <Link to="/servicios/imss-e-infonavit" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">IMSS e Infonavit</Link>
                            <Link to="/servicios/repse" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">REPSE</Link>
                            <Link to="/servicios/administracion-de-nomina" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">Administración de nómina</Link>
                            <Link to="/servicios/contabilidad" className="block px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">Contabilidad</Link>

                            {/* Nested Menu for Ver más */}
                            <div className="group/nested relative">
                                <button className="w-full flex items-center justify-between px-6 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap text-sm">
                                    <span>Ver más</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                {/* Nested Content */}
                                <div className="absolute top-0 right-full mt-0 w-[500px] bg-[#233657]/95 backdrop-blur-xl rounded-lg shadow-2xl p-4 transition-all duration-200 border border-white/10 opacity-0 invisible translate-x-2 group-hover/nested:opacity-100 group-hover/nested:visible group-hover/nested:translate-x-0 grid grid-cols-2 gap-x-4">
                                    <Link to="/servicios/asesoria-en-planificacion-fiscal" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Asesoría en planificación fiscal</Link>
                                    <Link to="/servicios/cumplimiento-tributario-servicio" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm max-w-[140px]">Cumplimiento tributario</Link>
                                    <Link to="/servicios/cumplimiento-en-seguridad-social" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Cumplimiento en seguridad social</Link>
                                    <Link to="/servicios/consultoria-financiera" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm max-w-[140px]">Consultoría financiera</Link>
                                    <Link to="/servicios/auditoria-financiera" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Auditoría financiera</Link>
                                    <Link to="/servicios/asesoria-contable" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Asesoría contable</Link>
                                    <Link to="/servicios/facturacion" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Facturación</Link>
                                    <Link to="/servicios/capacitacion" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">Capacitación</Link>
                                    <Link to="/servicios/lfpiorpi" className="block px-4 py-2 text-[#D0D0DA] hover:bg-white/10 hover:text-white rounded transition-colors text-sm">LFPIORPI</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to="/articulos" className="text-[#D0D0DA] hover:text-white transition-colors nav-link flex items-center h-11">ARTÍCULOS</Link>
                    <a href="#" className="text-[#D0D0DA] hover:text-white transition-colors nav-link flex items-center h-11">RECURSOS</a>
                    <Link to="/contacto" className="!bg-[#D0D0DA] !text-[#233657] px-8 h-11 rounded-full font-black hover:!bg-white hover:!scale-105 transition-all transform shadow-2xl flex items-center justify-center">
                        CONTACTO
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                    <Link to="/" className="text-[#D0D0DA] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>INICIO</Link>
                    <Link to="/quienes-somos" className="text-[#D0D0DA] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>QUIÉNES SOMOS</Link>
                    <Link to="/cumplimiento-tributario" className="text-[#D0D0DA] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>SERVICIOS</Link>
                    <Link to="/articulos" className="text-[#D0D0DA] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ARTÍCULOS</Link>
                    <Link to="/contacto" className="text-[#D0D0DA] hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTACTO</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
