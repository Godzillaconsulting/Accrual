import React, { useState, useEffect } from 'react';

export default function DBStudioPanel({ adminProfile }) {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [data, setData] = useState({ rows: [], fields: [], timeMs: null, command: null, rowCount: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('adminToken');
    const API_BASE = '';

    const isJareg = adminProfile?.username?.toLowerCase() === 'jareg';

    // Cargar lista de tablas al inicio
    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/db-studio/tables`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setTables(json.tables);
                if (json.tables.length > 0 && !selectedTable) {
                    loadTable(json.tables[0]);
                }
            } else {
                setError(json.error || json.message || 'Error cargando tablas');
            }
        } catch (err) {
            setError(`Fallo de conexión HTTP: ${err.message}`);
        }
    };

    const loadTable = async (tableName) => {
        setSelectedTable(tableName);
        setLoading(true);
        setError(null);
        setData({ rows: [], fields: [], timeMs: null });
        try {
            const res = await fetch(`${API_BASE}/api/db-studio/tables/${tableName}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setData({ rows: json.rows, fields: json.fields, timeMs: json.timeMs });
            } else {
                setError(json.error);
            }
        } catch (err) {
            setError('Error de carga');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex w-full h-full bg-[#0a0a0a] text-neutral-300 font-mono text-sm border-l border-blue-900/30 overflow-hidden">
            {/* PANEL LATERAL: Explorador de Tablas (Neon Style) */}
            <div className="w-64 flex flex-col bg-[#152033] border-r border-blue-900/40 shrink-0">
                <div className="p-4 border-b border-blue-900/40 bg-[#0099CC]/10 flex items-center gap-2">
                    <span className="text-xl">🗄️</span>
                    <h2 className="font-sans font-black text-white tracking-widest uppercase">Accrual DB</h2>
                </div>
                


                <div className="px-3 pb-2 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2 px-1">Tablas Públicas</div>
                    <div className="space-y-0.5">
                        {tables.map(t => (
                            <button 
                                key={t} 
                                onClick={() => loadTable(t)}
                                className={`w-full text-left px-3 py-1.5 rounded transition-all text-sm flex items-center gap-2 truncate ${selectedTable === t ? 'bg-[#0099CC]/10 text-white font-bold border-l-2 border-[#0099CC]' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* PANEL DERECHO: Visor + Editor */}
            <div className="flex-1 flex flex-col min-w-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(0,153,204,0.05), transparent 40%)' }}>
                


                {/* VISOR DE TABLA (Grilla) */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-[#152033]/40 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-white">
                                {selectedTable ? `Tabla: ${selectedTable}` : 'Esperando...'}
                            </span>
                            {data.timeMs && (
                                <span className="text-[10px] bg-neutral-800 text-green-400 px-2 py-0.5 rounded-full border border-neutral-700">
                                    {data.timeMs} ms
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-neutral-500">
                            {data.command ? `Comando: ${data.command} (${data.rowCount} afectadas)` : data.rows?.length !== undefined ? `${data.rows.length} Filas obtenidas` : ''}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4 relative custom-scrollbar">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur z-20">
                                <div className="text-[#0099CC] font-black tracking-widest animate-pulse">PROCESANDO...</div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="p-4 bg-blue-900/20 border border-[#0099CC]/50 rounded-xl text-blue-400 mb-4 font-mono text-sm whitespace-pre-wrap">
                                ❌ {error}
                            </div>
                        )}

                        {!error && data.command && data.command !== 'SELECT' && (
                            <div className="p-4 bg-green-900/10 border border-green-500/30 rounded-xl text-green-400 text-center font-bold">
                                ✅ Operación {data.command} ejecutada exitosamente. ({data.rowCount} filas afectadas)
                            </div>
                        )}

                        {!error && (!data.command || data.command === 'SELECT') && data.rows && data.rows.length > 0 && (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0099CC]/5 backdrop-blur-md shadow-sm z-10">
                                    <tr>
                                        {data.fields.map((f, i) => (
                                            <th key={i} className="py-2 px-4 text-[10px] font-bold text-[#0099CC] uppercase tracking-wider border-b border-blue-900/30 whitespace-nowrap">
                                                {f}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-neutral-900 hover:text-white transition-colors border-b border-neutral-900/50">
                                            {data.fields.map((f, cIdx) => {
                                                let cellData = row[f];
                                                let displayContent;
                                                
                                                if (cellData === null || cellData === undefined) {
                                                    displayContent = <span className="text-neutral-600 italic text-[10px]">null</span>;
                                                } else if (typeof cellData === 'object') {
                                                    displayContent = <span className="text-cyan-400 font-mono text-[10px] inline-block max-w-[300px] truncate" title={JSON.stringify(cellData)}>{JSON.stringify(cellData)}</span>;
                                                } else if (typeof cellData === 'boolean') {
                                                    displayContent = <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${cellData ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-blue-900/30 text-blue-500 border-blue-500/30'}`}>{cellData ? 'TRUE' : 'FALSE'}</span>;
                                                } else if (typeof cellData === 'string' && cellData.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                                                    displayContent = <span className="text-neutral-400 text-[10px]">{new Date(cellData).toLocaleString('es-MX', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit' })}</span>;
                                                } else if (typeof cellData === 'number') {
                                                    displayContent = <span className="text-amber-400 font-mono text-[11px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{cellData}</span>;
                                                } else {
                                                    displayContent = <span className="text-gray-300 text-xs truncate max-w-[250px] inline-block" title={cellData}>{String(cellData)}</span>;
                                                }

                                                return (
                                                    <td key={cIdx} className="py-2.5 px-4 align-middle whitespace-nowrap">
                                                        {displayContent}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {!error && (!data.command || data.command === 'SELECT') && data.rows && data.rows.length === 0 && !loading && (
                            <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                                No se encontraron registros.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
