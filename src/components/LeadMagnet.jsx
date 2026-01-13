import React from 'react';

const LeadMagnet = () => {
    return (
        <section className="bg-[#e0e0e0] py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-6xl mx-auto bg-[#2d3830]/40 backdrop-blur-2xl border border-[#e0e0e0]/20 rounded-[3rem] p-16 text-center text-[#e0e0e0] min-h-[400px] flex flex-col items-center justify-center shadow-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    ¿No estás listo para <br /> contratar?
                </h2>

                <p className="text-xl mb-12 opacity-90">Infórmate primero.</p>

                <button className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#e0e0e0]/20">
                    Descargar PDF
                </button>
            </div>
        </section>
    );
};

export default LeadMagnet;
