import React from 'react';
import { Facebook, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import accrualLogo from '../assets/Accrual logo.png';
import whatsappLogoFooter from '../assets/WhatsApp (white).png';
import phoneIcon from '../assets/icons8-phone-number-100.png';
import emailIcon from '../assets/icons8-email-100.png';
import mapsIcon from '../assets/Maps.png';

const Footer = () => {
    return (
        <footer className="bg-[#47544b] text-[#e0e0e0] pt-20 pb-10 px-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-sm">

                {/* Col 1: Logo & Newsletter */}
                <div className="flex flex-col items-start gap-6">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="h-16 flex items-center justify-center">
                            <img src={accrualLogo} alt="Accrual Logo" className="h-full w-auto object-contain cursor-pointer" />
                        </Link>
                    </div>

                    <div className="w-full max-w-xs">
                        <div className="flex bg-[#e0e0e0] rounded-md overflow-hidden">
                            <input
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                className="px-4 py-2 text-gray-800 w-full text-xs outline-none italic"
                            />
                            <button className="bg-black text-[#e0e0e0] px-4 py-2 text-xs font-bold uppercase hover:bg-[#2d3830] transition-colors">
                                Suscribirse
                            </button>
                        </div>
                        <p className="text-[10px] mt-2 italic opacity-70">Puedes desuscribirte en cualquier momento.</p>
                    </div>
                </div>

                {/* Col 2: Servicios */}
                <div>
                    <h4 className="font-bold mb-6 uppercase text-[#e0e0e0] tracking-widest text-base">SERVICIOS</h4>
                    <ul className="space-y-4 opacity-80 font-light text-gray-300">
                        <li><Link to="/cumplimiento-tributario" className="hover:text-[#2d3830] transition-colors">Cumplimiento tributario</Link></li>
                        <li><a href="#" className="hover:text-[#2d3830] transition-colors">Planeación patrimonial</a></li>
                        <li><a href="#" className="hover:text-[#2d3830] transition-colors">Precios de transferencia</a></li>
                        <li><a href="#" className="hover:text-[#2d3830] transition-colors">Contabilidad RESICO</a></li>
                    </ul>
                </div>

                {/* Col 3: Empresa (Split into 2 columns) */}
                <div>
                    <h4 className="font-bold mb-6 uppercase text-[#e0e0e0] tracking-widest text-base">EMPRESA</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <ul className="space-y-4 opacity-80 font-light text-gray-300">
                            <li><Link to="/" className="hover:text-[#2d3830] transition-colors">Inicio</Link></li>
                            <li><Link to="/quienes-somos" className="hover:text-[#2d3830] transition-colors">Quiénes somos</Link></li>
                            <li><a href="#" className="hover:text-[#2d3830] transition-colors">Servicios</a></li>
                        </ul>
                        <ul className="space-y-4 opacity-80 font-light text-gray-300">
                            <li><a href="#" className="hover:text-[#2d3830] transition-colors">Recursos</a></li>
                            <li><Link to="/contacto" className="hover:text-[#2d3830] transition-colors">Contacto</Link></li>
                            <li><a href="#" className="hover:text-[#2d3830] transition-colors">Blog</a></li>
                        </ul>
                    </div>
                </div>

                {/* Col 4: Contacto */}
                <div>
                    <h4 className="font-bold mb-6 uppercase text-[#e0e0e0] tracking-widest text-base">CONTACTO</h4>
                    <ul className="space-y-4 opacity-80 font-light">
                        <li>
                            <a href="https://wa.me/526563049604" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#2d3830] transition-colors">
                                <img src={phoneIcon} alt="Phone" className="w-5 h-5 object-contain filter invert" />
                                <span>+52 656 304 9604</span>
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <img src={emailIcon} alt="Email" className="w-5 h-5 object-contain filter invert" />
                            <a href="mailto:contacto@accrual.com.mx" className="hover:text-[#2d3830] transition-colors">contacto@accrual.com.mx</a>
                        </li>
                        <li>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Parcelas+Ejido+Zaragoza%2C+32599+Ju%C3%A1rez%2C+Chih."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 leading-relaxed hover:text-[#2d3830] transition-colors"
                            >
                                <img src={mapsIcon} alt="Location" className="w-5 h-5 object-contain mt-1" />
                                <span>
                                    Parcelas Ejido Zaragoza, 32599<br />
                                    Juárez, Chih.
                                </span>
                            </a>
                        </li>
                        <li className="flex gap-4 pt-4">
                            <a href="https://www.instagram.com/accrual.accounting?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-6 h-6 cursor-pointer hover:text-[#2d3830] transition-colors" />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61572307195995" target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-6 h-6 cursor-pointer hover:text-[#2d3830] transition-colors" />
                            </a>
                            <a href="https://wa.me/526563049604" target="_blank" rel="noopener noreferrer">
                                <img src={whatsappLogoFooter} alt="WhatsApp" className="w-6 h-6 object-contain cursor-pointer hover:opacity-80 transition-opacity" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Legal */}
            <div className="border-t border-[#e0e0e0]/20 pt-8 flex flex-col items-center gap-4 opacity-60">
                <div className="flex flex-col md:flex-row justify-center gap-8 text-[10px] font-bold tracking-widest uppercase">
                    <Link to="/aviso-de-privacidad" className="hover:text-[#e0e0e0] transition-colors">AVISO DE PRIVACIDAD</Link>
                    <span className="hidden md:inline">|</span>
                    <Link to="/terminos-y-condiciones" className="hover:text-[#e0e0e0] transition-colors">TÉRMINOS Y CONDICIONES</Link>
                    <span className="hidden md:inline">|</span>
                    <a href="#" className="hover:text-[#e0e0e0] transition-colors">POLÍTICA DE COOKIES</a>
                </div>
                <p className="text-[10px] tracking-widest">Copyright © 2026 Todos los derechos reservados</p>
            </div>
        </footer>
    );
};

export default Footer;
