import { servicesData } from './mockServices';

const serviceIdMap = {
    'servicio-consultoria': 'consultoria',
    'servicio-planificacion-avanzada': 'planificacion-fiscal-avanzada',
    'servicio-declaracion': 'declaracion-de-impuestos',
    'servicio-imss': 'imss-e-infonavit',
    'servicio-repse': 'repse',
    'servicio-nomina': 'administracion-de-nomina',
    'servicio-contabilidad': 'contabilidad',
    'servicio-asesoria-planificacion': 'asesoria-en-planificacion-fiscal',
    'servicio-cumplimiento-tributario': 'cumplimiento-tributario-servicio',
    'servicio-cumplimiento-seguridad': 'cumplimiento-en-seguridad-social',
    'servicio-consultoria-financiera': 'consultoria-financiera',
    'servicio-auditoria': 'auditoria-financiera',
    'servicio-asesoria-contable': 'asesoria-contable',
    'servicio-facturacion': 'facturacion',
    'servicio-capacitacion': 'capacitacion',
    'servicio-ley-federal': 'lfpiorpi'
};

export const PAGE_SECTIONS = [
 { id:'hero', label:'Encabezado principal', emoji:'🏠', tag:'SITIO PRINCIPAL' },
 { id:'auditoria-cta', label:'Auditoría Rayos X (CTA)', emoji:'🎯', tag:'SITIO PRINCIPAL' },
 { id:'paquetes', label:'Paquetes', emoji:'📦', tag:'SITIO PRINCIPAL' },
 { id:'testimonios', label:'Testimonios', emoji:'💬', tag:'SITIO PRINCIPAL' },

 { id:'quienes-somos', label:'Quiénes somos', emoji:'🏢', tag:'QUIÉNES SOMOS' },

 { id:'servicios-grid', label:'Servicios Grid', emoji:'⚡', tag:'SERVICIOS' },
 { id:'servicio-consultoria', label:'Consultoría', emoji:'📊', tag:'SERVICIOS' },
 { id:'servicio-planificacion-avanzada', label:'Planificación fiscal avanzada', emoji:'🗓️', tag:'SERVICIOS' },
 { id:'servicio-declaracion', label:'Declaración de impuestos', emoji:'📝', tag:'SERVICIOS' },
 { id:'servicio-imss', label:'IMSS e Infonavit', emoji:'🏥', tag:'SERVICIOS' },
 { id:'servicio-repse', label:'REPSE', emoji:'📋', tag:'SERVICIOS' },
 { id:'servicio-nomina', label:'Administración de nómina', emoji:'👥', tag:'SERVICIOS' },
 { id:'servicio-contabilidad', label:'Contabilidad', emoji:'💻', tag:'SERVICIOS' },
 { id:'servicio-asesoria-planificacion', label:'Asesoría en planif. fiscal', emoji:'📈', tag:'SERVICIOS' },
 { id:'servicio-cumplimiento-tributario', label:'Cumplimiento tributario', emoji:'⚖️', tag:'SERVICIOS' },
 { id:'servicio-cumplimiento-seguridad', label:'Cumplimiento en seg. social', emoji:'🛡️', tag:'SERVICIOS' },
 { id:'servicio-consultoria-financiera', label:'Consultoría financiera', emoji:'💡', tag:'SERVICIOS' },
 { id:'servicio-auditoria', label:'Auditoría financiera', emoji:'🔍', tag:'SERVICIOS' },
 { id:'servicio-asesoria-contable', label:'Asesoría contable', emoji:'📚', tag:'SERVICIOS' },
 { id:'servicio-facturacion', label:'Facturación', emoji:'🧾', tag:'SERVICIOS' },
 { id:'servicio-capacitacion', label:'Capacitación', emoji:'🎓', tag:'SERVICIOS' },
 { id:'servicio-ley-federal', label:'Ley federal prev. ilícita', emoji:'🚨', tag:'SERVICIOS' },

 { id:'articulos-grid', label:'Artículos Grid', emoji:'📚', tag:'ARTÍCULOS' },
 { id:'articulo-1', label:'Errores en declaración', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-2', label:'Beneficios de un asesor fiscal', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-3', label:'Beneficios del compliance', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-4', label:'Importancia del presupuesto', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-5', label:'Implicaciones de delitos fisc.', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-6', label:'Suspensión de sellos', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-7', label:'Partes relacionadas y precios', emoji:'📄', tag:'ARTÍCULOS' },
 { id:'articulo-8', label:'Acciones BEPS', emoji:'📄', tag:'ARTÍCULOS' },
];

