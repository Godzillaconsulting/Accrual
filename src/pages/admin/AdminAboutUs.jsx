import React from 'react';
import { Save, Plus } from 'lucide-react';

const AdminAboutUs = () => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#233657] mb-8 border-b pb-4">Editar Quiénes Somos</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-[#233657] mb-6">Textos Principales</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Párrafo 1 (Historia)</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow h-24 text-gray-800"
                            defaultValue="Fundada en 2015 Accrual se ha dedicado a fortalecer a sus socios de negocios mediante servicios de vanguardia, profesionalismo y veracidad."
                        ></textarea>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Párrafo 2 (Visión)</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow h-28 text-gray-800"
                            defaultValue="Con la visión de ser líderes en ofrecer servicios financieros y fiscales a nivel nacional e internacional, ofrecemos soluciones innovadoras en planeacion, diseño, capacitacion y consultoría fiscal, contable y financiera."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Párrafo 3 (Misión)</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow h-28 text-gray-800"
                            defaultValue="Nuestra misión es impulsar el éxito y la eficiencia de nuestros clientes, fortaleciendo los pilares financieros. A través de nuestra trayectoria, hemos logrado demostrar nuestro compromiso con la excelencia con el maximo profesionalismo."
                        ></textarea>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={() => alert('¡Textos actualizados exitosamente!')}
                        className="bg-[#233657] hover:bg-[#1a2842] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" />
                        Guardar Textos
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#233657]">Nuestro Equipo</h3>
                    <button 
                        onClick={() => alert('¡Módulo de nuevo miembro habilitado!')}
                        className="bg-[#00D0B0] hover:bg-[#00b096] text-[#233657] border border-[#233657]/10 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-1"
                    >
                        <Plus className="w-4 h-4" /> Agregar Miembro
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow bg-gray-50/50">
                            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden border-4 border-white shadow-sm">
                                <img src={`https://i.pravatar.cc/150?img=${item * 11}`} alt="Miembro" className="w-full h-full object-cover" />
                            </div>
                            <input type="text" className="font-bold text-[#233657] text-lg bg-transparent text-center border-b border-dashed border-gray-300 mb-1 focus:outline-none focus:border-[#00D0B0]" defaultValue="Juan Pérez" />
                            <input type="text" className="text-sm text-gray-500 bg-transparent text-center border-b border-dashed border-gray-300 mb-4 focus:outline-none focus:border-[#00D0B0]" defaultValue="Socio Director" />
                            
                            <div className="flex gap-2 w-full mt-auto pt-4 border-t border-gray-200">
                                <button className="flex-1 py-2 text-sm font-semibold text-white bg-[#233657] rounded hover:bg-[#1a2842] transition-colors">Editar</button>
                                <button className="flex-1 py-2 text-sm font-semibold text-red-500 bg-red-50 rounded hover:bg-red-100 transition-colors">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAboutUs;
