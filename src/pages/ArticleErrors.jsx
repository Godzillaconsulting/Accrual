import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { Clock, AlertTriangle, FileText, CheckCircle, ArrowRight } from 'lucide-react';

const ArticleErrors = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#233657]">
            <Navbar />

            <main>
                {/* Header Section (Wireframe Style) */}
                <section className="bg-[#4B5563] text-white py-24 px-6 font-sans">
                    <div className="max-w-4xl mx-auto text-left">
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-tight">
                            Errores Comunes en la <br className="hidden md:block" /> Declaración de Impuestos y <br className="hidden md:block" /> Cómo Evitarlos
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl font-light">
                            Este artículo aborda los fallos frecuentes que las empresas cometen al presentar su declaración de impuestos. Además, ofrece consejos prácticos y medidas preventivas para asegurarse de que su declaración esté libre de errores.
                        </p>
                    </div>
                </section>

                <article className="max-w-4xl mx-auto px-6 py-16">

                    {/* Intro text */}
                    <div className="prose prose-lg max-w-none text-[#233657]/80 leading-relaxed mb-12">
                        <p className="mb-8 text-xl font-medium">
                            La declaración de impuestos puede ser un proceso complicado y estresante, especialmente si no estás completamente familiarizado con las reglas fiscales. Sin embargo, cometer errores puede resultar en multas, intereses o incluso una auditoría. A continuación, te enumeramos los errores más comunes:
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-lg mb-16">
                        <img
                            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                            alt="Análisis de documentos fiscales"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Sections - Clean Editorial Style */}
                    <div className="space-y-16">

                        {/* Error 1 */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                NO REPORTAR TODOS LOS INGRESOS
                            </h2>
                            <p className="text-lg opacity-80 leading-relaxed mb-4">
                                Algunas personas olvidan reportar ciertos ingresos, como ingresos de trabajos secundarios, ventas de bienes personales, intereses bancarios, o ingresos por freelance.
                            </p>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-bold mb-2">¿Cómo evitarlo?</h3>
                                <p className="opacity-80">Mantén un registro de tus ingresos adicionales: Si trabajas de manera independiente lleva un control detallado de todas las fuentes de ingresos.</p>
                            </div>
                        </div>

                        {/* Error 2 */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                NO PRESENTAR A TIEMPO O NO PAGAR A TIEMPO
                            </h2>
                            <p className="text-lg opacity-80 leading-relaxed mb-4">
                                Presentar tu declaración de impuestos tarde o no pagar el monto que debes puede resultar en multas e intereses, o bien hasta puedes ser sujeto a una auditoría fiscal; presentar a tiempo es crucial.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-bold mb-2">Utiliza recordatorios</h3>
                                <p className="opacity-80">Configura alertas para la fecha límite de presentación o utiliza un sistema que te ayude a recordar cuándo debes presentar tu declaración.</p>
                            </div>
                        </div>

                        {/* Error 3 */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                ERRORES EN EL CÁLCULO DE DEDUCCIONES
                            </h2>
                            <p className="text-lg opacity-80 leading-relaxed mb-4">
                                Muchos contribuyentes pierden oportunidades de deducir gastos al no aprovechar deducciones y estímulos fiscales, o al aplicar deducciones incorrectas.
                            </p>
                            <div className="pl-6 space-y-4">
                                <ul className="list-disc space-y-2 text-lg opacity-80 marker:text-[#0F4C82]">
                                    <li><strong>Infórmate sobre las deducciones disponibles:</strong> Asegúrate de conocer todas las deducciones y estímulos fiscales a los que puedes acceder.</li>
                                    <li><strong>Verifica los límites y requisitos:</strong> Algunas deducciones tienen límites específicos. Revisa bien las reglas.</li>
                                </ul>
                            </div>
                        </div>

                        {/* General Advice */}
                        <div className="pt-8 border-t border-gray-200">
                            <h2 className="text-3xl font-bold mb-8">
                                CONSEJOS GENERALES PARA EVITAR ERRORES
                            </h2>
                            <ul className="space-y-6">
                                <li className="flex gap-4 items-start">
                                    <span className="w-2 h-2 mt-2.5 bg-[#0F4C82] rounded-full shrink-0"></span>
                                    <div>
                                        <strong className="block text-xl mb-1">Mantén tus documentos organizados</strong>
                                        <span className="opacity-70">Tener todos los recibos, formularios y registros organizados te ayudará a evitar olvidos y errores.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-2 h-2 mt-2.5 bg-[#0F4C82] rounded-full shrink-0"></span>
                                    <div>
                                        <strong className="block text-xl mb-1">Consulta con un profesional</strong>
                                        <span className="opacity-70">Si tu situación fiscal es compleja, o si simplemente no estás seguro, contratar a un asesor fiscal puede ser una buena inversión.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-2 h-2 mt-2.5 bg-[#0F4C82] rounded-full shrink-0"></span>
                                    <div>
                                        <strong className="block text-xl mb-1">Revisa antes de enviar</strong>
                                        <span className="opacity-70">Un simple error tipográfico o de cálculo puede costarte dinero. Tómate el tiempo para revisar y verificar la declaración.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-2 h-2 mt-2.5 bg-[#0F4C82] rounded-full shrink-0"></span>
                                    <div>
                                        <strong className="block text-xl mb-1">Usa software de contabilidad</strong>
                                        <span className="opacity-70">Muchos programas de software pueden ayudarte a evitar errores automatizando cálculos y validaciones.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </article>

                {/* Related Articles Section */}
                <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
                    <h3 className="text-3xl font-black uppercase text-[#233657] mb-12">
                        Continúa Leyendo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Article 2 */}
                        <div className="relative group cursor-pointer">
                            <div className="h-64 rounded-3xl overflow-hidden mb-6 shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Beneficios de contratar un asesor fiscal profesional"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h4 className="text-xl font-bold text-[#233657] mb-4 group-hover:text-[#0F4C82] transition-colors">
                                Beneficios de contratar un asesor fiscal profesional
                            </h4>
                            <Link to="/articulos" className="inline-flex items-center text-[#0F4C82] font-bold hover:underline">
                                Leer artículo <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        {/* Article 3 */}
                        <div className="relative group cursor-pointer">
                            <div className="h-64 rounded-3xl overflow-hidden mb-6 shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Beneficios del compliance fiscal"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h4 className="text-xl font-bold text-[#233657] mb-4 group-hover:text-[#0F4C82] transition-colors">
                                Beneficios del compliance fiscal
                            </h4>
                            <Link to="/articulos" className="inline-flex items-center text-[#0F4C82] font-bold hover:underline">
                                Leer artículo <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        {/* Article 4 */}
                        <div className="relative group cursor-pointer">
                            <div className="h-64 rounded-3xl overflow-hidden mb-6 shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Importancia del presupuesto para la toma de decisiones"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h4 className="text-xl font-bold text-[#233657] mb-4 group-hover:text-[#0F4C82] transition-colors">
                                Importancia del presupuesto para la toma de decisiones
                            </h4>
                            <Link to="/articulos" className="inline-flex items-center text-[#0F4C82] font-bold hover:underline">
                                Leer artículo <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default ArticleErrors;
