import React from 'react';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

export default function SqlAtaquesPanel() {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#152033] text-blue-500 font-mono overflow-y-auto">
      <div className="mb-6 flex justify-between items-end border-b border-blue-900/50 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-widest text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center gap-2">
            <span className="animate-pulse"><ShieldCheck size={28} /></span> RED PROTEGIDA
          </h2>
          <p className="text-xs text-blue-400 mt-1 uppercase tracking-widest">WAF Delegado a Cloudflare Zero Trust</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-900/40 border border-emerald-500/50 rounded text-xs font-bold text-emerald-400">ESTADO: SEGURO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-neutral-900 border border-emerald-900/50 p-6 rounded-xl flex flex-col justify-center items-center shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
          <Lock size={48} className="text-emerald-500 mb-4 opacity-50" />
          <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Túnel Encriptado</p>
          <p className="text-xs text-blue-400 text-center max-w-sm">
            Todo el tráfico hacia la Base de Datos y la API está siendo filtrado por Cloudflare Zero Trust en la capa de red exterior.
          </p>
        </div>
        <div className="bg-neutral-900 border border-emerald-900/50 p-6 rounded-xl flex flex-col justify-center items-center shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
          <ShieldAlert size={48} className="text-blue-500 mb-4 opacity-50" />
           <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Prevención de Inyecciones</p>
          <p className="text-xs text-blue-400 text-center max-w-sm">
            Los intentos de inyección SQL, XSS y ataques DDoS son bloqueados automáticamente antes de alcanzar este servidor.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-[#152033]/60 border border-blue-900/30 rounded-xl overflow-hidden flex flex-col relative min-h-[300px]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
        <div className="p-3 border-b border-blue-900/50 bg-blue-900/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-bold text-emerald-500 tracking-widest">TRÁFICO LIMPIO GARANTIZADO</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <p className="text-neutral-500 text-sm italic font-medium uppercase tracking-widest text-center">
            El sistema de protección perimetral no reporta amenazas internas. <br/>Para ver el registro detallado de IPs bloqueadas, consulta tu panel de Cloudflare.
          </p>
          <a href="https://dash.cloudflare.com/" target="_blank" rel="noreferrer" className="px-4 py-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded font-bold text-xs uppercase tracking-widest transition-colors">
            Ir a Cloudflare Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
