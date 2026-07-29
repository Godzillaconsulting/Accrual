import React, { useState, useEffect } from 'react';
import { Crown, Users, Smartphone, Eye, UserPlus, Shield, User } from 'lucide-react';

const API = '';

export default function PanelMaestroPanel({ adminProfile }) {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loadingTeam, setLoadingTeam] = useState(false);
    const [masterPass, setMasterPass] = useState('');

    // Estado para Crear Usuario
    const [showCreate, setShowCreate] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('admin');

    const usernameStr = adminProfile?.username?.toLowerCase() || '';
    const isSuperAdmin = adminProfile?.is_superadmin === true;
    const isGod = adminProfile?.role === 'god' || usernameStr === 'godzilla';
    const canManageUsers = isGod || (isSuperAdmin && usernameStr !== 'adrianaccrual') || adminProfile?.role === 'admin' || ['jareg', 'oscar', 'accrual_admin', 'dani'].includes(usernameStr);

    // Estado para Lista Negra
    const [blacklist, setBlacklist] = useState([]);
    const [newBlacklistNumber, setNewBlacklistNumber] = useState('');
    const [loadingBlacklist, setLoadingBlacklist] = useState(false);

    const fetchBlacklist = async () => {
        setLoadingBlacklist(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/whatsapp/blacklist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBlacklist(data.blacklist || []);
            }
        } catch (e) {
            console.error('Error cargando blacklist', e);
        }
        setLoadingBlacklist(false);
    };

    const handleAddBlacklist = async (e) => {
        e.preventDefault();
        if (!newBlacklistNumber.trim()) return;
        setLoadingBlacklist(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/whatsapp/blacklist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ phone_number: newBlacklistNumber })
            });
            const data = await res.json();
            if (data.success) {
                setNewBlacklistNumber('');
                fetchBlacklist();
            } else {
                alert(data.error || 'Error al agregar número');
            }
        } catch (e) {
            alert('Error de conexión');
        }
        setLoadingBlacklist(false);
    };

    const handleDeleteBlacklist = async (phone) => {
        if (!window.confirm(`¿Seguro que deseas remover ${phone} de la lista negra? El bot volverá a responderle.`)) return;
        setLoadingBlacklist(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/whatsapp/blacklist/${encodeURIComponent(phone)}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchBlacklist();
            } else {
                alert(data.error || 'Error al eliminar');
            }
        } catch (e) {
            alert('Error de conexión');
        }
        setLoadingBlacklist(false);
    };

    const fetchTeamData = async () => {
        setLoadingTeam(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.users || []);
                setLogs(data.logs || []);
            }
        } catch (e) {
            console.error('Error cargando equipo', e);
        }
        setLoadingTeam(false);
    };

    useEffect(() => {
        if (canManageUsers) {
            fetchTeamData();
            fetchBlacklist();
        }
    }, [canManageUsers]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!window.confirm("⚠️ ¿Confirmas la adición de un nuevo operario al sistema central?")) return;

        if (!masterPass) return alert("Se requiere tu Contraseña Maestra");
        setLoadingTeam(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    superadminPassword: masterPass,
                    newUsername,
                    newPassword,
                    isSuperadmin: newRole === 'superadmin',
                    role: newRole
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Usuario creado');
                setShowCreate(false);
                setNewUsername('');
                setNewPassword('');
                setNewRole('admin');
                fetchTeamData();
            } else {
                alert(data.message || 'Error al crear');
            }
        } catch (e) {
            alert('Error de conexión');
        }
        setLoadingTeam(false);
    };

    const handleDeleteUser = async (targetId) => {
        if (!window.confirm("⚠️ PELIGRO: ¿Estás seguro de ELIMINAR permanentemente a este usuario? Esto destruirá su cuenta.")) return;

        const pass = prompt('Por seguridad, ingresa tu Contraseña Maestra para ELIMINAR este usuario:');
        if (!pass) return;

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users/${targetId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ superadminPassword: pass })
            });
            const data = await res.json();
            if (data.success) {
                alert('Usuario eliminado');
                fetchTeamData();
            } else {
                alert(data.message || 'Error al eliminar');
            }
        } catch (e) {
            alert('Error en conexión');
        }
    };

    const handleResetPassword = async (targetId, currentUsername) => {
        const pass = prompt(`Estás a punto de reescribir la contraseña de ${currentUsername}.\nIngresa tu Contraseña Maestra actual para autorizar:`);
        if (!pass) return;

        const newPass = prompt(`Ingresa la NUEVA CONTRASEÑA para ${currentUsername}:`);
        if (!newPass) return;

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users/${targetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ superadminPassword: pass, newPassword: newPass, username: currentUsername })
            });
            const data = await res.json();
            if (data.success) {
                alert('Contraseña actualizada correctamente.');
                fetchTeamData();
            } else {
                alert(data.message || 'Error al actualizar');
            }
        } catch (e) {
            alert('Error en conexión');
        }
    };

    const handleUpdateRole = async (targetId, currentUsername, currentRole, newRole) => {
        if (currentRole === newRole) return;
        const actionText = newRole === 'superadmin' ? 'ASCENDER a 👑 SuperAdmin' : (newRole === 'admin' ? 'ASIGNAR a Editor/Admin' : 'DEGRADAR a Community Manager');
        const pass = prompt(`Estás a punto de ${actionText} a ${currentUsername}.\nIngresa tu Contraseña Maestra actual para autorizar el nombramiento:`);
        if (!pass) return fetchTeamData();

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users/${targetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ superadminPassword: pass, isSuperadmin: newRole === 'superadmin', role: newRole })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Jerarquía actualizada exitosamente.`);
                fetchTeamData();
            } else {
                alert(data.message || 'Error al actualizar jerarquía');
                fetchTeamData();
            }
        } catch (e) {
            alert('Error en conexión');
            fetchTeamData();
        }
    };

    if (!canManageUsers) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 bg-[#233657] text-white">
                <div className="text-center space-y-4 max-w-md">
                    <span className="text-6xl mx-auto block mb-6">⛔</span>
                    <h2 className="text-2xl font-black text-rose-500 uppercase tracking-widest">Acceso Restringido</h2>
                    <p className="text-neutral-400 font-bold text-sm">No posees la jerarquía necesaria para visualizar el Panel Maestro y auditar al equipo.</p>
                </div>
            </div>
        );
    }

    const superAdminsCount = users.filter(u => u.role === 'superadmin' || u.is_superadmin).length;
    const cmsCount = users.filter(u => u.role === 'cm').length;

    return (
        <div className="flex-1 flex flex-col p-6 md:p-10 bg-[#040508] text-white overflow-y-auto">
            <div className="mb-8 border-b border-[rgba(65,65,65,0.51)] pb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                        <Crown size={24} className="text-[#00E5FF]" /> PANEL MAESTRO DE EQUIPO
                    </h2>
                    <p className="text-xs text-neutral-400 mt-2 tracking-wide">Visión General Ejecutiva y Control de Operaciones.</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-[#00E5FF] hover:bg-white text-[#040508] px-6 py-2.5 rounded-full font-black text-xs transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hidden md:flex items-center gap-2"
                >
                    <UserPlus size={16} />
                    {showCreate ? 'Cancelar Edición' : 'Añadir Nuevo Usuario'}
                </button>
            </div>

            {/* Métricas Reales Dinámicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Cuentas Activas', value: users.length, Icon: Users },
                    { label: 'Super Administradores', value: superAdminsCount, Icon: Crown },
                    { label: 'Community Managers', value: cmsCount, Icon: Smartphone },
                    { label: 'Acciones Auditadas', value: logs.length, Icon: Eye },
                ].map(({ label, value, Icon }) => (
                    <div key={label} className="bg-[#08090C]/80 backdrop-blur-xl border border-[rgba(65,65,65,0.51)] p-5 rounded-2xl shadow-lg hover:border-[#00E5FF]/40 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <Icon size={20} className="text-[#00E5FF]" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{label}</p>
                        <p className="text-3xl font-black mt-1 text-white">{loadingTeam ? '-' : value}</p>
                    </div>
                ))}
            </div>

            {/* Panel Principal */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Gestión de Equipo: Tabla y Creación */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Botón en Mobile */}
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="w-full mb-4 bg-[#00E5FF] hover:bg-white text-[#040508] px-6 py-3 rounded-xl font-black text-xs transition shadow-lg md:hidden flex items-center justify-center gap-2"
                    >
                        <UserPlus size={16} />
                        {showCreate ? 'Cerrar Panel' : 'Añadir Nuevo Usuario'}
                    </button>

                    {showCreate && (
                        <form onSubmit={handleCreateUser} className="bg-[#08090C]/90 backdrop-blur-xl border border-[rgba(65,65,65,0.51)] rounded-2xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 shadow-2xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
                            <h3 className="text-sm font-black text-[#00E5FF] mb-4 uppercase tracking-widest flex items-center gap-2">Registrar Operario</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Nombre / Usuario</label>
                                    <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full bg-[#040508] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#00E5FF]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Contraseña</label>
                                    <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#040508] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#00E5FF]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Jerarquía Autorizada</label>
                                    <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full bg-[#040508] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-[#00E5FF] appearance-none cursor-pointer">
                                        <option value="superadmin">SuperAdmin</option>
                                        <option value="admin">Editor / Admin</option>
                                        <option value="cm">Community Manager</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-5 mt-2 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                                <div className="flex flex-col gap-1 w-full md:w-1/2">
                                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Protocolo de Seguridad: Ingresa tu Pass Maestra</label>
                                    <input type="password" required value={masterPass} onChange={e => setMasterPass(e.target.value)} placeholder="Firma de autorización..." className="w-full bg-[#040508] border border-rose-500/40 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-rose-500 transition-all" />
                                </div>
                                <button type="submit" disabled={loadingTeam} className="w-full md:w-auto bg-[#00E5FF] text-[#040508] px-8 py-3 rounded-full font-black text-xs hover:bg-white transition shadow-lg disabled:opacity-50 uppercase tracking-wider">Autenticar y Crear</button>
                            </div>
                        </form>
                    )}

                    <div className="bg-[#08090C]/80 backdrop-blur-xl border border-[rgba(65,65,65,0.51)] rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h3 className="text-xs font-black text-white tracking-widest uppercase">Directorio de Usuarios Activos</h3>
                            <div className="text-[10px] font-bold text-neutral-400 bg-white/5 px-3 py-1 rounded-full uppercase border border-white/10">Base de Datos Viva</div>
                        </div>
                        {loadingTeam && users.length === 0 ? <p className="p-8 text-neutral-400 text-center text-xs font-bold tracking-widest uppercase">Sincronizando registros...</p> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-black/40 text-[10px] text-neutral-400 uppercase font-black tracking-widest border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4">ID / Operario</th>
                                            <th className="px-6 py-4">Nivel de Acceso</th>
                                            <th className="px-6 py-4 text-center">Estado de Enlace</th>
                                            <th className="px-6 py-4 text-right">Controles de Fuerza</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0 flex justify-center items-center">
                                                        {u.photo_url ? <img src={u.photo_url} alt="" className="w-full h-full object-cover" /> : <User size={16} className="text-neutral-400" />}
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-white block text-sm">{u.username}</span>
                                                        <span className="text-[10px] text-neutral-500 font-mono">UID: #{u.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.username === 'JareG' && adminProfile?.id !== 2 ? (
                                                        <span className="text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-3 py-1 rounded-full text-[10px] uppercase inline-flex items-center justify-center border border-[#00E5FF]/30">Fundador</span>
                                                    ) : (
                                                        <select
                                                            value={u.role || (u.is_superadmin ? 'superadmin' : 'admin')}
                                                            onChange={(e) => handleUpdateRole(u.id, u.username, u.role || (u.is_superadmin ? 'superadmin' : 'admin'), e.target.value)}
                                                            disabled={u.id === adminProfile?.id || (u.username === 'JareG' && adminProfile?.id !== 2)}
                                                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-full uppercase outline-none cursor-pointer border transition bg-[#040508] text-neutral-300 border-white/10 focus:border-[#00E5FF]"
                                                        >
                                                            <option value="superadmin">SuperAdmin</option>
                                                            <option value="admin">Editor Admin</option>
                                                            <option value="cm">CM</option>
                                                        </select>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Activo
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => handleResetPassword(u.id, u.username)} className="px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 rounded-lg font-bold text-[10px] uppercase tracking-widest transition">Reset Pass</button>
                                                    {u.id !== adminProfile?.id && (u.username !== 'JareG' || adminProfile?.id === 2) && usernameStr !== 'dani' && (
                                                        <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 text-rose-400 hover:text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition">Eliminar</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>


                </div>

                {/* Logs de Auditoría */}
                <div className="bg-[#08090C]/80 backdrop-blur-xl border border-[rgba(65,65,65,0.51)] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex items-center justify-between sticky top-0 shrink-0">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Eye size={16} className="text-[#00E5FF]" /> Radar de Auditoría
                        </h3>
                        <div className="px-2.5 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-full text-[10px] font-black">{logs.length} Eventos</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {logs.length === 0 ? <p className="text-center py-10 text-neutral-500 text-xs font-bold uppercase tracking-widest">Registros limpios.</p> : (
                            <div className="space-y-3 relative">
                                {logs.map(l => (
                                    <div key={l.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#00E5FF]/30 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-black text-white text-[11px] truncate block pr-2">{l.username || 'System'}</span>
                                            <time className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 shrink-0">{new Date(l.created_at).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
                                        </div>
                                        <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider mb-1">{l.action}</div>
                                        <div className="text-[10px] font-medium text-neutral-400 line-clamp-2 break-all">{JSON.stringify(l.details)}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
