import React from 'react';
import { Search, Menu, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import accrualLogo from '../assets/Accrual logo.png';

const Navbar = () => {
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <nav className="bg-[#47544b]/90 backdrop-blur-xl text-[#e0e0e0] px-8 py-4 sticky top-0 z-50 border-b border-[#e0e0e0]/5">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="h-16 flex items-center justify-center">
                        <img src={accrualLogo} alt="Accrual Logo" className="h-full w-auto object-contain cursor-pointer" />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="hidden lg:flex items-center !bg-[#e0e0e0] rounded-full px-4 py-2 w-1/3 max-w-xl mx-8 shadow-inner">
                    <input
                        type="text"
                        placeholder="¿Cómo podemos ayudarte?"
                        className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-500 font-medium"
                    />
                    <Search className="w-5 h-5 text-[#47544b]" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
                    <Link to="/" className="hover:text-[#2d3830] transition-colors">INICIO</Link>
                    <Link to="/quienes-somos" className="hover:text-[#2d3830] transition-colors whitespace-nowrap">QUIÉNES SOMOS</Link>

                    {/* Services Dropdown */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 hover:text-[#2d3830] transition-colors uppercase"
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                            onBlur={() => setTimeout(() => setIsServicesOpen(false), 200)}
                        >
                            SERVICIOS
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Dropdown Menu */}
                        <div className={`absolute top-full left-0 mt-2 w-64 bg-[#e0e0e0]/90 backdrop-blur-xl rounded-lg shadow-xl py-2 transition-all duration-200 border border-[#e0e0e0]/20 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <Link to="/cumplimiento-tributario" className="block px-4 py-2 text-[#47544b] hover:bg-[#47544b] hover:text-[#e0e0e0] transition-colors">Cumplimiento Tributario</Link>
                            <a href="#" className="block px-4 py-2 text-[#47544b] hover:bg-[#47544b] hover:text-[#e0e0e0] transition-colors">Planeación patrimonial</a>
                            <a href="#" className="block px-4 py-2 text-[#47544b] hover:bg-[#47544b] hover:text-[#e0e0e0] transition-colors">Precios de transferencia</a>
                            <a href="#" className="block px-4 py-2 text-[#47544b] hover:bg-[#47544b] hover:text-[#e0e0e0] transition-colors">Contabilidad RESICO</a>
                        </div>
                    </div>

                    <a href="#" className="hover:text-[#2d3830] transition-colors">BLOG</a>
                    <a href="#" className="hover:text-[#2d3830] transition-colors">RECURSOS</a>
                    <Link to="/contacto" className="!bg-[#e0e0e0] !text-[#47544b] px-8 py-3 rounded-full font-black hover:!bg-[#2d3830] hover:!text-[#e0e0e0] transition-all transform hover:scale-105 shadow-2xl block">
                        CONTACTO
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-[#e0e0e0]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-[#e0e0e0]/10 pt-4">
                    <Link to="/" className="hover:text-[#2d3830] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>INICIO</Link>
                    <Link to="/quienes-somos" className="hover:text-[#2d3830] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>QUIÉNES SOMOS</Link>
                    <Link to="/cumplimiento-tributario" className="hover:text-[#2d3830] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>SERVICIOS</Link>
                    <Link to="/contacto" className="hover:text-[#2d3830] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTACTO</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
