import React, { useState } from 'react';
import { LayoutDashboard, Users, Activity, FileText, ChevronRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-[#233657]">{value}</h3>
            {trend && (
                <p className={`text-sm mt-2 font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? '+' : ''}{trend}% desde el mes pasado
                </p>
            )}
        </div>
        <div className={`p-4 rounded-full ${color} text-white shadow-inner`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#233657] mb-8 border-b pb-4">Panel de Control: Visión General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Visitas Totales" value="24,532" icon={Activity} color="bg-[#233657]" trend={12} />
                <StatCard title="Artículos Publicados" value="15" icon={FileText} color="bg-[#00D0B0]" trend={5} />
                <StatCard title="Prospectos Captados" value="142" icon={Users} color="bg-blue-500" trend={-2} />
                <StatCard title="Servicios Activos" value="9" icon={LayoutDashboard} color="bg-indigo-500" trend={0} />
            </div>

            <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-[#233657] mb-6 border-b pb-4">Actividad Reciente</h3>
                
                <div className="space-y-4">
                    {[
                        { time: 'Hace 2 horas', text: 'Se actualizó el banner de la Homepage', status: 'success' },
                        { time: 'Hace 5 horas', text: 'Nuevo artículo publicado: "Reforma Fiscal 2026"', status: 'info' },
                        { time: 'Ayer', text: 'Se modificó la descripción del servicio de Consultoría', status: 'success' },
                        { time: 'Ayer', text: 'Se añadió un nuevo miembro en "Quiénes somos"', status: 'primary' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <div className="mt-1">
                                <div className={`w-3 h-3 rounded-full ${
                                    item.status === 'success' ? 'bg-green-500' :
                                    item.status === 'info' ? 'bg-[#00D0B0]' :
                                    'bg-[#233657]'
                                } shadow-sm`}></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-800 font-medium">{item.text}</p>
                                <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                            </div>
                            <button className="text-[#00D0B0] hover:text-[#233657] p-2 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
