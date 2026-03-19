import React, { useState } from 'react';

const LeadMagnet = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) throw new Error('Error saving lead');
            
            setStatus('success');
            // Timeout to simulate downloading experience
            setTimeout(() => {
                setStatus('idle');
                setEmail('');
                // window.open('/path/to/pdf.pdf', '_blank'); // Here the client will put the actual PDF link later
            }, 3500);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section className="bg-[#D0D0DA] py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <img loading="lazy"  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-6xl mx-auto bg-[#233657]/40 backdrop-blur-2xl border border-[#D0D0DA]/20 rounded-[3rem] p-16 text-center text-[#D0D0DA] min-h-[400px] flex flex-col items-center justify-center shadow-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    ¿No estás listo para <br /> contratar?
                </h2>

                <p className="text-xl mb-8 opacity-90">Infórmate primero. Descarga nuestra guía gratuita.</p>

                {status === 'success' ? (
                    <div className="bg-green-500/20 text-green-100 p-8 rounded-2xl border border-green-500/50 backdrop-blur-md animate-pulse">
                        <h3 className="text-2xl font-bold mb-2">¡Gracias por registrarte! 🎉</h3>
                        <p className="text-lg">Tu descarga comenzará en breve...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Tu correo electrónico" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-full text-[#233657] font-medium outline-none border-2 border-transparent focus:border-[#0F4C82] shadow-inner"
                        />
                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full sm:w-auto bg-[#D0D0DA] hover:bg-white text-[#233657] font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Descargar PDF'}
                        </button>
                    </form>
                )}
                
                {status === 'error' && (
                    <p className="text-red-300 mt-4 font-bold bg-red-900/40 px-4 py-2 rounded-lg">
                        Ocurrió un error de red. Intenta nuevamente.
                    </p>
                )}
            </div>
        </section>
    );
};

export default LeadMagnet;
