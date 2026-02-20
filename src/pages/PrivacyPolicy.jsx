import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PrivacyPolicy = () => {
    return (
        <div className="font-sans antialiased text-[#233657] bg-[#D0D0DA] flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#233657]/10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#233657] mb-8 text-center uppercase tracking-wide">Privacidad</h1>
                    <div className="text-center font-bold text-lg mb-8 uppercase tracking-wider text-[#233657]/80">Aviso de privacidad integral</div>

                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#233657]/90">

                        <p className="mb-4 text-justify">
                            Accrual Accounting Services S.C. mejor conocido como ACCRUAL, con domicilio en Calle Minerva 1174. Col. Olimpia y portal de internet accrual.com.mx, es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente:
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Para qué fines utilizaremos sus datos personales?</h2>
                            <p className="mb-4">
                                Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias para el servicio que solicita:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Respuesta a mensajes del formulario de contacto</li>
                                <li>Prestación de cualquier servicio solicitado</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Qué datos personales utilizaremos para estos fines?</h2>
                            <p className="mb-4">
                                Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Datos de identificación y contacto</li>
                                <li>Datos sobre características físicas</li>
                                <li>Datos biométricos</li>
                                <li>Datos laborales</li>
                                <li>Datos académicos</li>
                                <li>Datos migratorios</li>
                                <li>Datos patrimoniales y/o financieros</li>
                                <li>Datos sobre pasatiempos</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse a su uso o ejercer la revocación de consentimiento?</h2>
                            <p className="mb-4 text-justify">
                                Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
                            </p>
                            <p className="mb-4">
                                Para el ejercicio de cualquiera de los derechos ARCO, debe enviar una petición vía correo electrónico a <a href="mailto:contacto@accrual.com.mx" className="text-[#0F4C82] font-bold hover:underline">contacto@accrual.com.mx</a> y deberá contener:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Nombre completo del titular.</li>
                                <li>Domicilio.</li>
                                <li>Teléfono.</li>
                                <li>Correo electrónico usado en este sitio web.</li>
                                <li>Copia de una identificación oficial adjunta.</li>
                                <li>Asunto «Derechos ARCO»</li>
                            </ul>
                            <p className="mb-4 text-justify">
                                Descripción el objeto del escrito, los cuales pueden ser de manera enunciativa más no limitativa los siguientes: Revocación del consentimiento para tratar sus datos personales; y/o Notificación del uso indebido del tratamiento de sus datos personales; y/o Ejercitar sus Derechos ARCO, con una descripción clara y precisa de los datos a Acceder, Rectificar, Cancelar o bien, Oponerse. En caso de Rectificación de datos personales, deberá indicar la modificación exacta y anexar la documentación soporte; es importante en caso de revocación del consentimiento, que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales. Asimismo, usted deberá considerar que para ciertos fines, la revocación de su consentimiento implicará que no le podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.
                            </p>
                            <div className="bg-[#D0D0DA]/20 p-6 rounded-lg border border-[#233657]/10 mt-6">
                                <p className="mb-2"><strong>¿En cuántos días le daremos respuesta a su solicitud?</strong> 5 días</p>
                                <p><strong>¿Por qué medio le comunicaremos la respuesta a su solicitud?</strong> Al mismo correo electrónico de donde se envío la petición.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">El uso de tecnologías de rastreo en nuestro portal de internet</h2>
                            <p className="mb-4 text-justify">
                                Le informamos que en nuestra página de internet utilizamos cookies, web beacons u otras tecnologías, a través de las cuales es posible monitorear su comportamiento como usuario de internet, así como brindarle un mejor servicio y experiencia al navegar en nuestra página. Los datos personales que obtenemos de estas tecnologías de rastreo son los siguientes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>Identificadores, nombre de usuario y contraseñas de sesión</li>
                                <li>Idioma preferido por el usuario</li>
                                <li>Región en la que se encuentra el usuario</li>
                                <li>Tipo de navegador del usuario</li>
                                <li>Tipo de sistema operativo del usuario</li>
                                <li>Fecha y hora del inicio y final de una sesión de un usuario</li>
                                <li>Páginas web visitadas por un usuario</li>
                                <li>Búsquedas realizadas por un usuario</li>
                                <li>Publicidad revisada por un usuario</li>
                                <li>Listas y hábitos de consumo en páginas de compras</li>
                            </ul>
                            <p className="mb-4 text-justify">
                                Estas cookies, web beacons y otras tecnologías pueden ser deshabilitadas. Para conocer cómo hacerlo, consulte el menú de ayuda de su navegador. Tenga en cuenta que, en caso de desactivar las cookies, es posible que no pueda acceder a ciertas funciones personalizadas en nuestros sitio web.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">¿Cómo puede conocer los cambios en este aviso de privacidad?</h2>
                            <p className="mb-4 text-justify">
                                El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias necesidades por los productos o servicios que ofrecemos; de nuestras prácticas de privacidad; de cambios en nuestro modelo de negocio, o por otras causas. Nos comprometemos a mantener actualizado este aviso de privacidad sobre los cambios que pueda sufrir y siempre podrá consultar las actualizaciones que existan en el sitio web accrual.com.mx.
                            </p>
                        </section>

                        <div className="pt-8 text-xs text-[#233657]/60 italic text-right border-t border-[#233657]/10">
                            Última actualización de este aviso de privacidad: 19/11/2024
                        </div>

                    </div>
                </div>
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
