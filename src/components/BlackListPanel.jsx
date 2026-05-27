import React, { useState, useEffect } from 'react';
import { User, Lock, Unlock } from 'lucide-react';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

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
            <div className="mb-8 border-b border-red-500/30 pb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-widest text-red-500 flex items-center gap-3">
                        <span>🛡️</span> BLACK LIST
                    </h2>
                    <p className="text-sm text-neutral-400 mt-2">Gestión de números bloqueados para el Bot de WhatsApp.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form to add */}
                <div className="col-span-1">
                    <form onSubmit={handleAdd} className="bg-[#152033] border border-red-500/40 rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-red-400 mb-4 tracking-widest uppercase text-sm">Bloquear Número</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] text-neutral-400 font-bold uppercase mb-1">Teléfono (con código de país)</label>
                                <input 
                                    type="text" 
                                    value={newPhone} 
                                    onChange={e => setNewPhone(e.target.value)} 
                                    placeholder="ej. 5216641234567" 
                                    className="w-full bg-[#0a0a0a] border border-neutral-700 text-white rounded p-2.5 text-sm focus:border-red-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-neutral-400 font-bold uppercase mb-1">Motivo (Opcional)</label>
                                <input 
                                    type="text" 
                                    value={newReason} 
                                    onChange={e => setNewReason(e.target.value)} 
                                    placeholder="ej. Spam continuo" 
                                    className="w-full bg-[#0a0a0a] border border-neutral-700 text-white rounded p-2.5 text-sm focus:border-red-500 outline-none"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white font-bold py-2.5 rounded transition-colors text-sm">
                                Añadir a la Lista
                            </button>
                        </div>
                    </form>
                    
{/* Tarjeta de Conexión de WhatsApp */}
                    <div className="bg-[#152033] border border-neutral-800 rounded-xl p-6 shadow-lg mt-6">
                        <h3 className="font-bold text-gray-300 mb-4 tracking-widest uppercase text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">📲 Conexión WhatsApp</span>
                            {botStatus.status === 'CONNECTED' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                                    🟢 CONECTADO
                                </span>
                            ) : botStatus.status === 'QR_READY' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                    🟡 QR LISTO
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                    🔴 DESCONECTADO
                                </span>
                            )}
                        </h3>

                        {botStatus.status === 'CONNECTED' ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-green-500/5 rounded-lg border border-green-500/20 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-3 border border-green-500/30">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider">Bot en Línea</h4>
                                <p className="text-xs text-neutral-300 mt-2 max-w-xs">
                                    La Neurona WhatsApp está vinculada y operando correctamente en segundo plano.
                                </p>
                                {botStatus.ultima_conexion && (
                                    <span className="text-[10px] text-neutral-400 mt-3 bg-neutral-900/60 px-2 py-1 rounded">
                                        Última Actividad: {new Date(botStatus.ultima_conexion).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        ) : botStatus.status === 'QR_READY' ? (
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-neutral-400 mb-4 text-center">
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
                                <div className="text-[10px] text-neutral-500 mt-3 text-center animate-pulse">
                                    🔄 Sincronizando QR en tiempo real (5s)
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 bg-red-500/5 rounded-lg border border-red-500/20 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3 border border-red-500/30 animate-pulse">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">Sesión Inactiva</h4>
                                <p className="text-xs text-neutral-300 mt-2 max-w-xs">
                                    El bot de WhatsApp está desconectado o el contenedor se está reiniciando. Por favor, espera unos segundos.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-[#152033] border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                        <div className="px-6 py-4 border-b border-neutral-800 bg-[#0d0d0d] flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-300 tracking-widest uppercase flex items-center gap-2">
                                Números Bloqueados 
                                {!isUnlocked ? (
                                    <button onClick={handleUnlock} className="ml-3 text-[10px] bg-red-500/10 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                        <Lock size={12} /> Desbloquear Vista
                                    </button>
                                ) : (
                                    <span className="ml-3 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded flex items-center gap-1">
                                        <Unlock size={12} /> Vista Desbloqueada
                                    </span>
                                )}
                            </h3>
                            <div className="text-[10px] font-bold text-neutral-500 bg-neutral-800/50 px-2.5 py-1 rounded-full">{blacklist.length} Registros</div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {loading && blacklist.length === 0 ? (
                                <p className="p-8 text-neutral-500 text-center font-bold tracking-widest uppercase text-sm">Cargando...</p>
                            ) : error ? (
                                <p className="p-8 text-red-500 text-center font-bold">{error}</p>
                            ) : blacklist.length === 0 ? (
                                <p className="p-8 text-neutral-500 text-center text-sm font-bold tracking-widest uppercase">No hay números bloqueados.</p>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#0a0a0a] text-[10px] text-neutral-500 uppercase font-black tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Teléfono</th>
                                            <th className="px-6 py-4">Motivo</th>
                                            <th className="px-6 py-4">Agregado</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/60 font-medium">
                                        {blacklist.map(item => {
                                            const rawPhone = item.phone_number.split('@')[0];
                                            const maskedPhone = isUnlocked ? rawPhone : `(•••) ••• •${rawPhone.slice(-4)}`;
                                            return (
                                                <tr key={item.phone_number} className="hover:bg-neutral-800/20 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-red-500/50 transition-colors">
                                                                <User size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-gray-200 font-bold">{item.reason || 'Desconocido'}</span>
                                                                <span className="text-[11px] text-red-400/80 font-mono tracking-wider">{maskedPhone}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-400 text-xs hidden md:table-cell">{item.reason || 'Spam'}</td>
                                                    <td className="px-6 py-4 text-neutral-500 text-xs">{new Date(item.added_at).toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDelete(item.phone_number)}
                                                            className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 rounded text-xs hover:bg-green-500 hover:text-white transition-colors"
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
