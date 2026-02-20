import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const TermsAndConditions = () => {
    return (
        <div className="font-sans antialiased text-[#233657] bg-[#D0D0DA] flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#233657]/10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#233657] mb-8 text-center uppercase tracking-wide">Términos y Condiciones</h1>

                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#233657]/90">

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Información Relevante</h2>
                            <p className="mb-4">
                                Es requisito necesario para la adquisición de los servicios que se ofrecen en este sitio, que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. El uso de nuestros servicios así como la compra de nuestros productos implicará que usted ha leído y aceptado los Términos y Condiciones de Uso en el presente documento. Todas los productos que son ofrecidos por nuestro sitio web pudieran ser creadas, cobradas, enviadas o presentadas por una página web tercera y en tal caso estarían sujetas a sus propios Términos y Condiciones. En algunos casos, para adquirir un producto, será necesario el registro por parte del usuario, con ingreso de datos personales fidedignos y definición de una contraseña.
                            </p>
                            <p className="mb-4">
                                El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, en caso de que se haya registrado y que sea necesario para la compra de alguno de nuestros productos. accrual.com.mx no asume la responsabilidad en caso de que entregue dicha clave a terceros.
                            </p>
                            <p className="mb-4">
                                Todas las compras y transacciones que se lleven a cabo por medio de este sitio web, están sujetas a un proceso de confirmación y verificación, el cual podría incluir la verificación del stock y disponibilidad de producto, validación de la forma de pago, validación de la factura (en caso de existir) y el cumplimiento de las condiciones requeridas por el medio de pago seleccionado. En algunos casos puede que se requiera una verificación por medio de correo electrónico.
                            </p>
                            <p>
                                Los precios de los productos ofrecidos en esta Tienda Online es válido solamente en las compras realizadas en este sitio web.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Licencia</h2>
                            <p>
                                Accrual Accounting Services S.C a través de su sitio web concede una licencia para que los usuarios utilicen los productos que son vendidos en este sitio web de acuerdo a los Términos y Condiciones que se describen en este documento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Uso No Autorizado</h2>
                            <p>
                                En caso de que aplique (para venta de software, templetes, u otro producto de diseño y programación) usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y ofrecerlos para la redistribución o la reventa de ningún tipo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Propiedad</h2>
                            <p>
                                Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, modificado o sin modificar. Todos los productos son propiedad de los proveedores del contenido. En caso de que no se especifique lo contrario, nuestros productos se proporcionan sin ningún tipo de garantía, expresa o implícita. En ningún esta compañía será responsables de ningún daño incluyendo, pero no limitado a, daños directos, indirectos, especiales, fortuitos o consecuentes u otras pérdidas resultantes del uso o de la imposibilidad de utilizar nuestros productos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Política de Reembolso y Garantía</h2>
                            <p>
                                En el caso de servicios que sean irrevocables no-tangibles, no realizamos reembolsos después de que se realice el servicio, usted tiene la responsabilidad de entender antes de solicitarlo. Le pedimos que lea cuidadosamente antes de solicitarlo. Hacemos solamente excepciones con esta regla cuando la descripción no se ajusta al servicio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Comprobación Antifraude</h2>
                            <p>
                                La compra del cliente puede ser aplazada para la comprobación antifraude. También puede ser suspendida por más tiempo para una investigación más rigurosa, para evitar transacciones fraudulentas.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#233657] mb-4 uppercase tracking-wider">Privacidad</h2>
                            <p className="mb-4">
                                Este accrual.com.mx garantiza que la información personal que usted envía cuenta con la seguridad necesaria. Los datos ingresados por usuario o en el caso de requerir una validación de los pedidos no serán entregados a terceros, salvo que deba ser revelada en cumplimiento a una orden judicial o requerimientos legales.
                            </p>
                            <p className="mb-4">
                                La suscripción a boletines de correos electrónicos publicitarios es voluntaria y podría ser seleccionada al momento de crear su cuenta.
                            </p>
                            <p>
                                Accrual Accounting Services S.C. reserva los derechos de cambiar o de modificar estos términos sin previo aviso.
                            </p>
                        </section>

                    </div>
                </div>
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
