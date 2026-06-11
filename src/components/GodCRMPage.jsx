import React, { useState, useEffect, useCallback } from 'react';
import { Users, Phone, MessageSquare, Clock, RefreshCw, AlertCircle, GripVertical, Search, Filter } from 'lucide-react';

/* ── Mock fallback data ─────────────────────────────────────────────── */
const MOCK_LEADS = [
  { id: 1, name: 'Carlos Mendoza', phone: '5512345678', stage: 'new', lastMessage: 'Hola, necesito información sobre facturación', updatedAt: '2026-06-10T10:30:00Z' },
  { id: 2, name: 'María López', phone: '5587654321', stage: 'bot_qualified', lastMessage: 'Me interesa el paquete emprendedor', updatedAt: '2026-06-10T09:15:00Z' },
  { id: 3, name: 'Roberto Sánchez', phone: '5511223344', stage: 'quote', lastMessage: 'Cuánto cuesta el servicio mensual?', updatedAt: '2026-06-09T14:00:00Z' },
  { id: 4, name: 'Ana García', phone: '5599887766', stage: 'support', lastMessage: 'Tengo un problema con mi declaración', updatedAt: '2026-06-09T11:30:00Z' },
  { id: 5, name: 'Luis Torres', phone: '5544556677', stage: 'closed', lastMessage: 'Gracias, ya firmé el contrato', updatedAt: '2026-06-08T16:45:00Z' },
];

/* ── Column definitions ─────────────────────────────────────────────── */
const COLUMNS = [
  { key: 'new',           label: '🟢 Lead Nuevo',        accent: '#22c55e' },
  { key: 'bot_qualified', label: '🤖 Calificación Bot',  accent: '#0099CC' },
  { key: 'quote',         label: '💰 Cotización',        accent: '#eab308' },
  { key: 'support',       label: '🛠️ Soporte',           accent: '#f97316' },
  { key: 'closed',        label: '✅ Cierre',            accent: '#18ffff' },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
function maskPhone(phone) {
  if (!phone || phone.length < 6) return phone || '—';
  return `${phone.slice(0, 2)}****${phone.slice(-4)}`;
}

function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 0) return 'just now';
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  };
}

/* ── Lead Card ───────────────────────────────────────────────────────── */
function LeadCard({ lead, onDragStart, accent }) {
  const initials = (lead.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      className="group relative cursor-grab active:cursor-grabbing select-none rounded-xl border border-white/10 p-4 transition-all duration-200 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10"
      style={{
        background: 'linear-gradient(135deg, rgba(21,32,51,.85) 0%, rgba(17,17,17,.9) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Drag grip indicator */}
      <div className="absolute right-2 top-2 text-white/20 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical size={14} />
      </div>

      {/* Avatar + Name */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: accent }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{lead.name}</p>
          <p className="flex items-center gap-1 text-xs text-white/50">
            <Phone size={10} />
            {maskPhone(lead.phone)}
          </p>
        </div>
      </div>

      {/* Last message */}
      <div className="mb-2 flex items-start gap-1.5 text-xs text-white/60">
        <MessageSquare size={12} className="mt-0.5 shrink-0 text-cyan-400/60" />
        <span className="line-clamp-2">{lead.lastMessage || '—'}</span>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-[10px] text-white/35">
        <Clock size={10} />
        {relativeTime(lead.updatedAt)}
      </div>
    </div>
  );
}

/* ── Main CRM Page ───────────────────────────────────────────────────── */
export default function GodCRMPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOverCol, setDragOverCol] = useState(null);

  /* ── Fetch leads ──────────────────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/crm/leads', { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mappedLeads = (data.leads || []).map(l => ({
        id: l.numero_contacto,
        name: 'Cliente ' + (l.numero_contacto ? l.numero_contacto.slice(-4) : '????'),
        phone: l.numero_contacto,
        stage: l.etapa_embudo || 'new',
        lastMessage: l.contexto_ia || 'Sin contexto',
        updatedAt: l.ultima_interaccion
      }));
      setLeads(mappedLeads);
    } catch (err) {
      console.warn('CRM fetch failed, using mock data:', err.message);
      setError(err.message);
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* ── Drag & Drop handlers ─────────────────────────────────────────── */
  function handleDragStart(e, lead) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: lead.id, fromStage: lead.stage }));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, colKey) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colKey);
  }

  function handleDragLeave() {
    setDragOverCol(null);
  }

  async function handleDrop(e, newStage) {
    e.preventDefault();
    setDragOverCol(null);

    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      return;
    }

    const { id, fromStage } = payload;
    if (fromStage === newStage) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage: newStage, updatedAt: new Date().toISOString() } : l)),
    );

    // Persist to API
    try {
      const res = await fetch(`/api/crm/leads/${id}/stage`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ etapa_embudo: newStage }),
      });
      if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
    } catch (err) {
      console.warn('Stage update failed (kept local change):', err.message);
    }
  }

  /* ── Filtered leads ───────────────────────────────────────────────── */
  const filtered = searchTerm
    ? leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.phone?.includes(searchTerm) ||
          l.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : leads;

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(160deg, #0a0f1a 0%, #111 40%, #152033 100%)' }}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 px-6 py-5 shrink-0">
        <div className="mx-auto flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #0099CC, #00bcd4)' }}>
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">CRM Kanban</h1>
              <p className="text-xs text-white/40">Gestión de leads · {leads.length} contactos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Buscar lead..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-56 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-40"
              title="Recargar leads"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Error banner ─────────────────────────────────────────────── */}
      {error && (
        <div className="mx-6 mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-300 shrink-0">
          <AlertCircle size={14} />
          <span>API no disponible — mostrando datos de demostración ({error})</span>
        </div>
      )}

      {/* ── Kanban Board ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden p-6">
        <div className="h-full flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {COLUMNS.map((col) => {
            const colLeads = filtered.filter((l) => l.stage === col.key);
            const isOver = dragOverCol === col.key;

            return (
              <div
                key={col.key}
                className="flex h-full w-80 min-w-[320px] flex-col rounded-2xl border transition-colors duration-200"
                style={{
                  borderColor: isOver ? col.accent + '55' : 'rgba(255,255,255,0.06)',
                  background: isOver
                    ? `linear-gradient(180deg, ${col.accent}08 0%, transparent 40%)`
                    : 'rgba(255,255,255,0.02)',
                }}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 shrink-0">
                  <h2 className="text-sm font-bold text-white/90">{col.label}</h2>
                  <span
                    className="flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-bold text-white"
                    style={{ backgroundColor: col.accent + '33', color: col.accent }}
                  >
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {loading && colLeads.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <RefreshCw size={20} className="animate-spin text-white/20" />
                    </div>
                  )}

                  {!loading && colLeads.length === 0 && (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-white/20">
                      Sin leads
                    </div>
                  )}

                  {colLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} accent={col.accent} onDragStart={handleDragStart} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
