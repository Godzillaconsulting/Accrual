import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import ContactScheduler from '../components/ContactScheduler';
import { Phone } from 'lucide-react';
import urrutiaImg from '../assets/Urrutia.jpg';

const servicesData = {
    "consultoria": {
        title: "Consultoría",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Brindamos servicios de consultoría integral para ayudar a tu empresa a navegar por los desafíos financieros y fiscales.",
        content: `
            <p>Brindamos servicios de consultoría integral para ayudar a tu empresa a navegar por los desafíos financieros y fiscales. Nuestro enfoque se centra en identificar oportunidades de mejora y optimización de recursos.</p>
            <p><strong>Nuestros servicios incluyen:</strong></p>
            <ul>
                <li>Análisis de procesos financieros</li>
                <li>Estrategias de crecimiento y expansión</li>
                <li>Optimización de estructura de capital</li>
            </ul>
        `
    },
    "planificacion-fiscal-avanzada": {
        title: "Planificación Fiscal Avanzada",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Desarrollamos estrategias fiscales avanzadas para maximizar la eficiencia fiscal de tu empresa.",
        content: `
            <p>Desarrollamos estrategias fiscales avanzadas que van más allá del cumplimiento básico. Nuestro objetivo es maximizar la eficiencia fiscal de tu empresa dentro del marco legal vigente.</p>
            <p>Analizamos tu estructura actual y proponemos soluciones innovadoras para reducir la carga tributaria operativa y optimizar el flujo de efectivo.</p>
        `
    },
    "declaracion-de-impuestos": {
        title: "Declaración de Impuestos",
        image: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Nos encargamos de la preparación y presentación de tus declaraciones de impuestos, asegurando el cumplimiento total.",
        content: `
            <p>Nos encargamos de la preparación y presentación de tus declaraciones de impuestos, asegurando el cumplimiento total con las normativas del SAT.</p>
            <p>Desde declaraciones mensuales hasta la declaración anual, nuestro equipo de expertos revisa meticulosamente cada detalle para evitar errores y multas innecesarias.</p>
        `
    },
    "imss-e-infonavit": {
        title: "IMSS e Infonavit",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Gestionamos todo lo relacionado con el IMSS e INFONAVIT para asegurar el cumplimiento de tus obligaciones patronales.",
        content: `
            <p>Gestionamos todo lo relacionado con el Instituto Mexicano del Seguro Social (IMSS) y el Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT).</p>
            <p>Aseguramos que tu empresa cumpla con las obligaciones patronales, correcta clasificación de riesgos de trabajo y determinación adecuada de cuotas obrero-patronales.</p>
        `
    },
    "repse": {
        title: "REPSE",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Apoyo integral en el registro y cumplimiento continuo del REPSE.",
        content: `
            <p>Te apoyamos en el registro y cumplimiento continuo del REPSE. Entendemos la complejidad de las nuevas regulaciones de subcontratación y te ayudamos a mantener tu registro vigente.</p>
            <p>Nuestros servicios incluyen la integración de expedientes, presentación de informes cuatrimestrales y atención a requerimientos de la autoridad.</p>
        `
    },
    "administracion-de-nomina": {
        title: "Administración de Nómina",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Deja la administración de tu nómina en manos de expertos. Cálculo correcto y a tiempo.",
        content: `
            <p>Deja la administración de tu nómina en manos de expertos. Nos encargamos del cálculo, dispersión y timbrado de la nómina de tus empleados.</p>
            <p>Garantizamos el cálculo correcto de percepciones, deducciones, impuestos y prestaciones, liberándote de la carga administrativa para que te enfoques en crecer tu negocio.</p>
        `
    },
    "contabilidad": {
        title: "Contabilidad Integral",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Servicio de contabilidad completo y actualizado para que cumplas con tus obligaciones fiscales sin estrés.",
        content: `
            <p>Ofrecemos un servicio de contabilidad completo y actualizado, diseñado para que cumplas con todas tus obligaciones fiscales sin estrés. Nos encargamos de registrar y analizar todas tus operaciones financieras.</p>
            <p><strong>Beneficios de nuestro servicio:</strong></p>
            <ul>
                <li>Registro puntual de ingresos y egresos</li>
                <li>Elaboración de estados financieros mensuales</li>
                <li>Conciliaciones bancarias y depuración de cuentas</li>
                <li>Cumplimiento normativo (NIF)</li>
            </ul>
            <p>Permite que nuestros expertos cuiden de tus números para que tú puedas enfocarte en el crecimiento de tu negocio.</p>
        `
    },
    "asesoria-en-planificacion-fiscal": {
        title: "Asesoría en Planificación Fiscal",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Acompañamiento permanente para la toma de decisiones fiscales inteligentes.",
        content: `
            <p>Ofrecemos acompañamiento permanente para la toma de decisiones fiscales inteligentes. Evaluamos el impacto fiscal de tus operaciones diarias y proyectos futuros.</p>
        `
    },
    "cumplimiento-tributario-servicio": {
        title: "Cumplimiento Tributario",
        image: "https://images.unsplash.com/photo-1554224154-260327c00c19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Asesoría y gestión de cumplimiento tributario para asegurar el cumplimiento con las normativas legales vigentes.",
        content: `
            <p>Ofrecemos auditorías financieras integrales para evaluar la exactitud y conformidad de sus estados financieros.</p>
            <p>Nuestro equipo de auditores profesionales utiliza técnicas avanzadas para identificar discrepancias y proporcionar recomendaciones para fortalecer el control interno y mejorar la transparencia financiera.</p>
        `
    },
    "cumplimiento-en-seguridad-social": {
        title: "Cumplimiento en Seguridad Social",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Auditoría y revisión de tus procesos de seguridad social ante IMSS e INFONAVIT.",
        content: `
            <p>Auditoría y revisión de tus procesos de seguridad social para detectar y corregir posibles irregularidades ante el IMSS e INFONAVIT antes de que sean detectadas por la autoridad.</p>
        `
    },
    "consultoria-financiera": {
        title: "Consultoría Financiera",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Diagnósticos claros y planes de acción para mejorar la rentabilidad, liquidez y solvencia.",
        content: `
            <p>Analizamos la salud financiera de tu organización, proporcionando diagnósticos claros y planes de acción para mejorar la rentabilidad, liquidez y solvencia.</p>
        `
    },
    "auditoria-financiera": {
        title: "Auditoría Financiera",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Auditorías independientes para validar la integridad de tu información financiera.",
        content: `
            <p>Realizamos auditorías financieras independientes para validar la integridad de tu información financiera. Genera confianza ante socios, inversionistas e instituciones financieras.</p>
        `
    },
    "asesoria-contable": {
        title: "Asesoría Contable",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Supervisión y asesoría a tu departamento contable interno o gestión integral.",
        content: `
            <p>Supervisamos y asesoramos a tu departamento contable interno, o nos encargamos de tu contabilidad integralmente. Aseguramos que tus registros reflejen la realidad económica de tu negocio.</p>
        `
    },
    "facturacion": {
        title: "Facturación",
        image: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Mejores prácticas en la emisión de CFDI para asegurar deducibilidad y cobro.",
        content: `
            <p>Te ayudamos a implementar las mejores prácticas en la emisión de Comprobantes Fiscales Digitales por Internet (CFDI). Asegura la deducibilidad de tus gastos y el cobro efectivo de tus ingresos.</p>
        `
    },
    "capacitacion": {
        title: "Capacitación",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Cursos y talleres actualizados en materia fiscal, contable y financiera.",
        content: `
            <p>Ofrecemos cursos y talleres actualizados en materia fiscal, contable y financiera. Mantén a tu equipo al día con los cambios constantes en la legislación.</p>
        `
    },
    "lfpiorpi": {
        title: "LFPIORPI (Ley Antilavado)",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        description: "Asesoría en el cumplimiento de la Ley Antilavado y actividades vulnerables.",
        content: `
            <p>Asesoría en el cumplimiento de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita. Identificamos actividades vulnerables y te ayudamos a cumplir con los avisos correspondientes.</p>
        `
    }
};

