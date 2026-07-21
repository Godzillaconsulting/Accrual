import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Lock, Upload, CheckSquare, ShieldAlert, CheckCircle2, 
    AlertTriangle, FileText, Plus, ChevronDown, Check, ExternalLink, 
    Briefcase, Clock, Sparkles, Shield, Activity, X, Bug, Camera 
} from 'lucide-react';

const API = '';

export default function AdminProfile({ profile, onProfileUpdate }) {
    const [subTab, setSubTab] = useState('personal'); // 'personal' | 'tasks' | 'alerts'
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    
    // --- Estado Personal ---
    const [username, setUsername] = useState(profile?.username || '');
    const [password, setPassword] = useState('');
    const [photoUrl, setPhotoUrl] = useState(profile?.photo_url || '');
    const [personalMsg, setPersonalMsg] = useState({ text: '', type: '' });
    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [changelogs, setChangelogs] = useState([]);

    // --- Estado de Tareas Personales (Live DB) ---
    const [allTasks, setAllTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API}/api/studio/tasks`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.tasks) {
                const liveTasks = data.tasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    deadline: t.generation_details?.deadline || 'Sin fecha',
                    source: t.creator_username || 'Sistema',
                    asignadoA: t.appointed_username || t.assigned_team || 'Equipo',
                    done: t.status === 'APPROVED',
                    why: t.description || 'Objetivo no especificado',
                    references: t.media_reference || '',
                    comments: t.generation_details?.technical_brief || ''
                }));
                setAllTasks(liveTasks);
                setMyTasks(liveTasks.filter(t => t.asignadoA?.toLowerCase() === profile?.username?.toLowerCase()));
            }
        } catch (e) {
            console.error('Error fetching tasks', e);
        }
    };

    const toggleTask = async (id) => {
        const tsk = allTasks.find(t => t.id === id);
        if(!tsk) return;
        const newStatus = tsk.done ? 'PENDING' : 'APPROVED';
        
        setAllTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
        setMyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
        if (selectedTask && selectedTask.id === id) setSelectedTask(prev => ({...prev, done: !prev.done}));

        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API}/api/studio/tasks/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
        } catch(e) {
            console.error('Error toggling status', e);
        }
    };

    // --- Estado de IT Bugs (Solo JareG/Dani) ---
    const [itBugs, setItBugs] = useState([]);
    const isIT = ['jareg', 'accrual_admin', 'dani'].includes(profile?.username?.toLowerCase());

    const fetchBugs = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API}/api/bugs`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.bugs) setItBugs(data.bugs);
        } catch (e) {
            console.error('Error fetching bugs', e);
        }
    };

    const resolveBug = async (id, currentStatus) => {
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API}/api/bugs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ resolved: !currentStatus })
            });
            fetchBugs();
        } catch(e) {
            console.error('Error resolving bug', e);
        }
    };

    useEffect(() => {
        if (subTab === 'tasks') {
            fetchTasks();
            if (isIT) fetchBugs();
        }
    }, [subTab, isIT]);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username);
            setPhotoUrl(profile.photo_url || '');
        }
    }, [profile]);

    const canManageUsers = profile?.is_superadmin || profile?.role === 'admin' || profile?.role === 'god' || ['jareg', 'oscar', 'accrual_admin', 'dani', 'godzilla'].includes(profile?.username?.toLowerCase());

    useEffect(() => {
        if (subTab === 'alerts' && canManageUsers) {
            fetchSecurityAlerts();
        }
        if (subTab === 'personal' && canManageUsers) {
            fetchChangelogs();
        }
    }, [subTab, profile, canManageUsers]);

    const fetchSecurityAlerts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users/security-alerts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSecurityAlerts(data.alerts);
            }
        } catch (e) {
            console.error('Error fetching security alerts', e);
        }
    };

    const fetchChangelogs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/system/changelog`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.logs) {
                setChangelogs(data.logs);
            }
        } catch (e) {
            console.error('Error fetching changelogs', e);
        }
    };

    const handleSavePersonal = async (e) => {
        e.preventDefault();
        if(!window.confirm("¿Estás seguro de aplicar los cambios a tu perfil en la base de datos?")) return;
        
        setSaving(true);
        setPersonalMsg({ text: '', type: '' });
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/users/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, password, photo_url: photoUrl })
            });
            const data = await res.json();
            if (data.success) {
                setPersonalMsg({ text: 'Perfil actualizado. Reiniciando sesión por seguridad...', type: 'success' });
                alert("Perfil actualizado exitosamente. Por seguridad, el sistema cerrará la sesión para aplicar tus nuevas credenciales.");
                localStorage.clear();
                window.location.href = '/login';
            } else {
                setPersonalMsg({ text: data.message || 'Error al guardar.', type: 'error' });
                setSaving(false);
            }
        } catch (e) {
            setPersonalMsg({ text: 'Error de conexión.', type: 'error' });
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setSaving(true);
        setPersonalMsg({ text: 'Subiendo imagen a la bóveda encriptada...', type: 'info' });
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API}/api/media/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            
            if (data.success) {
                setPhotoUrl(data.url);
                setPersonalMsg({ text: 'Foto actualizada correctamente. Recuerda presionar "Guardar Cambios".', type: 'success' });
            } else {
                setPersonalMsg({ text: data.error || 'Falló la subida de la imagen.', type: 'error' });
            }
        } catch (err) {
            setPersonalMsg({ text: 'Falló la subida (Conexión)', type: 'error' });
        }
        setSaving(false);
    };

    if (!profile) return <div className="p-10 flex justify-center"><p className="text-white font-medium">Cargando perfil...</p></div>;

    return (
        <div className="flex-1 flex flex-col bg-[#0b1320] text-slate-200 overflow-y-auto min-h-screen">
            
            {/* Navigation Tabs Header */}
            <div className="border-b border-slate-800/80 bg-[#080d16] px-4 md:px-8 pt-4 pb-0 flex gap-2 md:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none sticky top-0 z-20 backdrop-blur-md">
                <button 
                    onClick={() => setSubTab('personal')}
                    className={`pb-4 px-2 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                        subTab === 'personal' ? 'border-[#00D0B0] text-white font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <User size={16} className={subTab === 'personal' ? 'text-[#00D0B0]' : 'text-slate-400'} />
                    <span>Mi Perfil Personal</span>
                </button>

                <button 
                    onClick={() => setSubTab('tasks')}
                    className={`pb-4 px-2 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                        subTab === 'tasks' ? 'border-sky-400 text-white font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <CheckSquare size={16} className={subTab === 'tasks' ? 'text-sky-400' : 'text-slate-400'} />
                    <span>Mis Tareas</span>
                </button>

                {canManageUsers && (
                    <button 
                        onClick={() => setSubTab('alerts')}
                        className={`pb-4 px-2 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                            subTab === 'alerts' ? 'border-rose-500 text-white font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <ShieldAlert size={16} className={subTab === 'alerts' ? 'text-rose-500' : 'text-slate-400'} />
                        <span>Alertas (Seguridad)</span>
                    </button>
                )}
            </div>

            {/* Content Body */}
            <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
                
                {/* SUBTAB: PERSONAL PROFILE */}
                {subTab === 'personal' && (
                    <div className="animate-in fade-in space-y-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-[#00D0B0]" />
                                Configuración de Perfil
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400 mt-1">Edita tus credenciales de acceso y preferencias del Admin Studio.</p>
                        </div>

                        <form onSubmit={handleSavePersonal} className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
                            
                            {/* Avatar Display & Custom Upload */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:border-[#00D0B0] transition-colors">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-slate-500" />
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2 bg-[#00D0B0] hover:bg-teal-400 text-slate-950 rounded-xl shadow-lg transition-transform hover:scale-110"
                                        title="Cambiar imagen de perfil"
                                    >
                                        <Camera className="w-4 h-4 font-bold" />
                                    </button>
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                                        Foto de Perfil Oficial
                                    </label>
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        disabled={saving}
                                        className="hidden"
                                    />
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={saving}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
                                        >
                                            <Upload className="w-4 h-4 text-[#00D0B0]" />
                                            Subir nueva foto
                                        </button>
                                        {photoUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setPhotoUrl('')}
                                                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition"
                                            >
                                                Remover foto
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Formatos recomendados: JPG, PNG o WebP. Se cifrará y guardará automáticamente.
                                    </p>
                                </div>
                            </div>

                            {/* Form Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-[#00D0B0]" />
                                        Nombre / Usuario
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Nombre de usuario"
                                        className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D0B0] focus:ring-2 focus:ring-[#00D0B0]/20 outline-none transition placeholder-slate-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-[#00D0B0]" />
                                        Nueva Contraseña
                                    </label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#1e293b]/70 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm focus:border-[#00D0B0] focus:ring-2 focus:ring-[#00D0B0]/20 outline-none transition placeholder-slate-500"
                                    />
                                    <p className="text-[11px] text-slate-400">Déjalo en blanco para mantener la contraseña actual.</p>
                                </div>
                            </div>

                            {/* Status Notification Message */}
                            {personalMsg.text && (
                                <div className={`p-4 rounded-xl text-xs md:text-sm font-semibold border flex items-center gap-3 ${
                                    personalMsg.type === 'success' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                        : personalMsg.type === 'error'
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                        : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                }`}>
                                    {personalMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                                    <span>{personalMsg.text}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full sm:w-auto bg-[#00D0B0] hover:bg-teal-400 text-slate-950 px-8 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-[#00D0B0]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* SUBTAB: SECURITY ALERTS */}
                {subTab === 'alerts' && canManageUsers && (
                    <div className="animate-in fade-in space-y-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-rose-400 flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6 text-rose-500" />
                                Alertas de Seguridad
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400 mt-1">Historial de accesos fallidos y violaciones de seguridad registradas.</p>
                        </div>
                        
                        {securityAlerts.length === 0 ? (
                            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in fade-in shadow-xl flex flex-col items-center gap-3">
                                <Shield className="w-12 h-12 text-emerald-400" />
                                <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Sistema Seguro · Sin amenazas registradas</p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in">
                                <div className="px-6 py-4 border-b border-rose-900/40 bg-rose-500/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                                        <h3 className="text-xs md:text-sm font-bold text-rose-400 uppercase tracking-wider">Registro de Eventos Críticos</h3>
                                    </div>
                                    <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                                        {securityAlerts.length} Eventos
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                                        <thead className="bg-slate-950 text-xs text-rose-300 font-bold uppercase">
                                            <tr>
                                                <th className="px-6 py-4 border-b border-rose-900/30">Fecha / Hora</th>
                                                <th className="px-6 py-4 border-b border-rose-900/30">Acción Detectada</th>
                                                <th className="px-6 py-4 border-b border-rose-900/30">Detalles (IP / Contexto)</th>
                                                <th className="px-6 py-4 border-b border-rose-900/30">Usuario Relacionado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {securityAlerts.map(alert => (
                                                <tr key={alert.id} className="hover:bg-rose-950/20 transition">
                                                    <td className="px-6 py-3 text-slate-400 text-xs font-mono">{new Date(alert.created_at).toLocaleString('es-MX')}</td>
                                                    <td className="px-6 py-3 text-rose-400 font-bold text-xs uppercase tracking-wider">{alert.action}</td>
                                                    <td className="px-6 py-3 font-mono text-xs text-rose-200 max-w-[300px] truncate" title={JSON.stringify(alert.details)}>{JSON.stringify(alert.details)}</td>
                                                    <td className="px-6 py-3 text-slate-200 font-medium">{alert.details?.username || 'Desconocido'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Changelogs Table */}
                        {canManageUsers && changelogs.length > 0 && (
                            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in">
                                <div className="px-6 py-4 border-b border-purple-900/40 bg-purple-500/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-xs md:text-sm font-bold text-purple-300 uppercase tracking-wider">Auditoría: Cambios en el Sistema</h3>
                                    </div>
                                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                                        {changelogs.length} Commits
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                                        <thead className="bg-slate-950 text-xs text-purple-300 font-bold uppercase">
                                            <tr>
                                                <th className="px-6 py-4 border-b border-purple-900/30">Fecha</th>
                                                <th className="px-6 py-4 border-b border-purple-900/30">Autor</th>
                                                <th className="px-6 py-4 border-b border-purple-900/30">Hash</th>
                                                <th className="px-6 py-4 border-b border-purple-900/30 w-full">Descripción del Cambio</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {changelogs.map(log => (
                                                <tr key={log.hash} className="hover:bg-purple-950/20 transition">
                                                    <td className="px-6 py-3 text-slate-400 text-xs font-mono">{log.date}</td>
                                                    <td className="px-6 py-3 font-mono text-purple-300 font-bold">{log.author}</td>
                                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.hash}</td>
                                                    <td className="px-6 py-3 text-slate-300 text-xs whitespace-normal">{log.message}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SUBTAB: TASKS BOARD */}
                {subTab === 'tasks' && (
                    <div className="animate-in fade-in space-y-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                <CheckSquare className="w-6 h-6 text-sky-400" />
                                Tablero de Tareas
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400 mt-1">Gestión responsiva y asignación directa de actividades.</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] shadow-2xl">
                            
                            {/* Left Pane: Task List */}
                            <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-[#0f172a]/60">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0 bg-slate-900/40">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                        <CheckSquare className="w-4 h-4 text-sky-400" /> Tareas Asignadas
                                    </span>
                                    <button 
                                        onClick={() => alert('Función de agregar tarea rápida disponible próximamente')}
                                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg px-3 py-1 text-xs font-bold flex items-center gap-1 transition shadow-md"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Agregar
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto max-h-[350px] md:max-h-[550px] divide-y divide-slate-800/50">
                                    {myTasks.length === 0 ? (
                                        <div className="text-slate-500 text-xs md:text-sm text-center py-10 font-bold uppercase tracking-wider flex flex-col items-center gap-2">
                                            <CheckCircle2 className="w-8 h-8 text-slate-700" />
                                            <span>No tienes tareas pendientes</span>
                                        </div>
                                    ) : myTasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            onClick={() => setSelectedTask(task)}
                                            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                                                selectedTask?.id === task.id ? 'bg-slate-800/80 border-l-4 border-l-[#00D0B0]' : 'border-l-4 border-l-transparent'
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 shrink-0 transition-all ${
                                                    task.done ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md' : 'border-slate-600 hover:border-sky-400'
                                                }`}
                                            >
                                                {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </button>

                                            <div className={`flex-1 text-xs md:text-sm font-semibold truncate mr-2 ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                {task.title}
                                            </div>
                                            
                                            <div className="text-[10px] font-mono text-slate-400 shrink-0 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                                {task.deadline}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Right Pane: Details Pane */}
                            <div className="w-full md:w-7/12 flex flex-col bg-[#090d16] p-4 md:p-6">
                                {selectedTask ? (
                                    <div className="flex-1 flex flex-col justify-between space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                                                <button 
                                                    onClick={() => {
                                                        toggleTask(selectedTask.id);
                                                        setSelectedTask({...selectedTask, done: !selectedTask.done});
                                                    }}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition ${
                                                        selectedTask.done 
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                                                    }`}
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>{selectedTask.done ? 'Completado' : 'Marcar como Completada'}</span>
                                                </button>

                                                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                                                    ID: #{selectedTask.id}
                                                </span>
                                            </div>

                                            <h1 className={`text-lg md:text-2xl font-black mb-4 ${selectedTask.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {selectedTask.title}
                                            </h1>

                                            <div className="space-y-4 text-xs md:text-sm">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-24 text-slate-400 font-bold uppercase text-[10px] tracking-wider">Asignado a:</span>
                                                    <span className="text-slate-200 font-semibold bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                                                        {selectedTask.asignadoA}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="w-24 text-slate-400 font-bold uppercase text-[10px] tracking-wider">Fecha límite:</span>
                                                    <span className="text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                                                        {selectedTask.deadline}
                                                    </span>
                                                </div>

                                                <div className="pt-2">
                                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Objetivo:</span>
                                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                                                        {selectedTask.why}
                                                    </div>
                                                </div>

                                                {selectedTask.references && (
                                                    <div>
                                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Referencia Visual:</span>
                                                        <a 
                                                            href={selectedTask.references} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="text-[#00D0B0] hover:underline flex items-center gap-1 text-xs break-all"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                                            {selectedTask.references}
                                                        </a>
                                                    </div>
                                                )}

                                                {selectedTask.comments && (
                                                    <div>
                                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Brief Técnico:</span>
                                                        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap font-mono text-xs">
                                                            {selectedTask.comments}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
                                        <FileText className="w-12 h-12 mb-3 text-slate-700" />
                                        <p className="text-xs md:text-sm font-bold uppercase tracking-wider">Selecciona una tarea para consultar sus detalles</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* IT Bugs & Suggestions section */}
                        {isIT && (
                            <div className="pt-8 border-t border-slate-800 space-y-4">
                                <div>
                                    <h2 className="text-lg md:text-xl font-black text-rose-400 flex items-center gap-2">
                                        <Bug className="w-5 h-5 text-rose-500" />
                                        Reportes de Bugs e IT
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Gestión interna de retroalimentación y resolución de incidentes.</p>
                                </div>

                                <div className="space-y-3">
                                    {itBugs.map(bug => (
                                        <div key={bug.id} className={`bg-[#0f172a] border ${bug.resolved ? 'border-emerald-500/30 opacity-60' : 'border-rose-500/30'} p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start shadow-md`}>
                                            <button 
                                                onClick={() => resolveBug(bug.id, bug.resolved)} 
                                                className={`mt-1 w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                                    bug.resolved ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 hover:border-rose-500 bg-slate-900'
                                                }`}
                                            >
                                                {bug.resolved && <Check className="w-4 h-4 stroke-[3]" />}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                                        bug.priority === 'urgente' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : bug.priority === 'media' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                                    }`}>
                                                        {bug.priority}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        Por: <strong className="text-slate-200">{bug.reporter_username || '?'}</strong>
                                                    </span>
                                                </div>
                                                <p className={`text-xs md:text-sm font-medium ${bug.resolved ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                    {bug.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {itBugs.length === 0 && (
                                        <div className="border border-dashed border-slate-800 bg-slate-900/40 rounded-xl p-6 text-center">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No existen bugs ni reportes pendientes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
