import React, { useState, useEffect } from 'react';
import { User, Lock, Unlock, Ban, Smartphone, RefreshCw, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

const API_BASE = '';

export default function BlackListPanel({ adminProfile }) {
    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPhone, setNewPhone] = useState('');
    const [newReason, setNewReason] = useState('');
    const [error, setError] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [qrTime, setQrTime] = useState(Date.now());
    const [botStatus, setBotStatus] = useState({ status: 'DISCONNECTED', ultima_conexion: null });

    const token = localStorage.getItem('adminToken');

    const handleUnlock = async () => {
        const pass = prompt('Ingresa la Contraseña Maestra (adrianaccrual) para ver los números completos:');
        if (!pass) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/whatsapp/blacklist/verify-master`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ masterPass: pass })
            });
            const data = await res.json();
            if (data.success) {
                setIsUnlocked(true);
            } else {
                alert('Contraseña incorrecta. Se ha registrado el intento en los logs de seguridad.');
            }
        } catch (e) {
            alert('Error de conexión');
        }
        setLoading(false);
    };

    const fetchBotStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/whatsapp/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBotStatus({ status: data.status, ultima_conexion: data.ultima_conexion });
            }
        } catch (e) {
            console.error('Error fetching bot status', e);
        }
    };

    const fetchBlacklist = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/whatsapp/blacklist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBlacklist(data.blacklist || []);
            } else {
                setError(data.error || 'Error fetching blacklist');
            }
        } catch (e) {
            console.error('Error fetching blacklist', e);
            setError('Connection error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlacklist();
        fetchBotStatus();
        
        const qrInterval = setInterval(() => {
            setQrTime(Date.now());
            fetchBotStatus();
        }, 60000);
        
        return () => clearInterval(qrInterval);
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newPhone.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/whatsapp/blacklist`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ phone_number: newPhone, reason: newReason })
            });
            const data = await res.json();
            if (data.success) {
                setNewPhone('');
                setNewReason('');
                fetchBlacklist();
            } else {
                alert(data.error || 'Error adding to blacklist');
            }
        } catch (e) {
            alert('Connection error');
        }
        setLoading(false);
    };

    const handleDelete = async (phone) => {
        if (!window.confirm(`¿Seguro que quieres quitar ${phone} de la lista negra?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/whatsapp/blacklist/${encodeURIComponent(phone)}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            const data = await res.json();
            if (data.success) {
                fetchBlacklist();
            } else {
                alert(data.error || 'Error removing from blacklist');
            }
        } catch (e) {
            alert('Connection error');
        }
        setLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col p-6 md:p-10 bg-[#0a0a0a] text-white overflow-y-auto">
            <div className="mb-8 border-b border-white/5 pb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Ban size={24} className="text-[#0099CC]" /> Black List
                    </h2>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">Gestión de números bloqueados para el Bot de WhatsApp.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form to add */}
                <div className="col-span-1">
                    <form onSubmit={handleAdd} className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-white mb-4 uppercase tracking-widest text-[10px]">Bloquear Número</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-neutral-500 font-semibold uppercase mb-2">Teléfono (con código de país)</label>
                                <input 
                                    type="text" 
                                    value={newPhone} 
                                    onChange={e => setNewPhone(e.target.value)} 
                                    placeholder="ej. 5216641234567" 
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-lg p-2.5 text-xs focus:border-[#0099CC] outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-neutral-500 font-semibold uppercase mb-2">Motivo (Opcional)</label>
                                <input 
                                    type="text" 
                                    value={newReason} 
                                    onChange={e => setNewReason(e.target.value)} 
                                    placeholder="ej. Spam continuo" 
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-lg p-2.5 text-xs focus:border-[#0099CC] outline-none transition-colors"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-[#0099CC]/10 text-[#0099CC] border border-[#0099CC]/30 hover:bg-[#0099CC] hover:text-white font-semibold py-2.5 rounded-lg transition-colors text-xs">
                                Añadir a la Lista
                            </button>
                        </div>
                    </form>
                    
{/* Tarjeta de Conexión de WhatsApp */}
                    <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-sm mt-6">
                        <h3 className="font-semibold text-white mb-4 tracking-widest uppercase text-[10px] flex items-center justify-between">
                            <span className="flex items-center gap-2"><Smartphone size={14} className="text-[#0099CC]"/> Conexión WhatsApp</span>
                            {botStatus.status === 'CONNECTED' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                    CONECTADO
                                </span>
                            ) : botStatus.status === 'QR_READY' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    QR LISTO
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                    DESCONECTADO
                                </span>
                            )}
                        </h3>

                        {botStatus.status === 'CONNECTED' ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] rounded-lg border border-white/5 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-3 border border-green-500/20">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="text-xs font-semibold text-green-400 tracking-wider">Bot en Línea</h4>
                                <p className="text-[10px] text-neutral-500 mt-2 max-w-xs font-medium">
                                    La Neurona WhatsApp está vinculada y operando correctamente en segundo plano.
                                </p>
                                {botStatus.ultima_conexion && (
                                    <span className="text-[9px] text-neutral-500 mt-3 font-semibold">
                                        Última Actividad: {new Date(botStatus.ultima_conexion).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        ) : botStatus.status === 'QR_READY' ? (
                            <div className="flex flex-col items-center">
                                <p className="text-[10px] text-neutral-500 mb-4 text-center font-medium">
                                    Escanea este código QR desde tu celular para conectar el Bot de WhatsApp.
                                </p>
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-700 w-full max-w-[210px] aspect-square">
                                    <img 
                                        src={`${API_BASE}/api/whatsapp/qr?t=${qrTime}`} 
                                        alt="Código QR de WhatsApp"
                                        className="w-48 h-48 object-contain"
                                        onError={(e) => { 
                                            e.target.style.display = 'none'; 
                                            e.target.nextSibling.style.display = 'block'; 
                                        }}
                                        onLoad={(e) => {
                                            e.target.style.display = 'block'; 
                                            e.target.nextSibling.style.display = 'none'; 
                                        }}
                                    />
                                    <div className="hidden text-neutral-500 text-xs text-center p-8">
                                        Cargando QR...
                                    </div>
                                </div>
                                <div className="text-[9px] text-neutral-500 mt-3 text-center flex items-center gap-1 font-semibold">
                                    <RefreshCw size={10} className="animate-spin" /> Sincronizando QR en tiempo real
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] rounded-lg border border-white/5 text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3 border border-red-500/20">
                                    <AlertCircle size={24} />
                                </div>
                                <h4 className="text-xs font-semibold text-red-400 tracking-wider">Sesión Inactiva</h4>
                                <p className="text-[10px] text-neutral-500 mt-2 max-w-xs font-medium">
                                    El bot de WhatsApp está desconectado o el contenedor se está reiniciando. Por favor, espera unos segundos.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between">
                            <h3 className="text-[10px] font-semibold text-white tracking-widest uppercase flex items-center gap-2">
                                Números Bloqueados 
                                {!isUnlocked ? (
                                    <button onClick={handleUnlock} className="ml-3 text-[9px] bg-[#0a0a0a] hover:bg-white/10 text-neutral-400 px-2 py-1 rounded border border-white/5 flex items-center gap-1 transition-colors">
                                        <Lock size={10} /> Desbloquear Vista
                                    </button>
                                ) : (
                                    <span className="ml-3 text-[9px] bg-white/10 text-white px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                                        <Unlock size={10} /> Vista Desbloqueada
                                    </span>
                                )}
                            </h3>
                            <div className="text-[9px] font-semibold text-neutral-500 bg-[#0a0a0a] border border-white/5 px-2.5 py-1 rounded-full">{blacklist.length} Registros</div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {loading && blacklist.length === 0 ? (
                                <p className="p-8 text-neutral-500 text-center font-bold tracking-widest uppercase text-sm">Cargando...</p>
                            ) : error ? (
                                <p className="p-8 text-red-500 text-center font-bold">{error}</p>
                            ) : blacklist.length === 0 ? (
                                <p className="p-8 text-neutral-500 text-center text-sm font-bold tracking-widest uppercase">No hay números bloqueados.</p>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#0a0a0a] text-[9px] text-neutral-500 uppercase font-semibold tracking-widest border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                                            <th className="px-6 py-4 font-semibold">Motivo</th>
                                            <th className="px-6 py-4 font-semibold">Agregado</th>
                                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {blacklist.map(item => {
                                            const rawPhone = item.phone_number.split('@')[0];
                                            const maskedPhone = isUnlocked ? rawPhone : `(•••) ••• •${rawPhone.slice(-4)}`;
                                            return (
                                                <tr key={item.phone_number} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-neutral-500 group-hover:border-[#0099CC]/50 transition-colors">
                                                                <User size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-white font-semibold">{item.reason || 'Desconocido'}</span>
                                                                <span className="text-[10px] text-neutral-500 font-mono tracking-wider">{maskedPhone}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-500 text-[10px] hidden md:table-cell">{item.reason || 'Spam'}</td>
                                                    <td className="px-6 py-4 text-neutral-500 text-[10px]">{new Date(item.added_at).toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDelete(item.phone_number)}
                                                            className="px-3 py-1.5 bg-transparent text-neutral-400 border border-white/10 rounded-lg text-[10px] font-semibold hover:bg-white hover:text-black transition-colors"
                                                        >
                                                            Desbloquear
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
