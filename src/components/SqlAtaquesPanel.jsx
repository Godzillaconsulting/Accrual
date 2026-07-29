import React from 'react';
import { ShieldCheck, Lock, ShieldAlert, ExternalLink } from 'lucide-react';

export default function SqlAtaquesPanel() {
  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 bg-[#040508] text-white overflow-y-auto">
      <div className="mb-8 border-b border-[rgba(65,65,65,0.51)] pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
            <ShieldCheck size={24} className="text-[#00E5FF]" /> Red Protegida & WAF
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-medium">
            Seguridad perimetral y túnel cifrado enrutado a través de Cloudflare Zero Trust.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest">
            ESTADO: PROTEGIDO
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl p-6 rounded-2xl flex flex-col justify-center items-center hover:border-[#00E5FF]/40 transition-colors shadow-lg">
          <Lock size={40} className="text-[#00E5FF] mb-4 opacity-80" />
          <p className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider">Túnel Encriptado SSL/TLS</p>
          <p className="text-xs text-neutral-400 text-center max-w-sm leading-relaxed">
            Todo el tráfico hacia la Base de Datos y la API de Accrual está cifrado y filtrado en la capa de red.
          </p>
        </div>
        <div className="bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl p-6 rounded-2xl flex flex-col justify-center items-center hover:border-[#00E5FF]/40 transition-colors shadow-lg">
          <ShieldAlert size={40} className="text-[#00E5FF] mb-4 opacity-80" />
          <p className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider">Prevención de Inyecciones</p>
          <p className="text-xs text-neutral-400 text-center max-w-sm leading-relaxed">
            Los intentos de inyección SQL, manipulaciones XSS y ataques de denegación de servicio son mitigation-locked.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-[#08090C]/80 border border-[rgba(65,65,65,0.51)] backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
        <div className="p-4 border-b border-[rgba(65,65,65,0.51)] bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <p className="text-xs font-black text-[#00E5FF] tracking-widest uppercase">Tráfico Limpio Garantizado</p>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">ENCRIPTACIÓN 256-BIT</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <p className="text-neutral-400 text-xs font-medium uppercase tracking-widest max-w-md leading-relaxed">
            El sistema de protección perimetral no reporta amenazas o vulnerabilidades activas en el core.
          </p>
          <a
            href="https://dash.cloudflare.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF] text-[#040508] hover:bg-white rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            Cloudflare Dashboard <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
