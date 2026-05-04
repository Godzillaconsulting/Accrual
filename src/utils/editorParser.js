// ── Detección automática de campos de texto en draftData ───────────────────
const NON_TEXT_KEYS = new Set(['ctaLink','enlace','link','href','url','src','elements','planFeaturesExtended']);
export const MEDIA_PATTERNS = /url|src|image|video|logo|icon|thumbnail|cover|photo|gif|bg|media|banner|foto|avatar/i;
const SKIP_MEDIA = new Set(['ctaLink','enlace','link','href']);

const LOGICAL_ORDER = {
  title: 1, name: 1,
  subtitle: 2, role: 2,
  description: 3, desc: 3,
  fullDescription: 4, content: 4, text: 4,
  btn: 5, button: 5, link: 5, cta: 5,
};

// Orden visual estricto para TODAS las categorías del panel
const EXACT_WEIGHTS = {
  // Servicios & Articulos
  'title': 10,
  'description': 20,
  'heroBtnText': 30,
  'fullDescription': 40,
  'content': 40,
  'profileName': 50,
  'profileRole': 60,
  'profileBtnText': 70,
  'ctaBtn': 80,
  'relatedTitle': 90,

  // Hero
  'heroTitle1': 100,
  'heroSubtitle1': 110,
  'heroBtn1': 120,
  'heroBtn2': 130,

  // CTA
  'ctaTitle': 200,
  'ctaDesc': 210,
  'ctaBtn': 220,
  'ctaGuarantee': 230,

  // About
  'aboutMainTitle': 300,
  'aboutSubtitle1': 310,
  'aboutText1': 320,
  'aboutSubtitle2': 330,
  'aboutText2': 340,
  'aboutSubtitle3': 350,
  'aboutText3': 360,
  'aboutBtn': 370,

  // Testimonials
  'testMainTitle': 400,
  'testSubtitle': 410,
};

export function getFieldWeight(key) {
  if (EXACT_WEIGHTS[key] !== undefined) return EXACT_WEIGHTS[key];
  
  // Testimonios dinámicos (test1Name, etc.)
  const testMatch = key.match(/^test(\d+)(Name|Role|Text)$/);
  if (testMatch) {
      const num = parseInt(testMatch[1], 10);
      const type = testMatch[2];
      const typeWeight = type === 'Name' ? 1 : (type === 'Role' ? 2 : 3);
      return 500 + (num * 10) + typeWeight;
  }

  // Fallback for unknown
  const lower = key.toLowerCase();
  if (lower.includes('title') || lower.includes('name')) return 1000;
  if (lower.includes('preprice')) return 1001;
  if (lower.includes('price') || lower.includes('postprice')) return 1002;
  if (lower.includes('subtitle') || lower.includes('role')) return 1003;
  if (lower.includes('desc')) return 1004;
  if (lower.includes('content') || lower.includes('text')) return 1005;
  if (lower.includes('bullet')) return 1006;
  if (lower.includes('btn') || lower.includes('button')) return 1007;
  
  return 2000;
}

export function detectTextFields(data) {
  return Object.entries(data || {}).filter(([key, val]) =>
    typeof val === 'string' &&
    !MEDIA_PATTERNS.test(key) &&
    !NON_TEXT_KEYS.has(key) &&
    !key.startsWith('#') &&
    !/^([a-zA-Z]+?)(\d+)([A-Z][a-zA-Z]*)$/.test(key)
  ).sort(([a], [b]) => {
      const weightA = getFieldWeight(a);
      const weightB = getFieldWeight(b);
      
      if (weightA !== weightB) return weightA - weightB;
      return a.localeCompare(b);
  });
}

export function detectMediaFields(data) {
  return Object.entries(data || {}).filter(([key, val]) =>
    typeof val ==='string' &&
    MEDIA_PATTERNS.test(key) &&
    !SKIP_MEDIA.has(key)
  ).sort(([a], [b]) => {
      const numA = parseInt(a.match(/\d+/) ? a.match(/\d+/)[0] : '0', 10);
      const numB = parseInt(b.match(/\d+/) ? b.match(/\d+/)[0] : '0', 10);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
  });
}

// Convierte camelCase/snakeCase a label legible
export function toLabel(key) {
  return key
    .replace(/([A-Z])/g,' $1')
    .replace(/[_-]/g,'')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// Agrupa campos numerados: service1Title, service2Desc → grupos por número
export function detectGroupedFields(data) {
  const groups = {};
  Object.keys(data || {}).forEach(key => {
    if (MEDIA_PATTERNS.test(key)) return; // <-- EXCLUIR MEDIA DE LOS GRUPOS DE TEXTO
    const m = key.match(/^([a-zA-Z]+?)(\d+)([A-Z][a-zA-Z]*)$/);
    if (m) {
      const [, prefix, num, field] = m;
      if (!groups[prefix]) groups[prefix] = {};
      if (!groups[prefix][num]) groups[prefix][num] = {};
      groups[prefix][num][field] = data[key];
      groups[prefix][num]['_keys'] = groups[prefix][num]['_keys'] || {};
      groups[prefix][num]['_keys'][field] = key; // original key
    }
  });
  return groups;
}
