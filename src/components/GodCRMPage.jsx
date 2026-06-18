import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Calendar as CalendarIcon, ChartBar, AlertCircle, Bot, X, MessageSquare, ChevronRight, Phone, Send, Clock, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, endOfWeek, getDay, isSameDay, isWithinInterval } from 'date-fns';
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

const STAGES = [
  { id: 'NUEVO', label: 'Nuevos', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'SEGUIMIENTO', label: 'Seguimiento', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'CITA', label: 'Cita Agendada', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'GANADO', label: 'Ganados', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
];

export default function GodCRMPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('crm'); // 'crm', 'agenda', 'stats'
  
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [botStatus, setBotStatus] = useState('DISCONNECTED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de fecha
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  // Chat Offcanvas
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadMessages, setLeadMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Calendario
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
    const interval = setInterval(fetchData, 60000);
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

  const updateLeadStage = async (phone, newStage) => {
    try {
      const cleanPhone = phone.split('@')[0];
      const res = await fetch(`/api/crm/leads/${cleanPhone}/stage`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ etapa_embudo: newStage })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.numero_contacto === phone ? { ...l, etapa_embudo: newStage } : l));
        if (selectedLead && selectedLead.numero_contacto === phone) {
            setSelectedLead({ ...selectedLead, etapa_embudo: newStage });
        }
      }
    } catch(e) {
      console.error("Error updating stage", e);
    }
  };

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

  return (
    <div className="h-full w-full flex bg-[#0A0F1C] overflow-hidden text-white font-sans relative">
      
      {/* Contenido Principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedLead ? 'pr-[400px]' : ''}`}>
        
        {/* Header Superior */}
        <div className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between border-b border-white/5 bg-[#152033]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Accrual CRM
              </h1>
              <p className="text-sm text-[#0099CC] mt-1 font-semibold tracking-wider">
                Pipeline y seguimiento de ventas
              </p>
            </div>
            
            {/* Badge Status Bot */}
            <div className={`ml-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 border ${botStatus === 'CONNECTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
               <Bot size={12} />
               {botStatus === 'CONNECTED' ? 'Bot En Línea' : 'Bot Offline'}
            </div>
          </div>

          <div className="flex bg-[#111111] border border-white/10 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('crm')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'crm' ? 'bg-[#0099CC] text-white shadow-lg shadow-[#0099CC]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            >
              <Users size={14} className="inline mr-2" /> Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('agenda')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'agenda' ? 'bg-[#0099CC] text-white shadow-lg shadow-[#0099CC]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            >
              <CalendarIcon size={14} className="inline mr-2" /> Agenda
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-[#0099CC] text-white shadow-lg shadow-[#0099CC]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            >
              <ChartBar size={14} className="inline mr-2" /> Stats
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            <AlertCircle size={16} />
            <span>Error: {error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* TAB: PIPELINE / KANBAN */}
          {activeTab === 'crm' && (
            <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
              {STAGES.map(stage => {
                // Si la etapa_embudo es null o vacía, se considera 'NUEVO'
                const stageLeads = filteredLeads.filter(l => {
                    const lStage = l.etapa_embudo || 'NUEVO';
                    return lStage === stage.id;
                });

                return (
                  <div key={stage.id} className="flex-none w-[320px] flex flex-col bg-[#152033]/30 rounded-2xl border border-white/5 overflow-hidden h-full">
                    <div className={`p-4 border-b flex justify-between items-center ${stage.color}`}>
                      <h3 className="font-bold text-sm tracking-wide uppercase">{stage.label}</h3>
                      <span className="text-xs font-bold bg-black/20 px-2 py-1 rounded-md">{stageLeads.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                      {stageLeads.length === 0 ? (
                        <div className="text-center text-white/20 text-xs py-8 font-medium">Vacío</div>
                      ) : (
                        stageLeads.map((lead, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedLead(lead)}
                            className="bg-[#1C2842] border border-white/5 p-4 rounded-xl hover:border-[#0099CC]/50 cursor-pointer transition-all shadow-lg hover:shadow-[#0099CC]/10 group relative"
                          >
                            <div className="flex items-start justify-between mb-2">
                                <div className="font-bold text-sm text-white truncate max-w-[200px]">
                                  {lead.numero_contacto.split('@')[0]}
                                </div>
                                <MessageSquare size={14} className="text-[#0099CC] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            <div className="flex items-center gap-1 text-[10px] text-white/40 mb-3">
                                <Clock size={10} />
                                {format(new Date(lead.ultima_interaccion), "d MMM, hh:mm a", { locale: es })}
                            </div>

                            {/* Acciones Rápidas para Mover */}
                            <div className="pt-3 border-t border-white/5 flex gap-1 justify-between" onClick={e => e.stopPropagation()}>
                                <select 
                                    className="bg-black/20 text-xs text-white/70 border border-white/10 rounded px-2 py-1 outline-none w-full appearance-none cursor-pointer hover:bg-black/40"
                                    value={lead.etapa_embudo || 'NUEVO'}
                                    onChange={(e) => updateLeadStage(lead.numero_contacto, e.target.value)}
                                >
                                    {STAGES.map(s => <option key={s.id} value={s.id} className="bg-[#1C2842] text-white">{s.label}</option>)}
                                </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="h-full bg-[#152033]/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%', color: 'white' }}
                  view={calendarView}
                  onView={setCalendarView}
                  date={calendarDate}
                  onNavigate={setCalendarDate}
                  messages={{
                    next: "Sig",
                    previous: "Ant",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día"
                  }}
                  className="custom-calendar-dark"
                />
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
             <div className="h-full">
                <GodStatsPage />
             </div>
          )}

        </div>
      </div>

      {/* ── OFFCANVAS CHAT PANEL (Estilo WhatsApp) ── */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#0A0F1C] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedLead ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedLead && (
        <>
            {/* Cabecera del Chat */}
            <div className="h-[70px] bg-[#1C2842] border-b border-white/5 flex items-center justify-between px-6 shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0099CC] to-blue-600 flex items-center justify-center shadow-inner">
                        <User size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-white tracking-wide">
                            {selectedLead.numero_contacto.split('@')[0]}
                        </div>
                        <div className="text-[10px] text-[#0099CC] font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {selectedLead.etapa_embudo || 'NUEVO'}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setSelectedLead(null)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors text-white/50"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Contenedor de Mensajes (El WhatsApp) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0A0F1C] custom-scrollbar flex flex-col gap-4 relative">
                {/* Fondo tipo WhatsApp web (opcional si tienes patrón, aquí usamos un color sólido oscuro) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url(https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)', backgroundSize: 'cover' }}></div>
                
                <div className="flex justify-center mb-4">
                    <div className="bg-[#1C2842] text-white/40 text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider font-bold">
                        Inicio de la conversación
                    </div>
                </div>

                {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099CC]"></div>
                    </div>
                ) : leadMessages.length === 0 ? (
                    <div className="text-center text-white/30 text-xs mt-10">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                        No hay mensajes registrados
                    </div>
                ) : (
                    leadMessages.map((msg, idx) => {
                        const isBot = msg.role === 'assistant';
                        return (
                            <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'} z-10`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${isBot ? 'bg-[#1C2842] text-white rounded-tl-sm' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-sm'}`}>
                                    <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                                        {msg.contenido}
                                    </div>
                                    <div className={`text-[9px] mt-2 flex items-center gap-1 ${isBot ? 'text-white/30 justify-start' : 'text-white/40 justify-end'}`}>
                                        {isBot ? <Bot size={10} /> : <User size={10} />}
                                        {isBot ? 'Bot Accrual' : 'Cliente'}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Fake (Opcional visual) */}
            <div className="h-[60px] bg-[#1C2842] shrink-0 border-t border-white/5 flex items-center px-4 gap-3">
                <div className="flex-1 bg-[#2A3958] rounded-full h-10 px-4 flex items-center text-white/30 text-xs">
                    El Bot está gestionando esta conversación...
                </div>
                <button className="w-10 h-10 rounded-full bg-[#0099CC]/20 flex items-center justify-center text-[#0099CC] opacity-50 cursor-not-allowed">
                    <Send size={16} />
                </button>
            </div>
        </>
        )}
      </div>

    </div>
  );
}
