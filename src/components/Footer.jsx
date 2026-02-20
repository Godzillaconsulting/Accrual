import React from 'react';
import { Facebook, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import accrualSymbol from '../assets/simbolo.svg';
import whatsappLogoFooter from '../assets/WhatsApp (white).png';
import phoneIcon from '../assets/icons8-phone-number-100.png';
import emailIcon from '../assets/icons8-email-100.png';
import mapsIcon from '../assets/Maps.png';
import footerBg from '../assets/young-family-countryside-enjoying-nature.jpg';

const Footer = () => {
    const [isLogoHovered, setIsLogoHovered] = React.useState(false);

    return (
        <footer
            className="relative text-[#D0D0DA] pt-20 pb-10 px-8 font-sans bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${footerBg})` }}
        >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-[#233657]/85"></div>

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-20 text-sm">

                    {/* Col 1: Contacto (Moved from Right) */}
                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[#D0D0DA] tracking-widest text-base">CONTACTO</h4>
                        <ul className="space-y-4 opacity-80 font-light">
                            <li>
                                <a href="https://wa.me/526563049604" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0F4C82] transition-colors">
                                    <img src={phoneIcon} alt="Phone" className="w-5 h-5 object-contain filter invert" />
                                    <span>+52 656 304 9604</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <img src={emailIcon} alt="Email" className="w-5 h-5 object-contain filter invert" />
                                <a href="mailto:contacto@accrual.com.mx" className="hover:text-[#0F4C82] transition-colors">contacto@accrual.com.mx</a>
                            </li>
                            <li>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Calle+Minerva+1174.+Col.+Olimpia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 leading-relaxed hover:text-[#0F4C82] transition-colors"
                                >
                                    <img src={mapsIcon} alt="Location" className="w-5 h-5 object-contain" />
                                    <span>Calle Minerva 1174. Col. Olimpia</span>
                                </a>
                            </li>
                            <li className="flex gap-4 pt-4">
                                <a href="https://www.instagram.com/accrual.accounting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                                    <Instagram className="w-6 h-6 cursor-pointer hover:text-[#0F4C82] transition-colors" />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61572307195995" target="_blank" rel="noopener noreferrer">
                                    <Facebook className="w-6 h-6 cursor-pointer hover:text-[#0F4C82] transition-colors" />
                                </a>
                                <a href="https://wa.me/526563049604" target="_blank" rel="noopener noreferrer">
                                    <img src={whatsappLogoFooter} alt="WhatsApp" className="w-6 h-6 object-contain cursor-pointer hover:brightness-0 hover:invert-[0.2] transition-all duration-300" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Servicios */}
                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[#D0D0DA] tracking-widest text-base">SERVICIOS</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 opacity-80 font-light text-gray-300">
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">Consultoria</a>
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">Planificación fiscal avanzada</a>
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">Declaración de impuestos</a>
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">IMSS e Infonavit</a>
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">REPSE</a>
                            <a href="#" className="hover:text-[#0F4C82] transition-colors">Administración de nómina</a>
                            <Link to="/cumplimiento-tributario" className="hover:text-[#0F4C82] transition-colors">Contabilidad</Link>
                        </div>
                    </div>

                    {/* Col 3: Empresa (Split into 2 columns) */}
                    <div>
                        <h4 className="font-bold mb-6 uppercase text-[#D0D0DA] tracking-widest text-base">EMPRESA</h4>
                        <div className="grid grid-cols-2 gap-12">
                            <ul className="space-y-4 opacity-80 font-light text-gray-300">
                                <li><Link to="/" className="hover:text-[#0F4C82] transition-colors">Inicio</Link></li>
                                <li><Link to="/quienes-somos" className="hover:text-[#0F4C82] transition-colors">Quiénes somos</Link></li>
                                <li><a href="#" className="hover:text-[#0F4C82] transition-colors">Servicios</a></li>
                            </ul>
                            <ul className="space-y-4 opacity-80 font-light text-gray-300">
                                <li><Link to="/articulos" className="hover:text-[#0F4C82] transition-colors">Artículos</Link></li>
                                <li><a href="#" className="hover:text-[#0F4C82] transition-colors">Recursos</a></li>
                                <li><Link to="/contacto" className="hover:text-[#0F4C82] transition-colors">Contacto</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Col 4: Logo & Newsletter (Moved from Left) */}
                    <div className="flex flex-col items-center md:items-center gap-6">
                        <div className="w-full max-w-xs flex justify-center">
                            <Link
                                to="/"
                                className="relative h-16 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                                onMouseEnter={() => setIsLogoHovered(true)}
                                onMouseLeave={() => setIsLogoHovered(false)}
                            >
                                {/* Default Symbol (White) */}
                                <img
                                    src={accrualSymbol}
                                    alt="Accrual Symbol"
                                    className={`h-full w-auto object-contain transition-opacity duration-300 ${isLogoHovered ? 'opacity-0' : 'opacity-100'}`}
                                />
                                {/* Hover Symbol (Blue via Filter) - Absolute Overlay */}
                                <img
                                    src={accrualSymbol}
                                    alt="Accrual Symbol Blue"
                                    className={`absolute top-0 left-0 h-full w-auto object-contain transition-opacity duration-300 ${isLogoHovered ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ filter: 'invert(24%) sepia(87%) saturate(1915%) hue-rotate(195deg) brightness(96%) contrast(92%)' }}
                                />
                            </Link>
                        </div>


                    </div>
                </div>

                {/* Bottom Legal */}
                <div className="border-t border-[#D0D0DA]/20 pt-8 flex flex-col items-center gap-4 text-[#D0D0DA]">
                    <div className="flex flex-col md:flex-row justify-center gap-8 text-[10px] font-bold tracking-widest uppercase">
                        <Link to="/aviso-de-privacidad" className="hover:text-[#0F4C82] transition-colors">AVISO DE PRIVACIDAD</Link>
                        <span className="hidden md:inline">|</span>
                        <Link to="/terminos-y-condiciones" className="hover:text-[#0F4C82] transition-colors">TÉRMINOS Y CONDICIONES</Link>
                        <span className="hidden md:inline">|</span>
                        <a href="#" className="hover:text-[#0F4C82] transition-colors">POLÍTICA DE COOKIES</a>
                    </div>
                    <p className="text-[10px] tracking-widest opacity-60">Copyright © 2026 Todos los derechos reservados</p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
