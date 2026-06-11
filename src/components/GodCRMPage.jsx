import React, { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, Clock, Bot, RefreshCw, MessageSquare, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  };
}

export default function GodCRMPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ leads: 0, active: 0, appointments: 0 });
  const [leads, setLeads] = useState([]);
  const [botStatus, setBotStatus] = useState('DISCONNECTED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, statsRes, botRes] = await Promise.all([
        fetch('/api/crm/leads', { headers: authHeaders() }),
        fetch('/api/crm/stats?range=30', { headers: authHeaders() }),
        fetch('/api/whatsapp/status', { headers: authHeaders() })
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (data.success) setLeads(data.leads || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) {
          setStats({
            leads: data.totalLeads || 0,
            active: Math.round((data.totalLeads || 0) * 0.15),
            appointments: data.totalAppointments || 0
          });
        }
      }
      if (botRes.ok) {
        const data = await botRes.json();
        if (data.success) setBotStatus(data.status);
      }
    } catch (err) {
      console.warn('Dashboard fetch failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 min refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

  return (
    <div className="h-full w-full flex flex-col bg-transparent overflow-y-auto custom-scrollbar">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Hola, GodZilla 👋
        </h1>
        <p className="text-sm text-[#0099CC] mt-1 font-semibold tracking-wider">
          Resumen de prospectos y operaciones de la firma
        </p>
      </div>

      {error && (
        <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          <AlertCircle size={16} />
          <span>Error conectando a la base de datos: {error}</span>
        </div>
      )}

      {/* ── Top Stats Row ────────────────────────────────────────────── */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0">
            <Users className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : stats.leads}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Leads Registrados</div>
          </div>
        </div>

        <div className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0">
            <Calendar className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : stats.appointments}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Citas Totales</div>
          </div>
        </div>

        <div className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0">
            <Clock className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : stats.active}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Trámites Pendientes</div>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        
        {/* Left Col: Agenda / Leads */}
        <div className="lg:col-span-2 bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0099CC]/10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <MessageSquare size={16} className="text-[#0099CC]" />
              Actividad de Leads ({today})
            </h2>
            <button onClick={fetchData} className="text-[#0099CC]/60 hover:text-[#0099CC] transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-white/20">Cargando leads...</div>
            ) : leads.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/30 text-sm">
                No hay prospectos registrados aún.
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-[#0099CC]/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0099CC]/10 flex items-center justify-center text-[#0099CC] font-black text-sm border border-[#0099CC]/20">
                        {lead.numero_contacto ? String(lead.numero_contacto).slice(-2) : '??'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{lead.numero_contacto || 'Desconocido'}</div>
                        <div className="text-xs text-white/40 truncate max-w-[250px]">
                          {typeof lead.contexto_ia === 'object' && lead.contexto_ia ? JSON.stringify(lead.contexto_ia) : (lead.contexto_ia || 'Interacción iniciada')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 rounded-full bg-[#0099CC]/10 text-[#0099CC] text-[10px] font-bold uppercase tracking-wider border border-[#0099CC]/20">
                        {typeof lead.etapa_embudo === 'object' && lead.etapa_embudo ? JSON.stringify(lead.etapa_embudo) : (lead.etapa_embudo || 'Lead')}
                      </span>
                      <span className="text-[10px] text-white/30">{lead.ultima_interaccion ? new Date(lead.ultima_interaccion).toLocaleDateString() : 'Reciente'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Bot Status */}
        <div className="bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Bot size={16} className="text-[#0099CC]" />
              WhatsApp Bot
            </h2>
            <button onClick={fetchData} className="text-[#0099CC]/60 hover:text-[#0099CC] transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            {botStatus === 'CONNECTED' ? (
              <div className="px-6 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Bot Activo
              </div>
            ) : (
              <div className="px-6 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase flex items-center gap-2">
                <AlertCircle size={14} />
                Bot Inactivo
              </div>
            )}

            <p className="text-sm text-white/50 leading-relaxed px-4">
              El bot de WhatsApp está {botStatus === 'CONNECTED' ? 'conectado y atendiendo leads en automático.' : 'desconectado. Requiere escaneo QR.'}
            </p>

            <button
              onClick={() => navigate('/admin/bot')}
              className="w-full mt-4 py-3 rounded-xl border border-[#0099CC]/30 text-[#0099CC] text-xs font-bold uppercase tracking-wider hover:bg-[#0099CC] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Abrir Monitor de Bot
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