export function injectSectionDefaults(nodeId, draftSource) {
  const combinedData = { ...draftSource };

  if (nodeId === 'hero') {
      if (combinedData.videoUrl === undefined) combinedData.videoUrl = '';
      if (combinedData.heroTitle1 === undefined) combinedData.heroTitle1 = 'Ingeniería Fiscal y Patrimonial <br /> para la Frontera Norte';
      if (combinedData.heroSubtitle1 === undefined) combinedData.heroSubtitle1 = 'Optimizamos tu carga tributaria en México y coordinamos tu cumplimiento internacional. Desde RESICO hasta Precios de Transferencia.';
      if (combinedData.heroBtn1 === undefined) combinedData.heroBtn1 = 'Ver Planes';
      if (combinedData.heroBtn2 === undefined) combinedData.heroBtn2 = 'Ver Servicios';
  } else if (nodeId.startsWith('servicio-')) {
      const slugKey = serviceIdMap[nodeId] || nodeId.replace('servicio-', '');
      const localFallback = servicesData[slugKey] || {};

      if (combinedData.title === undefined) combinedData.title = localFallback.title || 'Título del Servicio';
      if (combinedData.description === undefined) combinedData.description = localFallback.description || 'Descripción breve para encabezado.';
      if (combinedData.fullDescription === undefined) combinedData.fullDescription = localFallback.content || '<p>Descripción completa del servicio. Puedes usar HTML aquí.</p>';
      if (combinedData.imageUrl === undefined) combinedData.imageUrl = localFallback.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';
      if (combinedData.icon === undefined) combinedData.icon = 'briefcase';
      
      // Dynamic fields for ServiceDetail
      if (combinedData.heroBtnText === undefined) combinedData.heroBtnText = 'Solicita un presupuesto ›';
      if (combinedData.profileName === undefined) combinedData.profileName = 'Joel Urrutia';
      if (combinedData.profileRole === undefined) combinedData.profileRole = 'Socio fundador';
      if (combinedData.profileBtnText === undefined) combinedData.profileBtnText = 'Contáctame';
      if (combinedData.profileImage === undefined) combinedData.profileImage = '';
  } else if (nodeId.startsWith('articulo-')) {
      if (combinedData.ctaBtn === undefined) combinedData.ctaBtn = 'Quiero más información';
      if (combinedData.relatedTitle === undefined) combinedData.relatedTitle = 'Continúa Leyendo';
  } else if (nodeId === 'auditoria-cta') {
      if (combinedData.ctaTitle === undefined) combinedData.ctaTitle = 'TU CIERRE FISCAL ESTÁ EN RIESGO.';
      if (combinedData.ctaDesc === undefined) combinedData.ctaDesc = 'El SAT ha automatizado sus auditorías. ¿Estás seguro de que tus XMLs coinciden con tus bancos? <br/><br/> Obtén nuestra auditoría de diagnóstico "Rayos X". Revisamos tu situación fiscal actual, detectamos discrepancias y te entregamos un plan de corrección antes de tu declaración anual.';
      if (combinedData.ctaBtn === undefined) combinedData.ctaBtn = 'QUIERO MI AUDITORÍA RAYOS X';
      if (combinedData.ctaGuarantee === undefined) combinedData.ctaGuarantee = 'Si no encontramos áreas de mejora, te devolvemos tu dinero.';
      if (combinedData.ctaImageUrl === undefined) combinedData.ctaImageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  } else if (nodeId === 'quienes-somos') {
      if (combinedData.aboutMainTitle === undefined) combinedData.aboutMainTitle = '¿Quiénes <br /> Somos?';
      if (combinedData.aboutSubtitle1 === undefined) combinedData.aboutSubtitle1 = 'Nuestra Historia';
      if (combinedData.aboutText1 === undefined) combinedData.aboutText1 = 'Fundada en 2015, Accrual se ha dedicado a fortalecer a sus socios de negocios mediante servicios de vanguardia, profesionalismo y veracidad.';
      if (combinedData.aboutSubtitle2 === undefined) combinedData.aboutSubtitle2 = 'Visión';
      if (combinedData.aboutText2 === undefined) combinedData.aboutText2 = 'Con la visión de ser líderes en ofrecer servicios financieros y fiscales a nivel nacional e internacional, ofrecemos soluciones innovadoras en planeación, diseño, capacitación y consultoría fiscal, contable y financiera.';
      if (combinedData.aboutSubtitle3 === undefined) combinedData.aboutSubtitle3 = 'Misión';
      if (combinedData.aboutText3 === undefined) combinedData.aboutText3 = 'Nuestra misión es impulsar el éxito y la eficiencia de nuestros clientes, fortaleciendo sus pilares financieros. A través de nuestra trayectoria, hemos logrado demostrar nuestro compromiso con la excelencia con el máximo profesionalismo.';
      if (combinedData.aboutBtn === undefined) combinedData.aboutBtn = 'Conoce nuestros servicios';
      if (combinedData.aboutImage === undefined) combinedData.aboutImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  } else if (nodeId === 'paquetes') {
      if (combinedData.pack1Title === undefined) combinedData.pack1Title = 'Emprendedores';
      if (combinedData.pack1PrePrice === undefined) combinedData.pack1PrePrice = 'menos de';
      if (combinedData.pack1Price === undefined) combinedData.pack1Price = '$3,500,000';
      if (combinedData.pack1PostPrice === undefined) combinedData.pack1PostPrice = 'mxn';
      if (combinedData.pack1Subtitle === undefined) combinedData.pack1Subtitle = '/ Facturación mensual';
      if (combinedData.pack1Desc === undefined) combinedData.pack1Desc = '¿Estás facturando menos de $3,500,000 al mes? <br /><br /> Deja de perder tiempo en trámites y enfócate en lo que genera dinero. Construimos la estructura fiscal que soporta tu primer millón sin riesgos ante el SAT';
      if (combinedData.pack1Btn === undefined) combinedData.pack1Btn = 'Ver Solución Emprendedor';
      if (combinedData.pack1Bullet1 === undefined) combinedData.pack1Bullet1 = 'Simplifica tu vida fiscal';
      if (combinedData.pack1Bullet2 === undefined) combinedData.pack1Bullet2 = 'Servicio Clave: RESICO';
      
      if (combinedData.pack2Title === undefined) combinedData.pack2Title = 'Pymes y Negocios';
      if (combinedData.pack2PrePrice === undefined) combinedData.pack2PrePrice = 'entre';
      if (combinedData.pack2Price === undefined) combinedData.pack2Price = '$3,500,000 - $30,000,000';
      if (combinedData.pack2PostPrice === undefined) combinedData.pack2PostPrice = 'mxn';
      if (combinedData.pack2Subtitle === undefined) combinedData.pack2Subtitle = '/ Facturación mensual';
      if (combinedData.pack2Desc === undefined) combinedData.pack2Desc = '¿Estás facturando entre $3,500,000 y $30,000,000 al mes? <br /><br /> ¿Tu nómina y el SAT se están comiendo tu flujo de caja? Activamos los estímulos fronterizos y optimizamos tu carga laboral para inyectar capital inmediato a tu operación.';
      if (combinedData.pack2Btn === undefined) combinedData.pack2Btn = 'Ver Solución Negocio';
      if (combinedData.pack2Bullet1 === undefined) combinedData.pack2Bullet1 = 'Estímulos fronterizos';
      if (combinedData.pack2Bullet2 === undefined) combinedData.pack2Bullet2 = 'Servicio Clave: Regularización';
      if (combinedData.pack2Bullet3 === undefined) combinedData.pack2Bullet3 = 'Optimización de Nómina';

      if (combinedData.pack3Title === undefined) combinedData.pack3Title = 'Corporativo Global';
      if (combinedData.pack3PrePrice === undefined) combinedData.pack3PrePrice = 'más de';
      if (combinedData.pack3Price === undefined) combinedData.pack3Price = '$30,000,000';
      if (combinedData.pack3PostPrice === undefined) combinedData.pack3PostPrice = 'mxn';
      if (combinedData.pack3Subtitle === undefined) combinedData.pack3Subtitle = '/ Facturación mensual + Ops USA';
      if (combinedData.pack3Desc === undefined) combinedData.pack3Desc = '¿Estás facturando más de $30,000,000 al mes? <br /><br /> Protege tu patrimonio transfronterizo. Sincronizamos tu operación México-USA mediante ingeniería fiscal avanzada, precios de transferencia y blindaje legal preventivo.';
      if (combinedData.pack3Btn === undefined) combinedData.pack3Btn = 'Ver Solución Corporativo';
      if (combinedData.pack3Bullet1 === undefined) combinedData.pack3Bullet1 = 'Estrategia Binacional';
      if (combinedData.pack3Bullet2 === undefined) combinedData.pack3Bullet2 = 'Precios de Transferencia';
      if (combinedData.pack3Bullet3 === undefined) combinedData.pack3Bullet3 = 'Auditoría & Compliance';
  } else if (nodeId === 'testimonios') {
      if (combinedData.testMainTitle === undefined) combinedData.testMainTitle = 'LO QUE OPINAN NUESTROS CLIENTES <br /> DE ACCRUAL';
      if (combinedData.testSubtitle === undefined) combinedData.testSubtitle = 'Resultados Reales en la Frontera Norte';

      // Testimonio 1
      if (combinedData.test1Name === undefined) combinedData.test1Name = 'Miranda Wiley ND';
      if (combinedData.test1Role === undefined) combinedData.test1Role = 'Directora Ejecutiva';
      if (combinedData.test1Text === undefined) combinedData.test1Text = 'Desde que trabajamos con Accrual, nuestra planificación fiscal ha dado un salto de calidad increíble. Entienden perfectamente los retos de la frontera.';
      if (combinedData.test1Avatar === undefined) combinedData.test1Avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

      // Testimonio 2
      if (combinedData.test2Name === undefined) combinedData.test2Name = 'Ricardo Treviño';
      if (combinedData.test2Role === undefined) combinedData.test2Role = 'Empresario Industrial';
      if (combinedData.test2Text === undefined) combinedData.test2Text = 'La asesoría en IMSS e Infonavit fue clave para regularizar nuestras operaciones. Son estrategas reales, no solo capturistas.';
      if (combinedData.test2Avatar === undefined) combinedData.test2Avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

      // Testimonio 3
      if (combinedData.test3Name === undefined) combinedData.test3Name = 'Sofía Martínez';
      if (combinedData.test3Role === undefined) combinedData.test3Role = 'Fundadora de StartUp';
      if (combinedData.test3Text === undefined) combinedData.test3Text = 'Excelente servicio de contabilidad y facturación. El equipo es muy profesional y siempre están disponibles para resolver dudas.';
      if (combinedData.test3Avatar === undefined) combinedData.test3Avatar = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

      // Testimonio 4
      if (combinedData.test4Name === undefined) combinedData.test4Name = 'Carlos Méndez';
      if (combinedData.test4Role === undefined) combinedData.test4Role = 'Director de Logística';
      if (combinedData.test4Text === undefined) combinedData.test4Text = 'La implementación de estrategias de cumplimiento tributario nos ahorró tiempo y recursos valiosos. Altamente recomendados.';
      if (combinedData.test4Avatar === undefined) combinedData.test4Avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

      // Testimonio 5
      if (combinedData.test5Name === undefined) combinedData.test5Name = 'Elena Gómez';
      if (combinedData.test5Role === undefined) combinedData.test5Role = 'Consultora de Negocios';
      if (combinedData.test5Text === undefined) combinedData.test5Text = 'Su enfoque en la planeación avanzada es lo que los distingue. Realmente se preocupan por el crecimiento patrimonial de sus clientes.';
      if (combinedData.test5Avatar === undefined) combinedData.test5Avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

      // Testimonio 6
      if (combinedData.test6Name === undefined) combinedData.test6Name = 'Javier Ortiz';
      if (combinedData.test6Role === undefined) combinedData.test6Role = 'Dueño de Restaurante';
      if (combinedData.test6Text === undefined) combinedData.test6Text = 'Tener orden en mis impuestos y nómina me dio la paz mental que necesitaba para enfocarme en mi negocio. Gracias, Accrual.';
      if (combinedData.test6Avatar === undefined) combinedData.test6Avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  } else if (nodeId === 'articulos-grid') {
      if (combinedData.title === undefined) combinedData.title = 'Artículos';
      if (combinedData.description === undefined) combinedData.description = 'Mantente informado con las últimas noticias, análisis y estrategias fiscales para tu negocio.';
      if (combinedData.heroImageUrl === undefined) combinedData.heroImageUrl = ''; 
  } else if (nodeId === 'servicios-grid') {
      if (combinedData.title === undefined) combinedData.title = 'Servicios';
      if (combinedData.heroImageUrl === undefined) combinedData.heroImageUrl = ''; 
  } else {
      // Forzar campos básicos por defecto genérico
      if (combinedData.title === undefined) combinedData.title = 'Título por defecto';
      if (combinedData.description === undefined) combinedData.description = 'Descripción detallada para esta sección. Puedes editar este texto desde el panel.';
      if (combinedData.imageUrl === undefined) combinedData.imageUrl = ''; 
  }

  return combinedData;
}

export function replaceBrWithNewline(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    return val.replace(/<br\s*\/?>/gi, '\n');
  }
  if (Array.isArray(val)) {
    return val.map(replaceBrWithNewline);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        res[key] = replaceBrWithNewline(val[key]);
      }
    }
    return res;
  }
  return val;
}

export function replaceNewlineWithBr(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    return val.replace(/\n/g, '<br />');
  }
  if (Array.isArray(val)) {
    return val.map(replaceNewlineWithBr);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        res[key] = replaceNewlineWithBr(val[key]);
      }
    }
    return res;
  }
  return val;
}
