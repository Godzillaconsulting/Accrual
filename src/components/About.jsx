import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const About = () => {
    return (
        <section className="bg-[#D0D0DA] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center text-[#233657] mb-16 uppercase">
                    ¿Quiénes <br /> Somos?
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 text-[#233657]">
                        <h3 className="text-3xl font-bold mb-4 uppercase text-[#0F4C82]">Nuestra Historia</h3>

                        <p className="leading-relaxed">
                            Fundada en 2015 Accrual se ha dedicado a fortalecer a sus socios de negocios
                            mediante servicios de vanguardia, profesionalismo y veracidad.
                        </p>

                        <p className="leading-relaxed">
                            Con la visión de ser líderes en ofrecer servicios financieros y fiscales a nivel nacional
                            e internacional, ofrecemos soluciones innovadoras en planeacion, diseño,
                            capacitacion y consultoría fiscal, contable y financiera.
                        </p>

                        <p className="leading-relaxed">
                            Nuestra misión es impulsar el éxito y la eficiencia de nuestros clientes, fortaleciendo
                            los pilares financieros. A través de nuestra trayectoria, hemos logrado demostrar
                            nuestro compromiso con la excelencia con el maximo profesionalismo.
                        </p>

                        <button className="mt-8 bg-[#233657]/10 hover:bg-[#0F4C82] text-[#233657] hover:text-[#D0D0DA] font-bold py-3 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105 shadow-md backdrop-blur-xl border border-[#233657]/20">
                            Conoce nuestros servicios
                        </button>
                    </div>

                    {/* Image Placeholder */}
                    <div className="bg-[#233657] rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Office" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
