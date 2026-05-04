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

function getFieldWeight(key) {
  const lower = key.toLowerCase();
  
  // Specific blocks mapping to visual order
  if (key === 'title') return 1;
  if (key === 'description') return 2;
  if (key === 'heroBtnText') return 3;
  if (key === 'fullDescription' || key === 'content') return 4;
  
  if (lower.includes('profile')) return 7; // Perfil al final
  if (lower.includes('related')) return 8; // Relacionados hasta abajo
  
  if (lower.includes('title') || lower.includes('name')) return 5;
  if (lower.includes('subtitle') || lower.includes('role')) return 6;
  if (lower.includes('desc')) return 6;
  if (lower.includes('content') || lower.includes('text')) return 6;
  if (lower.includes('btn') || lower.includes('button')) return 6;
  
  return 99;
}

export function detectTextFields(data) {
  return Object.entries(data || {}).filter(([key, val]) =>
    typeof val === 'string' &&
    !MEDIA_PATTERNS.test(key) &&
    !NON_TEXT_KEYS.has(key) &&
    !key.startsWith('#') &&
    !/^([a-zA-Z]+?)(\d+)([A-Z][a-zA-Z]*)$/.test(key)
  ).sort(([a], [b]) => {
      const numA = parseInt(a.match(/\d+/) ? a.match(/\d+/)[0] : '0', 10);
      const numB = parseInt(b.match(/\d+/) ? b.match(/\d+/)[0] : '0', 10);
      if (numA !== numB) return numA - numB;
      
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
