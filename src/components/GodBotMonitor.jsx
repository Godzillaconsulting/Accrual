import React, { useState, useEffect, useCallback } from 'react';
import { Bot, RefreshCw, AlertCircle, Smartphone, Clock, MessageSquare, ShieldCheck, X, Ban } from 'lucide-react';
import BlackListPanel from './BlackListPanel';

// Todo proviene de la DB real.

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  };
}

function maskPhone(phone) {
  if (!phone || phone.length < 6) return phone || '—';
  return `${phone.slice(0, 2)}****${phone.slice(-4)}`;
}

export default function GodBotMonitor() {
  const [status, setStatus] = useState('DISCONNECTED');
  const [lastConnection, setLastConnection] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrNonce, setQrNonce] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'blacklist'

  // Estado del Modal de Historial
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, convRes] = await Promise.all([
        fetch('/api/whatsapp/status', { headers: authHeaders() }),
        fetch('/api/crm/conversations', { headers: authHeaders() })
      ]);

      if (!statusRes.ok) throw new Error(`Status HTTP ${statusRes.status}`);
      if (!convRes.ok) throw new Error(`Conversations HTTP ${convRes.status}`);

      const statusData = await statusRes.json();
      const convData = await convRes.json();

      if (statusData.success) {
        setStatus(statusData.status);
        setLastConnection(statusData.ultima_conexion);
      }
      if (convData.success) {
        setConversations(convData.conversations || []);
      }
    } catch (err) {
      console.warn('Bot monitor fetch failed:', err.message);
      setError(err.message);
      setStatus('DISCONNECTED');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const refreshQR = () => {
    setQrNonce(Date.now());
  };

  const openHistory = async (phone) => {
    setSelectedPhone(phone);
    setHistory([]);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/crm/conversations/${phone}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`History HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const closeHistory = () => {
    setSelectedPhone(null);
    setHistory([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-transparent">
      
      {/* ── Modal Historial de Conversación ── */}
      {selectedPhone && (
        <div className="fixed inset-0 z-[100] bg-[#0a0f1a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#152033] border border-[#00bcd4]/30 shadow-2xl rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-[#00bcd4]/20 bg-[#00bcd4]/5 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00bcd4]/20 flex items-center justify-center border border-[#00bcd4]/50">
                  <Smartphone className="text-[#00bcd4]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">
                    {selectedPhone}
                  </h3>
                  <p className="text-xs text-[#00bcd4]">Historial Completo</p>
                </div>
              </div>
              <button onClick={closeHistory} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
              {loadingHistory ? (
                <div className="h-full flex flex-col items-center justify-center text-[#00bcd4]/50">
                  <RefreshCw size={32} className="animate-spin mb-3" />
                  <p className="text-sm font-bold tracking-widest uppercase">Cargando mensajes...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No hay mensajes registrados.
                </div>
              ) : (
                history.map((msg, i) => {
                  const isInbound = msg.direccion === 'INBOUND';
                  return (
                    <div key={i} className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] p-4 rounded-2xl ${
                        isInbound 
                          ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-sm' 
                          : 'bg-[#00bcd4]/10 border border-[#00bcd4]/30 text-white rounded-tr-sm'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.contenido_mensaje}</div>
                        <div className={`text-[10px] mt-2 flex items-center gap-1 ${isInbound ? 'text-slate-500' : 'text-[#00bcd4]/70'}`}>
                          <Clock size={10} />
                          {new Date(msg.created_at).toLocaleString('es-MX')}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 px-6 py-5">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] border border-white/10">
              <Bot size={20} className="text-[#0099CC]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Bot Monitor</h1>
              <p className="text-xs text-neutral-500 font-medium">Monitoreo de estado y vinculación de WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#111111] border border-white/10 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'monitor' ? 'bg-[#0099CC] text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
              >
                <Bot size={14} className="inline mr-2" /> Monitor en Vivo
              </button>
              <button 
                onClick={() => setActiveTab('blacklist')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'blacklist' ? 'bg-red-600 text-white' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
              >
                <Ban size={14} className="inline mr-2" /> Números Bloqueados
              </button>
            </div>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white/70 transition-colors hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-40"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      {activeTab === 'monitor' ? (
      <main className="flex-1 mx-auto max-w-[1800px] w-full px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div
            className="p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden bg-[#0a0a0a]"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0099CC]/30 to-transparent" />
            
            <div className="relative mb-6">
              <div className={`absolute inset-0 rounded-full blur-xl ${status === 'CONNECTED' ? 'bg-green-500/20' : 'bg-red-500/20'}`} />
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center relative z-10 ${status === 'CONNECTED' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                <Smartphone size={40} className={status === 'CONNECTED' ? 'text-green-400' : 'text-red-400'} />
              </div>
            </div>

            <h2 className="text-lg font-black text-white tracking-widest uppercase mb-2">Conexión WhatsApp</h2>
            {status === 'CONNECTED' ? (
              <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-bold tracking-widest uppercase">
                Online / Activo
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <AlertCircle size={14} /> Desconectado
              </span>
            )}

            {lastConnection && (
              <p className="text-[10px] text-white/40 mt-3 font-semibold">
                Última conexión: {new Date(lastConnection).toLocaleString()}
              </p>
            )}
          </div>

          {/* QR Code Scan Area */}
          <div
            className="p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a]"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Escanear Vinculación</h3>
            {status === 'QR_READY' ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="relative p-2 bg-white rounded-xl shadow-lg border-2 border-cyan-500/30">
                  <img
                    src={`/api/whatsapp/qr?t=${qrNonce}`}
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <button
                  onClick={refreshQR}
                  className="px-4 py-1.5 rounded-lg bg-[#00bcd4]/10 text-xs font-bold text-[#00bcd4] border border-[#00bcd4]/30 hover:bg-[#00bcd4] hover:text-black transition-colors"
                >
                  Recargar QR
                </button>
              </div>
            ) : status === 'CONNECTED' ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-white/35">
                <ShieldCheck size={48} className="text-green-500/60 mb-3" />
                <p className="text-xs font-semibold max-w-[200px]">Dispositivo conectado y verificado. No se requiere vinculación.</p>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center text-white/35">
                <AlertCircle size={48} className="text-red-500/60 mb-3" />
                <p className="text-xs font-semibold max-w-[200px]">Bot desconectado o apagado. Espera a que el sistema arranque para vincular.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages Area */}
        <div className="md:col-span-2 flex flex-col">
          <div
            className="flex-1 rounded-xl border border-white/5 overflow-hidden flex flex-col h-[600px] bg-[#0a0a0a]"
          >
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare size={16} className="text-[#00bcd4]" />
                Conversaciones Recientes ({conversations.length})
                <span className="text-[10px] font-normal text-white/50 lowercase ml-2 normal-case">(Haz clic para ver el historial completo)</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <MessageSquare size={36} className="mb-2 opacity-50" />
                  <span className="text-xs">No hay conversaciones registradas aún.</span>
                </div>
              ) : (
                conversations.map((conv, idx) => (
                  <div
                    key={idx}
                    onClick={() => openHistory(conv.phone)}
                    className="bg-[#152033]/40 p-4 rounded-xl border border-white/5 hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white text-sm group-hover:text-[#00bcd4] transition-colors">{maskPhone(conv.phone)}</span>
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(conv.created_at || conv.lastMessageAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 line-clamp-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase mr-2 ${
                          conv.direccion === 'INBOUND'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {conv.direccion === 'INBOUND' ? 'Cliente' : 'Bot'}
                      </span>
                      {conv.last_message || conv.preview}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      ) : null}
    </div>
  );
}