const ServiceDetail = () => {
    const { slug } = useParams();
    const service = servicesData[slug];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!service) {
        return (
            <div className="min-h-screen bg-[#D0D0DA] flex items-center justify-center text-[#233657]">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Servicio no encontrado</h1>
                    <Link to="/" className="text-[#0F4C82] hover:underline">Volver al Inicio</Link>
                </div>
            </div>
        );
    }

    const handleScrollToContact = () => {
        const contactForm = document.getElementById('contacto-form');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#D0D0DA] font-sans text-[#233657]">
            <Navbar />

            <section className="bg-[#D0D0DA] text-[#233657] py-24 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight uppercase drop-shadow-sm">
                        {service.title}
                    </h1>

                    <p className="text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-12 opacity-90">
                        {service.description}
                    </p>

                    <button
                        onClick={handleScrollToContact}
                        className="bg-[#0F4C82] hover:bg-[#233657] text-[#D0D0DA] font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transition-all shadow-lg transform hover:scale-105 mb-16"
                    >
                        Solicita un presupuesto <span className="text-xl">›</span>
                    </button>

                    <div className="w-full max-w-6xl aspect-video bg-[#233657]/10 rounded-[2rem] relative flex items-center justify-center shadow-2xl overflow-hidden group border border-[#233657]/20 backdrop-blur-xl">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* New Info & Profile Section */}
            <section className="bg-[#233657] py-24 px-6 text-[#D0D0DA] min-h-[600px] flex items-center">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Info */}
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black mb-12 leading-tight">
                            {service.title}
                        </h2>
                        <div
                            className="text-lg md:text-xl font-light leading-relaxed space-y-8 opacity-90 article-content light-text text-[#D0D0DA]"
                            dangerouslySetInnerHTML={{ __html: service.content }}
                        />
                    </div>

                    {/* Right: Profile Card */}
                    <div className="flex flex-col items-center lg:items-end gap-6">
                        <div className="bg-[#0F4C82] rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl relative">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[#D0D0DA]/20 bg-gray-300">
                                <img
                                    src={urrutiaImg}
                                    alt="Joel Urrutia"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-3xl font-bold mb-1 text-white">Joel Urrutia</h3>
                            <p className="text-[#D0D0DA]/80 text-lg mb-0 font-medium">Contador público</p>
                        </div>

                        <button
                            onClick={handleScrollToContact}
                            className="bg-[#D0D0DA] hover:bg-white text-[#233657] font-bold py-4 px-12 rounded-full text-xl flex items-center justify-center gap-3 transition-all shadow-lg w-full max-w-[400px]"
                        >
                            <Phone className="w-6 h-6 fill-current" />
                            Contáctame
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Bar below the grey section (As seen in some designs) or just keeping the flow? 
               The image shows the button "CONTACTAME" below the card. I'll add it to the right column above.
            */}

            <ContactScheduler showHeader={false} showMap={false} />
            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default ServiceDetail;
