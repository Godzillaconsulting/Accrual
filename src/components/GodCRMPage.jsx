import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Calendar, Clock, Bot, RefreshCw, MessageSquare, AlertCircle, ChevronRight, User, X, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, endOfWeek, getDay, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  };
}

export default function GodCRMPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ leads: 0, active: 0, appointments: 0 });
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [botStatus, setBotStatus] = useState('DISCONNECTED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de fecha
  const [selectedDate, setSelectedDate] = useState(null); // null = Todo
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'day', 'week'
  const [calendarView, setCalendarView] = useState(Views.MONTH);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, botRes, apptsRes] = await Promise.all([
        fetch('/api/crm/leads', { headers: authHeaders() }),
        fetch('/api/whatsapp/status', { headers: authHeaders() }),
        fetch('/api/appointments', { headers: authHeaders() })
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (data.success) setLeads(data.leads || []);
      }
      if (botRes.ok) {
        const data = await botRes.json();
        if (data.success) setBotStatus(data.status);
      }
      if (apptsRes.ok) {
        const data = await apptsRes.json();
        if (data.success) setAppointments(data.appointments || []);
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

  // Transformar citas para el calendario visual
  const calendarEvents = useMemo(() => {
    return appointments.map(appt => {
      let start = new Date(appt.fecha);
      let end = new Date(appt.fecha);
      if (appt.hora) {
        const [h, m] = appt.hora.split(':');
        start.setHours(parseInt(h, 10), parseInt(m, 10), 0);
        end.setHours(parseInt(h, 10) + 1, parseInt(m, 10), 0);
      }
      return {
        id: appt.id,
        title: `${appt.nombre} - ${appt.service_requested}`,
        start,
        end,
        resource: appt
      };
    });
  }, [appointments]);

  // Filtrado de Leads
  const filteredLeads = useMemo(() => {
    if (filterMode === 'all' || !selectedDate) return leads;
    return leads.filter(lead => {
      if (!lead.ultima_interaccion) return false;
      const leadDate = new Date(lead.ultima_interaccion);
      if (filterMode === 'day') return isSameDay(leadDate, selectedDate);
      if (filterMode === 'week') {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return isWithinInterval(leadDate, { start, end });
      }
      return true;
    });
  }, [leads, selectedDate, filterMode]);

  // Estadísticas calculadas localmente según el filtro
  const displayStats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    let totalAppointments = appointments.length;
    if (filterMode !== 'all' && selectedDate) {
      totalAppointments = appointments.filter(a => {
        const aDate = new Date(a.fecha);
        if (filterMode === 'day') return isSameDay(aDate, selectedDate);
        if (filterMode === 'week') {
          const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
          const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
          return isWithinInterval(aDate, { start, end });
        }
        return true;
      }).length;
    }
    return {
      leads: totalLeads,
      active: Math.round(totalLeads * 0.15),
      appointments: totalAppointments
    };
  }, [filteredLeads, appointments, selectedDate]);

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
      <div className="px-8 flex items-center justify-between mb-4">
        <div className="flex bg-[#152033]/60 border border-[#0099CC]/20 rounded-xl p-1 backdrop-blur-sm">
          <button 
            onClick={() => { setSelectedDate(new Date()); setFilterMode('day'); }} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filterMode === 'day' && selectedDate && isSameDay(selectedDate, new Date()) ? 'bg-[#0099CC] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => { setSelectedDate(new Date()); setFilterMode('week'); }} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filterMode === 'week' ? 'bg-[#0099CC] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => { setSelectedDate(null); setFilterMode('all'); }} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${filterMode === 'all' ? 'bg-[#0099CC] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            Todo el tiempo
          </button>
        </div>
        {filterMode !== 'all' && selectedDate && (
          <div className="text-xs text-[#0099CC] font-bold flex items-center gap-1">
            <Filter size={14} /> Filtro activo: {filterMode === 'week' ? `Semana del ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd MMM', { locale: es })}` : format(selectedDate, 'dd MMM yyyy', { locale: es })}
          </div>
        )}
      </div>

      <div className={`px-8 grid grid-cols-1 md:grid-cols-${location.pathname.includes('/agenda') ? '1' : '2'} gap-6 mb-8`}>
        {!location.pathname.includes('/agenda') && (
        <div 
          onClick={() => document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC] hover:bg-[#0099CC]/10 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0 group-hover:scale-110 transition-transform">
            <Users className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : displayStats.leads}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Leads Registrados</div>
          </div>
        </div>
        )}

        {location.pathname.includes('/agenda') && (
        <div 
          onClick={() => document.getElementById('agenda-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC] hover:bg-[#0099CC]/10 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0 group-hover:scale-110 transition-transform">
            <Calendar className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : displayStats.appointments}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Citas en Periodo</div>
          </div>
        </div>
        )}

        {!location.pathname.includes('/agenda') && (
        <div className="bg-[#152033]/60 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC]/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0">
            <Clock className="text-[#0099CC]" size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{loading ? '...' : displayStats.active}</div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Trámites Pendientes</div>
          </div>
        </div>
        )}
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        
        {/* Left Col: Agenda / Leads */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Citas / Agenda */}
          {location.pathname.includes('/agenda') && (
          <div id="agenda-section" className="bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0099CC]/10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <Calendar size={16} className="text-[#0099CC]" />
                Agenda de Citas
              </h2>
              <button onClick={fetchData} className="text-[#0099CC]/60 hover:text-[#0099CC] transition-colors">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="flex-1 custom-scrollbar">
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                view={calendarView}
                onView={setCalendarView}
                date={calendarDate}
                onNavigate={setCalendarDate}
                selectable={true}
                onSelectSlot={(slotInfo) => {
                  setSelectedDate(slotInfo.start);
                  setFilterMode('day');
                  document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                onSelectEvent={(event) => {
                  setSelectedDate(event.start);
                  setFilterMode('day');
                  document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                messages={{
                  next: "Sig",
                  previous: "Ant",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  date: "Fecha",
                  time: "Hora",
                  event: "Evento",
                  noEventsInRange: "No hay citas en este periodo."
                }}
                style={{ height: '400px', color: 'white' }}
                className="custom-calendar-theme text-xs"
              />
            </div>
          </div>
          )}

          {/* Lista de Leads */}
          {!location.pathname.includes('/agenda') && (
          <div id="leads-section" className="bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0099CC]/10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <MessageSquare size={16} className="text-[#0099CC]" />
                Actividad de Leads {filterMode === 'week' ? `(Semana del ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd MMM', { locale: es })})` : filterMode === 'day' && selectedDate ? `(${format(selectedDate, 'dd MMM', { locale: es })})` : ''}
              </h2>
              <button onClick={fetchData} className="text-[#0099CC]/60 hover:text-[#0099CC] transition-colors">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-white/20">Cargando leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/30 text-sm">
                {filterMode !== 'all' ? "No hay conversaciones registradas para este periodo." : "No hay prospectos registrados aún."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead, idx) => {
                  const phoneClean = lead.numero_contacto ? lead.numero_contacto.split('@')[0] : 'Desconocido';
                  
                  let contextText = 'Interacción iniciada';
                  if (lead.contexto_ia && typeof lead.contexto_ia === 'object') {
                    if (lead.contexto_ia.historial_mensajes && Array.isArray(lead.contexto_ia.historial_mensajes) && lead.contexto_ia.historial_mensajes.length > 0) {
                      const lastMsg = lead.contexto_ia.historial_mensajes[lead.contexto_ia.historial_mensajes.length - 1];
                      contextText = `Último msj: "${lastMsg.content || lastMsg.contenido || ''}"`;
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
        )}
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
                    const textoMensaje = msg.content || msg.contenido || '';
                    return (
                      <div key={i} className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isBot ? 'bg-[#152033] border border-[#0099CC]/20 text-white/90 rounded-tl-sm' : 'bg-[#0099CC] text-white rounded-tr-sm shadow-md'}`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50 flex items-center gap-1">
                            {isBot ? <><Bot size={10} /> Asistente IA</> : <><User size={10} /> Cliente</>}
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{textoMensaje}</p>
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
