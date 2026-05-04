import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

const About = () => {
    const { getNodeData } = useSiteData();
    const data = getNodeData('quienes-somos') || {};

    return (
        <section className="bg-[#D0D0DA] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 
                    className="text-4xl md:text-5xl font-black text-center text-[#233657] mb-16 uppercase"
                    dangerouslySetInnerHTML={{ __html: data.aboutMainTitle || '¿Quiénes <br /> Somos?' }}
                />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 text-[#233657]">
                        <h3 
                            className="text-3xl font-bold mb-4 uppercase text-[#0F4C82]"
                            dangerouslySetInnerHTML={{ __html: data.aboutSubtitle1 || 'Nuestra Historia' }}
                        />

                        <p 
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.aboutText1 || 'Fundada en 2015 Accrual se ha dedicado a fortalecer a sus socios de negocios mediante servicios de vanguardia, profesionalismo y veracidad.' }}
                        />

                        <h3 
                            className="text-3xl font-bold mt-8 mb-4 uppercase text-[#0F4C82]"
                            dangerouslySetInnerHTML={{ __html: data.aboutSubtitle2 || 'Visión' }}
                        />
                        <p 
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.aboutText2 || 'Con la visión de ser líderes en ofrecer servicios financieros y fiscales a nivel nacional e internacional, ofrecemos soluciones innovadoras en planeacion, diseño, capacitacion y consultoría fiscal, contable y financiera.' }}
                        />

                        <h3 
                            className="text-3xl font-bold mt-8 mb-4 uppercase text-[#0F4C82]"
                            dangerouslySetInnerHTML={{ __html: data.aboutSubtitle3 || 'Misión' }}
                        />
                        <p 
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.aboutText3 || 'Nuestra misión es impulsar el éxito y la eficiencia de nuestros clientes, fortaleciendo los pilares financieros. A través de nuestra trayectoria, hemos logrado demostrar nuestro compromiso con la excelencia con el maximo profesionalismo.' }}
                        />

                        <Link to="/servicios">
                            <button 
                                className="mt-8 bg-[#233657]/10 hover:bg-[#0F4C82] text-[#233657] hover:text-[#D0D0DA] font-bold py-3 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105 shadow-md backdrop-blur-xl border border-[#233657]/20"
                                dangerouslySetInnerHTML={{ __html: data.aboutBtn || 'Conoce nuestros servicios' }}
                            />
                        </Link>
                    </div>

                    {/* Image Placeholder */}
                    <div className="bg-[#233657] rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl relative">
                        <img loading="lazy" src={data.aboutImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Office" className="absolute inset-0 w-full h-full object-cover animate-subtle-zoom transform" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
