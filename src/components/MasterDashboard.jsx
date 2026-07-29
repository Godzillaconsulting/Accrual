import React, { useState, useEffect } from 'react';
import { Activity, Users, Calendar, ShieldCheck, ArrowRight, Bot, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MasterDashboard({ adminProfile }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    botStatus: 'CONNECTED',
    leadsActivos: 0,
    citasSemana: 0,
    ataquesBloqueados: 0,
    loading: true
  });

  useEffect(() => {
    // Simulando fetch de dashboard global, luego se puede conectar a endpoints reales
    setTimeout(() => {
      setStats({
        botStatus: 'CONNECTED',
        leadsActivos: 16,
        citasSemana: 2,
        ataquesBloqueados: 4,
        loading: false
      });
    }, 800);
  }, []);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="h-full w-full flex flex-col bg-transparent overflow-y-auto custom-scrollbar p-8">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2">
          {greeting}, {adminProfile?.username || 'GodZilla'}
        </h1>
        <p className="text-[var(--accent-cyan)] mt-2 font-semibold tracking-wider text-sm">
          Este es el resumen de operaciones de tu firma al día de hoy.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        
        {/* Bot Status */}
        <div 
          onClick={() => navigate('/admin/bot')}
          className="bg-[var(--bg-card)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 flex flex-col justify-between hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer group h-36"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform">
              <Bot className="text-green-400" size={20} />
            </div>
            {stats.botStatus === 'CONNECTED' && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-black text-white mt-4">{stats.loading ? '...' : 'Online'}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Salud del Bot</div>
          </div>
        </div>

        {/* Leads Activos */}
        <div 
          onClick={() => navigate('/admin/crm')}
          className="bg-[var(--bg-card)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 flex flex-col justify-between hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0099CC]/10 flex items-center justify-center border border-[#0099CC]/30 group-hover:scale-110 transition-transform">
            <Users className="text-[#0099CC]" size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-white mt-4 flex items-center gap-2">
              {stats.loading ? '...' : stats.leadsActivos}
              {!stats.loading && <TrendingUp size={16} className="text-green-400" />}
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Leads Registrados</div>
          </div>
        </div>

        {/* Citas Semana */}
        <div 
          onClick={() => navigate('/admin/agenda')}
          className="bg-[var(--bg-card)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 flex flex-col justify-between hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/30 group-hover:scale-110 transition-transform">
            <Calendar className="text-orange-400" size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-white mt-4">{stats.loading ? '...' : stats.citasSemana}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Citas esta semana</div>
          </div>
        </div>

        {/* Seguridad */}
        <div 
          onClick={() => navigate('/admin/sql')}
          className="bg-[var(--bg-card)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 flex flex-col justify-between hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-purple-400" size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-white mt-4">{stats.loading ? '...' : stats.ataquesBloqueados}</div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Ataques Bloqueados</div>
          </div>
        </div>

      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        
        {/* Quick Links */}
        <div className="lg:col-span-1 bg-[var(--bg-surface)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity size={16} className="text-[var(--accent-cyan)]" />
            Accesos Rápidos
          </h2>
          <div className="space-y-3 flex-1">
            <button onClick={() => navigate('/admin/master')} className="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-[#0099CC]/30 hover:bg-[#0099CC]/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0099CC]/10 flex items-center justify-center text-[#0099CC]"><Clock size={16} /></div>
                <span className="text-sm font-bold text-white">Editar Página Web</span>
              </div>
              <ArrowRight size={16} className="text-white/30 group-hover:text-[#0099CC] transition-colors" />
            </button>
            <button onClick={() => navigate('/admin/crm')} className="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-[#0099CC]/30 hover:bg-[#0099CC]/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><Users size={16} /></div>
                <span className="text-sm font-bold text-white">Ver Nuevos Leads</span>
              </div>
              <ArrowRight size={16} className="text-white/30 group-hover:text-green-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* System Logs / Info */}
        <div className="lg:col-span-2 bg-[var(--bg-surface)] border-[0.1px] border-[rgba(65,65,65,0.51)] backdrop-blur-sm rounded-[calc(var(--fs)*0.875)] p-6 h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[var(--accent-cyan)]" />
            Estado del Sistema
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck size={32} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Todos los sistemas operativos</h3>
            <p className="text-sm text-white/50 max-w-sm">
              La IA, el bot de WhatsApp y la base de datos están corriendo sin problemas. No hay alertas críticas de seguridad pendientes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
