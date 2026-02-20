import React from 'react';
import { Search, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import accrualLogo from '../assets/logo-completo.svg';
import logoBlue from '../assets/logo-completo-azul.svg';

const Navbar = () => {
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);


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
        <nav className={`text-[#233657] sticky top-0 z-50 border-b transition-all duration-300 px-6 md:px-12 ${isScrolled ? 'bg-[#D0D0DA]/90 backdrop-blur-2xl border-[#233657]/10 py-2 shadow-xl' : 'bg-[#D0D0DA] border-[#233657]/5 py-4'}`}>
            <div className="flex items-center justify-between max-w-[1920px] mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className={`relative group flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'h-6' : 'h-8'}`}
                    >
                        {/* Default Logo (Inverted to Black) - Controls Width */}
                        <img
                            src={accrualLogo}
                            alt="Accrual Logo"
                            className="h-full w-auto object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                            style={{ filter: 'invert(1)' }}
                        />
                        {/* Hover Logo (Blue via Filter) - Absolute Overlay */}
                        <img
                            src={accrualLogo}
                            alt="Accrual Logo Hover"
                            className="absolute top-0 left-0 h-full w-auto object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            style={{ filter: 'invert(24%) sepia(87%) saturate(1915%) hue-rotate(195deg) brightness(96%) contrast(92%)' }}
                        />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden lg:flex items-center !bg-white rounded-full px-4 py-2 w-1/3 max-w-xl mx-8 shadow-inner border border-[#233657]/5">
                    <input
                        type="text"
                        placeholder="¿Cómo podemos ayudarte?"
                        className="bg-transparent border-none outline-none w-full text-[#233657] placeholder-gray-400 font-medium"
                    />
                    <Search className="w-5 h-5 text-[#233657]" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
                    <Link to="/" className="hover:text-[#0F4C82] transition-colors">INICIO</Link>
                    <Link to="/quienes-somos" className="hover:text-[#0F4C82] transition-colors whitespace-nowrap">QUIÉNES SOMOS</Link>

                    {/* Services Dropdown */}
                    <div className="relative group services-dropdown">
                        <button
                            className="flex items-center gap-1 hover:text-[#0F4C82] transition-colors uppercase"
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                        >
                            SERVICIOS
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Dropdown Menu */}
                        <div
                            onClick={(e) => {
                                if (e.target.tagName === 'A' || e.target.closest('a')) {
                                    setIsServicesOpen(false);
                                }
                            }}
                            className={`absolute top-full left-0 mt-2 w-72 bg-[#D0D0DA]/95 backdrop-blur-xl rounded-lg shadow-xl py-2 transition-all duration-200 border border-[#233657]/10 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                        >
                            <Link to="/servicios/consultoria" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">Consultoria</Link>
                            <Link to="/servicios/planificacion-fiscal-avanzada" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">Planificación fiscal avanzada</Link>
                            <Link to="/servicios/declaracion-de-impuestos" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">Declaración de impuestos</Link>
                            <Link to="/servicios/imss-e-infonavit" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">IMSS e Infonavit</Link>
                            <Link to="/servicios/repse" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">REPSE</Link>
                            <Link to="/servicios/administracion-de-nomina" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">Administración de nómina</Link>
                            <Link to="/servicios/contabilidad" className="block px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">Contabilidad</Link>

                            {/* Nested Menu for Ver más */}
                            <div className="group/nested relative">
                                <button className="w-full flex items-center justify-between px-6 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] transition-colors whitespace-nowrap text-sm">
                                    <span>Ver más</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                {/* Nested Content */}
                                <div className="absolute top-0 right-full mt-0 w-[500px] bg-[#D0D0DA]/95 backdrop-blur-xl rounded-lg shadow-xl p-4 transition-all duration-200 border border-[#233657]/10 opacity-0 invisible translate-x-2 group-hover/nested:opacity-100 group-hover/nested:visible group-hover/nested:translate-x-0 grid grid-cols-2 gap-x-4">
                                    <Link to="/servicios/asesoria-en-planificacion-fiscal" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Asesoría en planificación fiscal</Link>
                                    <Link to="/servicios/cumplimiento-tributario-servicio" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm max-w-[140px]">Cumplimiento tributario</Link>
                                    <Link to="/servicios/cumplimiento-en-seguridad-social" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Cumplimiento en seguridad social</Link>
                                    <Link to="/servicios/consultoria-financiera" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm max-w-[140px]">Consultoría financiera</Link>
                                    <Link to="/servicios/auditoria-financiera" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Auditoría financiera</Link>
                                    <Link to="/servicios/asesoria-contable" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Asesoría contable</Link>
                                    <Link to="/servicios/facturacion" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Facturación</Link>
                                    <Link to="/servicios/capacitacion" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">Capacitación</Link>
                                    <Link to="/servicios/lfpiorpi" className="block px-4 py-2 text-[#233657] hover:bg-[#233657] hover:text-[#D0D0DA] rounded transition-colors text-sm">LFPIORPI</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to="/articulos" className="hover:text-[#0F4C82] transition-colors">ARTÍCULOS</Link>
                    <a href="#" className="hover:text-[#0F4C82] transition-colors">RECURSOS</a>
                    <Link to="/contacto" className="!bg-[#233657] !text-[#D0D0DA] px-8 py-3 rounded-full font-black hover:!bg-[#0F4C82] hover:!text-[#D0D0DA] transition-all transform hover:scale-105 shadow-2xl block">
                        CONTACTO
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-[#233657]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-[#233657]/10 pt-4">
                    <Link to="/" className="hover:text-[#0F4C82] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>INICIO</Link>
                    <Link to="/quienes-somos" className="hover:text-[#0F4C82] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>QUIÉNES SOMOS</Link>
                    <Link to="/cumplimiento-tributario" className="hover:text-[#0F4C82] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>SERVICIOS</Link>
                    <Link to="/articulos" className="hover:text-[#0F4C82] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ARTÍCULOS</Link>
                    <Link to="/contacto" className="hover:text-[#0F4C82] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTACTO</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
