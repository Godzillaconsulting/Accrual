import React from 'react';

const LeadMagnet = () => {
    return (
        <section className="bg-[#D0D0DA] py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-6xl mx-auto bg-[#233657]/40 backdrop-blur-2xl border border-[#D0D0DA]/20 rounded-[3rem] p-16 text-center text-[#D0D0DA] min-h-[400px] flex flex-col items-center justify-center shadow-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    ¿No estás listo para <br /> contratar?
                </h2>

                <p className="text-xl mb-12 opacity-90">Infórmate primero.</p>

                <button className="bg-[#D0D0DA]/10 hover:bg-[#233657] text-[#D0D0DA] font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-all transform hover:scale-105 backdrop-blur-md border border-[#D0D0DA]/20">
                    Descargar PDF
                </button>
            </div>
        </section>
    );
};

export default LeadMagnet;
