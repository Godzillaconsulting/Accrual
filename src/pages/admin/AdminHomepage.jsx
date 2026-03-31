import React, { useState } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';

const AdminHomepage = () => {
    const [heroTitle, setHeroTitle] = useState('Construimos el futuro de tu negocio con soluciones integrales');
    const [heroSubtitle, setHeroSubtitle] = useState('Protegemos y hacemos crecer el patrimonio de tu empresa con asesoria experta');

    const handleSave = () => {
        // Implement save logic here
        alert('Cambios guardados exitosamente.');
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#233657] mb-8 border-b pb-4">Editar Homepage</h2>
            
            {/* Seccion Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-[#233657] mb-6 flex items-center gap-2">
                    Sección Hero (Banner Principal)
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Título Principal (H1)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow text-gray-800"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow h-24 text-gray-800"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Video o Imagen de Fondo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#00D0B0] transition-colors cursor-pointer group">
                            <ImageIcon className="w-10 h-10 mb-2 text-gray-400 group-hover:text-[#00D0B0] transition-colors" />
                            <p className="font-medium text-sm group-hover:text-[#00D0B0]">Click para subir un nuevo archivo o arrastra aquí</p>
                            <p className="text-xs text-gray-400 mt-1">MP4, JPG, PNG (Max. 10MB)</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="bg-[#233657] hover:bg-[#1a2842] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" />
                        Guardar Cambios Hero
                    </button>
                </div>
            </div>

            {/* Otro componente editable como Testimonios o CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-[#233657] mb-6">Sección Llamado a la Acción (CTA)</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Texto CTA Título</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00D0B0] focus:border-transparent transition-shadow text-gray-800"
                            defaultValue="¿Estás listo para dar el siguiente paso?"
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button 
                        className="bg-[#233657] hover:bg-[#1a2842] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" />
                        Guardar CTA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHomepage;
