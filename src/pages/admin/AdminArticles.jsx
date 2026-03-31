import React from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

const AdminArticles = () => {
    const articles = [
        { id: 1, title: 'Reforma Fiscal 2026: Lo que debes saber', category: 'Impuestos', date: '28 Oct 2026', status: 'Publicado' },
        { id: 2, title: 'Cómo prepararse para una auditoría', category: 'Auditoría', date: '15 Oct 2026', status: 'Publicado' },
        { id: 3, title: 'Beneficios de externalizar la nómina', category: 'Nómina', date: '02 Oct 2026', status: 'Borrador' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h2 className="text-2xl font-bold text-[#233657]">Administrar Artículos</h2>
                <button className="bg-[#00D0B0] hover:bg-[#00b096] text-[#233657] px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1">
                    <Plus className="w-5 h-5" /> Nuevo Artículo
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#233657]/5 border-b border-gray-200 text-[#233657] text-sm uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Título del Artículo</th>
                            <th className="px-6 py-4 font-bold">Categoría</th>
                            <th className="px-6 py-4 font-bold">Fecha</th>
                            <th className="px-6 py-4 font-bold">Estado</th>
                            <th className="px-6 py-4 font-bold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-800">{article.title}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{article.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{article.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        article.status === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" title="Editar">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-200 transition-colors" title="Ver en el sitio">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors" title="Eliminar">
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
                    <span>Mostrando {articles.length} de 15 artículos</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Anterior</button>
                        <button className="px-3 py-1 bg-[#233657] text-white rounded transition-colors">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminArticles;
