import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminServices = () => {
    const services = [
        { id: 1, name: 'Consultoría', description: 'Consultoría empresarial integral', slug: 'consultoria' },
        { id: 2, name: 'Planificación fiscal avanzada', description: 'Estrategias fiscales para corporativos', slug: 'planificacion-fiscal-avanzada' },
        { id: 3, name: 'Declaración de impuestos', description: 'Declaraciones mensuales y anuales', slug: 'declaracion-de-impuestos' },
        { id: 4, name: 'IMSS e Infonavit', description: 'Manejo de seguridad social', slug: 'imss-e-infonavit' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h2 className="text-2xl font-bold text-[#233657]">Administrar Servicios</h2>
                <button 
                    onClick={() => alert('¡Módulo para agregar nuevo servicio habilitado!')}
                    className="bg-[#00D0B0] hover:bg-[#00b096] text-[#233657] px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" /> Nuevo Servicio
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#233657]/5 border-b border-gray-200 text-[#233657] text-sm uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">ID</th>
                            <th className="px-6 py-4 font-bold">Nombre del Servicio</th>
                            <th className="px-6 py-4 font-bold">Slug URL</th>
                            <th className="px-6 py-4 font-bold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {services.map((svc) => (
                            <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-500">#{svc.id}</td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-800">{svc.name}</span>
                                    <p className="text-sm text-gray-500 mt-1">{svc.description}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#00D0B0] font-mono">/{svc.slug}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => alert('Entrando al modo de edición de servicio...')} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => { if(window.confirm('¿Seguro de eliminar este servicio?')) alert('Servicio eliminado.'); }} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination placeholder */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
                    <span>Mostrando {services.length} de 20 servicios</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Anterior</button>
                        <button className="px-3 py-1 bg-[#233657] text-white rounded transition-colors">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">2</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
