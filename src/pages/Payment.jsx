import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Lock, Calendar, Clock, MapPin, Video, ChevronLeft, ShieldCheck } from 'lucide-react';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingType, selectedDate, selectedTime, duration, price } = location.state || {
        bookingType: 'video',
        selectedDate: new Date(),
        selectedTime: '09:00 am',
        duration: '30min',
        price: 600
    };

    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');
        } else if (name === 'cvc') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardData(prev => ({ ...prev, [name]: formattedValue }));
    };

    return (
        <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#233657] font-bold mb-8 hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Volver
                    </button>

                    <h1 className="text-3xl md:text-4xl font-black uppercase text-[#233657] mb-12">Finalizar Reserva</h1>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left: Payment Form */}
                        <div className="lg:w-2/3 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-[#233657]/5 rounded-xl">
                                    <CreditCard className="w-6 h-6 text-[#233657]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#233657]">Información de Pago</h2>
                                    <p className="text-sm text-gray-400">Transacción segura y encriptada</p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Número de Tarjeta</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="number"
                                            value={cardData.number}
                                            onChange={handleInputChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#233657] focus:ring-1 focus:ring-[#233657] transition-all font-mono text-lg"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nombre del Titular</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={cardData.name}
                                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                        placeholder="COMO APARECE EN LA TARJETA"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#233657] focus:ring-1 focus:ring-[#233657] transition-all uppercase"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Expiración</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardData.expiry}
                                            onChange={handleInputChange}
                                            placeholder="MM/AA"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#233657] focus:ring-1 focus:ring-[#233657] transition-all font-mono text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">CVC</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={cardData.cvc}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#233657] focus:ring-1 focus:ring-[#233657] transition-all font-mono text-center"
                                            />
                                            <Lock className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-[#233657] text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg hover:bg-[#0F4C82] hover:scale-[1.02] transform transition-all duration-300 mt-4 flex items-center justify-center gap-3">
                                    <Lock className="w-4 h-4" />
                                    Pagar y Confirmar Cita
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Pagos procesados de forma segura</span>
                                </div>
                            </form>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-[#233657] text-[#D0D0DA] p-8 rounded-3xl shadow-xl relative overflow-hidden sticky top-32">
                                {/* Decorative Background */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#0F4C82] rounded-full filter blur-[60px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>

                                <h3 className="text-xl font-bold uppercase tracking-widest border-b border-[#D0D0DA]/20 pb-6 mb-6">Resumen de Cita</h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#D0D0DA]/10 rounded-lg">
                                            {bookingType === 'video' ? <Video className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-[#D0D0DA]/60 mb-1">Modalidad</p>
                                            <p className="font-medium text-white capitalize">{bookingType === 'video' ? 'Videollamada' : 'Presencial'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#D0D0DA]/10 rounded-lg">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-[#D0D0DA]/60 mb-1">Fecha</p>
                                            <p className="font-medium text-white capitalize">{formatDate(selectedDate)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#D0D0DA]/10 rounded-lg">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-[#D0D0DA]/60 mb-1">Hora</p>
                                            <p className="font-medium text-white">{selectedTime || 'Selecciona una hora'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#D0D0DA]/10 rounded-lg">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold text-[#D0D0DA]/60 mb-1">Duración</p>
                                            <p className="font-medium text-white">{duration === '60min' ? '1 Hora' : 'Media Hora'}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[#D0D0DA]/20 mt-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-medium opacity-80">Total a pagar</span>
                                            <span className="text-3xl font-black text-white">${price.toLocaleString()} <span className="text-sm font-normal text-[#D0D0DA]/60">MXN</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Payment;
