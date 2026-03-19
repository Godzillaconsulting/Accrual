import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const CookiesPolicy = () => {
    return (
        <div className="font-sans antialiased text-[#233657] bg-[#D0D0DA] flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#233657]/10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#233657] mb-8 text-center uppercase tracking-wide">Política de Cookies</h1>

                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#233657]/90">
                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué son las cookies?</h2>
                            <p className="mb-4 text-justify">
                                Una cookie es un archivo de texto inofensivo que se guarda en su navegador cuando visita casi cualquier página web. La utilidad de la cookie es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página. Aunque mucha gente no lo sabe, las cookies se llevan utilizando desde hace más de 20 años, cuando aparecieron los primeros navegadores para la World Wide Web.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué no es una cookie?</h2>
                            <p className="mb-4 text-justify">
                                No es un virus, ni un troyano, ni un gusano, ni spam, ni spyware, ni abre ventanas pop-up.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué información almacena una cookie?</h2>
                            <p className="mb-4 text-justify">
                                Las cookies no suelen almacenar información sensible sobre usted, como tarjetas de crédito o datos bancarios, fotografías, su identificación personal, etc. Los datos que guardan son de carácter técnico, preferencias personales, personalización de contenidos, estadísticas de uso, enlaces a redes sociales, acceso a cuentas de usuario, etc.
                            </p>
                            <p className="mb-4 text-justify">
                                El servidor web no le asocia a usted como persona si no a su navegador web. De hecho, si usted navega habitualmente con Internet Explorer y prueba a navegar por la misma web con Firefox o Chrome verá que la web no se da cuenta de que es usted la misma persona porque en realidad está asociando al navegador, no a la persona.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué tipo de cookies existen?</h2>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li><strong>Cookies técnicas:</strong> Son las más elementales y permiten, entre otras cosas, saber cuándo está navegando un humano o una aplicación automatizada, cuándo navega un usuario anónimo y uno registrado, tareas básicas para el funcionamiento de cualquier web dinámica.</li>
                                <li><strong>Cookies de análisis:</strong> Recogen información sobre el tipo de navegación que está realizando, las secciones que más utiliza, productos consultados, franja horaria de uso, idioma, etc.</li>
                                <li><strong>Cookies publicitarias:</strong> Muestran publicidad en función de su navegación, su país de procedencia, idioma, etc.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué son las cookies propias y las de terceros?</h2>
                            <p className="mb-4">
                                Las <strong>cookies propias</strong> son las generadas por la página que está visitando (en este caso, accrual.com.mx) y las <strong>de terceros</strong> son las generadas por servicios o proveedores externos como Facebook, Twitter, Google, etc.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Se pueden desactivar las cookies?</h2>
                            <p className="mb-4 text-justify">
                                Sí, se pueden desactivar. Sin embargo, debe tener en cuenta que si desactiva las cookies puede que ciertas funcionalidades y páginas no se muestren correctamente o la experiencia de usuario sea de menor calidad. Para desactivar las cookies, modifique los ajustes de su navegador web. Puede encontrar más información sobre cómo hacerlo en los sitios oficiales de soporte de su navegador:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Google Chrome</li>
                                <li>Mozilla Firefox</li>
                                <li>Apple Safari</li>
                                <li>Microsoft Edge</li>
                            </ul>
                        </section>

                        <div className="pt-8 text-xs text-[#233657]/60 italic text-right border-t border-[#233657]/10">
                            Última actualización de la Política de Cookies: 19/03/2026
                        </div>

                    </div>
                </div>
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default CookiesPolicy;
