import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Calendar, Clock, Bot, RefreshCw, MessageSquare, AlertCircle, ChevronRight, User, X, Filter, ChartBar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, endOfWeek, getDay, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import GodStatsPage from './GodStatsPage';

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
  const [leadMessages, setLeadMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [botStatus, setBotStatus] = useState('DISCONNECTED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de fecha
  const [selectedDate, setSelectedDate] = useState(null); // null = Todo
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'day', 'week'
  const [activeTab, setActiveTab] = useState('crm'); // 'crm' | 'stats'
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

  useEffect(() => {
    if (!selectedLead) {
      setLeadMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const phone = selectedLead.numero_contacto.split('@')[0];
        const res = await fetch(`/api/crm/leads/${phone}/messages`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
          setLeadMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Error fetching messages", err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedLead]);

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
      <div className="px-8 pt-8 pb-4 shrink-0 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Hola, GodZilla
            </h1>
            <p className="text-sm text-[#00E5FF] mt-1 font-semibold tracking-wider">
              Resumen de prospectos y operaciones de la firma
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border shadow-lg cursor-pointer hover:opacity-80 transition-opacity ${botStatus === 'CONNECTED' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/10' : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10'}`} onClick={() => navigate('/admin/bot')} title="Ir al panel del Bot">
            <Bot size={12} />
            {botStatus === 'CONNECTED' ? 'Bot Online' : 'Bot Offline'}
            {botStatus === 'CONNECTED' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"></span>}
          </div>
        </div>
        {!location.pathname.includes('/agenda') && (
        <div className="flex bg-[#111111] border border-[#0099CC]/30 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-[#0099CC] text-white' : 'text-neutral-500 hover:text-white hover:bg-[#0099CC]/10'}`}
          >
            <Users size={14} className="inline mr-2" /> CRM / Leads
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-[#0099CC] text-white' : 'text-neutral-500 hover:text-white hover:bg-[#0099CC]/10'}`}
          >
            <ChartBar size={14} className="inline mr-2" /> Estadísticas
          </button>
        </div>
        )}
      </div>

      {error && (
        <div className="mx-8 mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          <AlertCircle size={16} />
          <span>Error conectando a la base de datos: {error}</span>
        </div>
      )}

      {/* ── Top Stats Row ────────────────────────────────────────────── */}
      {activeTab === 'crm' ? (
      <>
      <div className="px-8 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] rounded-2xl p-2 backdrop-blur-xl">
          <button 
            onClick={() => { setSelectedDate(new Date()); setFilterMode('day'); }} 
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterMode === 'day' && selectedDate && isSameDay(selectedDate, new Date()) ? 'bg-[#00E5FF] text-[#040508] shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
          >
            Hoy
          </button>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Filtrar Día</span>
              <input 
                type="date"
                style={{ colorScheme: 'dark' }}
                className={`bg-[#040508] border border-white/10 text-xs outline-none cursor-pointer px-3 py-1.5 rounded-lg transition-all ${filterMode === 'day' && selectedDate && !isSameDay(selectedDate, new Date()) ? 'text-[#00E5FF] border-[#00E5FF]/40' : 'text-neutral-300 hover:border-white/20'}`}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value + 'T12:00:00'));
                    setFilterMode('day');
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Filtrar Semana</span>
              <input 
                type="week"
                style={{ colorScheme: 'dark' }}
                className={`bg-[#040508] border border-white/10 text-xs outline-none cursor-pointer px-3 py-1.5 rounded-lg transition-all ${filterMode === 'week' ? 'text-[#00E5FF] border-[#00E5FF]/40' : 'text-neutral-300 hover:border-white/20'}`}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, week] = e.target.value.split('-W');
                    const simple = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
                    setSelectedDate(simple);
                    setFilterMode('week');
                  }
                }}
              />
            </div>
          </div>

          <button 
            onClick={() => setFilterMode('all')} 
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${filterMode === 'all' ? 'bg-[#00E5FF] text-[#040508] border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-transparent text-neutral-400 border-white/10 hover:text-white hover:bg-white/5'}`}
          >
            Todo el Tiempo
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
          className="bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC] hover:bg-[#0099CC]/10 transition-all cursor-pointer group"
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
          className="bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC] hover:bg-[#0099CC]/10 transition-all cursor-pointer group"
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
        <div 
          onClick={() => document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 hover:border-[#0099CC]/50 transition-colors cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 shrink-0 group-hover:scale-110 transition-transform">
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
      <div className="px-8 flex flex-col gap-6 pb-12">
        
        {/* Left Col: Agenda / Leads */}
        <div className="w-full space-y-6 flex flex-col">
          
          {/* Citas / Agenda */}
          {location.pathname.includes('/agenda') && (
          <div id="agenda-section" className="bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col h-[650px]">
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
          <div id="leads-section" className="bg-[#152033]/40 border border-[#0099CC]/20 backdrop-blur-sm rounded-2xl p-6 flex flex-col h-[650px]">
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
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedLead(lead)}
                      className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-[#0099CC]/30 hover:bg-[#0099CC]/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0099CC]/10 flex items-center justify-center text-[#0099CC] border border-[#0099CC]/20 shrink-0 group-hover:scale-110 transition-transform">
                          <User size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate group-hover:text-[#0099CC] transition-colors">{phoneClean}</div>
                          <div className="text-[11px] text-[#0099CC] truncate uppercase tracking-widest font-bold flex items-center gap-1">
                            <MessageSquare size={10} />
                            Ver mensajes
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] text-white/30 font-mono tracking-widest">{lead.ultima_interaccion ? new Date(lead.ultima_interaccion).toLocaleDateString('es-MX', {day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'}) : 'Reciente'}</span>
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


      </div>

      {/* Modal de Detalles del Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#152033] border border-[#0099CC]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#0099CC]/20 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0099CC]/20 flex items-center justify-center text-[#0099CC] border border-[#0099CC]/30 shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLead.numero_contacto ? selectedLead.numero_contacto.split('@')[0] : 'Desconocido'}</h3>
                  <p className="text-xs text-[#0099CC] font-bold uppercase tracking-widest">
                    PROSPECTO
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Chat History) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0a0f18] custom-scrollbar">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-[#0099CC] space-y-4">
                  <RefreshCw size={32} className="animate-spin opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Cargando mensajes...</p>
                </div>
              ) : leadMessages.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <span className="bg-[#152033] text-white/40 text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">Inicio de la conversación</span>
                  </div>
                  {leadMessages.map((msg, i) => {
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
      {/* End Modal */}

      </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <GodStatsPage />
        </div>
      )}
    </div>
  );
}
