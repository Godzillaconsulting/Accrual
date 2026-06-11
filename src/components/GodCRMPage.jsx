import React, { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, Clock, Bot, RefreshCw, MessageSquare, AlertCircle, ChevronRight, User, X } from 'lucide-react';
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
  const [selectedLead, setSelectedLead] = useState(null);
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
                {leads.map((lead, idx) => {
                  const phoneClean = lead.numero_contacto ? lead.numero_contacto.split('@')[0] : 'Desconocido';
                  
                  let contextText = 'Interacción iniciada';
                  if (lead.contexto_ia && typeof lead.contexto_ia === 'object') {
                    if (lead.contexto_ia.historial_mensajes && Array.isArray(lead.contexto_ia.historial_mensajes) && lead.contexto_ia.historial_mensajes.length > 0) {
                      const lastMsg = lead.contexto_ia.historial_mensajes[lead.contexto_ia.historial_mensajes.length - 1];
                      contextText = `Último msj: "${lastMsg.content}"`;
                    } else if (lead.contexto_ia.summary) {
                      contextText = lead.contexto_ia.summary;
                    } else {
                      contextText = 'Analizando contexto...';
                    }
                  } else if (typeof lead.contexto_ia === 'string') {
                    contextText = lead.contexto_ia;
                  }

                  const funnelClean = typeof lead.etapa_embudo === 'object' ? 'LEAD' : (lead.etapa_embudo || 'Lead');

                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedLead(lead)}
                      className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-[#0099CC]/30 hover:bg-[#0099CC]/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0099CC]/10 flex items-center justify-center text-[#0099CC] font-black text-sm border border-[#0099CC]/20 shrink-0">
                          {phoneClean.length > 2 ? phoneClean.slice(-2) : '??'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">{phoneClean}</div>
                          <div className="text-xs text-white/40 truncate w-[200px] md:w-[300px]" title={contextText}>
                            {contextText}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-3 py-1 rounded-full bg-[#0099CC]/10 text-[#0099CC] text-[9px] font-bold uppercase tracking-wider border border-[#0099CC]/20 max-w-[120px] truncate">
                          {funnelClean.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-white/30 font-mono tracking-widest">{lead.ultima_interaccion ? new Date(lead.ultima_interaccion).toLocaleDateString('es-MX', {day: '2-digit', month: 'short'}) : 'Reciente'}</span>
                      </div>
                    </div>
                  );
                })}
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

      {/* Modal de Detalles del Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#152033] border border-[#0099CC]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#0099CC]/20 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0099CC]/20 flex items-center justify-center text-[#0099CC] font-black text-lg border border-[#0099CC]/30 shrink-0">
                  {selectedLead.numero_contacto ? String(selectedLead.numero_contacto.split('@')[0]).slice(-2) : '??'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLead.numero_contacto ? selectedLead.numero_contacto.split('@')[0] : 'Desconocido'}</h3>
                  <p className="text-xs text-[#0099CC] font-bold uppercase tracking-widest">
                    {(typeof selectedLead.etapa_embudo === 'object' ? 'LEAD' : (selectedLead.etapa_embudo || 'Lead')).replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Chat History) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0a0f18] custom-scrollbar">
              {selectedLead.contexto_ia && typeof selectedLead.contexto_ia === 'object' && Array.isArray(selectedLead.contexto_ia.historial_mensajes) ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <span className="bg-[#152033] text-white/40 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">Inicio de la conversación</span>
                  </div>
                  {selectedLead.contexto_ia.historial_mensajes.map((msg, i) => {
                    const isBot = msg.role === 'assistant' || msg.role === 'system';
                    if (msg.role === 'system') return null; // Ocultar mensajes de sistema internos
                    return (
                      <div key={i} className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isBot ? 'bg-[#152033] border border-[#0099CC]/20 text-white/90 rounded-tl-sm' : 'bg-[#0099CC] text-white rounded-tr-sm shadow-md'}`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50 flex items-center gap-1">
                            {isBot ? <><Bot size={10} /> Asistente IA</> : <><User size={10} /> Cliente</>}
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : typeof selectedLead.contexto_ia === 'string' ? (
                <div className="p-4 bg-[#152033] rounded-xl border border-white/10 text-white/70 text-sm whitespace-pre-wrap">
                  {selectedLead.contexto_ia}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
                  <MessageSquare size={40} className="opacity-20" />
                  <p className="text-sm font-semibold tracking-wide">Aún no hay historial de chat registrado.</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 bg-black/20 border-t border-[#0099CC]/20 text-center">
               <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                  Última interacción: {selectedLead.ultima_interaccion ? new Date(selectedLead.ultima_interaccion).toLocaleString('es-MX') : 'Desconocida'}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
