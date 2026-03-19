import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Lock, Calendar, Clock, MapPin, Video, ChevronLeft, ShieldCheck, CheckCircle, Building, Upload } from 'lucide-react';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Default fallback in case page is accessed without state
    const { appointmentId, bookingType, selectedDate, selectedTime, duration, price, formData } = location.state || {
        appointmentId: null,
        bookingType: 'video',
        selectedDate: new Date(),
        selectedTime: '09:00 am',
        duration: '30min',
        price: 600,
        formData: {}
    };

    const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'transfer' | 'card'
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvc: '' });

    const formatDate = (date) => {
        if (!date) return '';
        // Date might come as string from state serialization, parse it
        return new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const confirmAppointment = async (status) => {
        if (!appointmentId) {
            alert('Cita de prueba simulada. (En producción esto actualizaría el ID real en la BD).');
            return true; 
        }
        
        try {
            const res = await fetch('/api/appointments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, status, paymentMethod })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return true;
        } catch (err) {
            console.error(err);
            alert('Error al confirmar la cita en el servidor.');
            return false;
        }
    };

    const handleTransferSubmit = async () => {
        setIsProcessing(true);
        const success = await confirmAppointment('pending_verification');
        setIsProcessing(false);
        if (success) setIsSuccess(true);
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvc) {
            alert('Por favor completa los datos de la tarjeta.');
            return;
        }
        setIsProcessing(true);
        // Simulate Stripe delay
        await new Promise(r => setTimeout(r, 1500));
        const success = await confirmAppointment('paid');
        setIsProcessing(false);
        if (success) setIsSuccess(true);
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

    if (isSuccess) {
        return (
            <div className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
                    <div className="max-w-xl w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-gray-100">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#233657] mb-4">
                            ¡Cita Reservada!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            {paymentMethod === 'transfer' 
                                ? 'Hemos registrado tu reservación. Por favor envía tu comprobante de pago por correo o WhatsApp para confirmar tu espacio definitivamente.' 
                                : 'Tu pago con tarjeta ha sido aprobado. Te enviamos un correo con los detalles de acceso a tu asesoría.'}
                        </p>
                        
                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left border border-gray-100">
                            <p className="font-bold text-[#233657] mb-2">{formData?.nombre} {formData?.apellidos}</p>
                            <p className="text-sm text-gray-600 capitalize mb-1"><strong>Fecha:</strong> {formatDate(selectedDate)}</p>
                            <p className="text-sm text-gray-600 uppercase mb-1"><strong>Hora:</strong> {selectedTime}</p>
                            <p className="text-sm text-gray-600 uppercase"><strong>Modo:</strong> {bookingType === 'video' ? 'Videollamada' : 'Presencial'}</p>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-[#233657] hover:bg-[#0F4C82] text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl w-full"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </main>
            </div>
        );
    }

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
                        Volver al Calendario
                    </button>

                    <h1 className="text-3xl md:text-4xl font-black uppercase text-[#233657] mb-12">Finalizar Reserva</h1>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left: Payment Form */}
                        <div className="lg:w-2/3 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                            
                            {/* Payment Method Tabs */}
                            <div className="flex p-1 bg-gray-100 rounded-xl mb-10 border border-gray-200">
                                <button
                                    onClick={() => setPaymentMethod('transfer')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${paymentMethod === 'transfer' ? 'bg-white text-[#233657] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Building className="w-4 h-4" />
                                    Transferencia / Depósito
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${paymentMethod === 'card' ? 'bg-white text-[#233657] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Tarjeta (Stripe)
                                </button>
                            </div>

                            {paymentMethod === 'transfer' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-[#233657]/5 rounded-xl">
                                            <Building className="w-6 h-6 text-[#233657]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[#233657]">Datos Bancarios</h2>
                                            <p className="text-sm text-gray-500">Realiza tu pago vía SPEI o en sucursal</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8 space-y-4">
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 text-sm font-medium">Banco:</span>
                                            <span className="font-bold text-[#233657]">BBVA Bancomer</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 text-sm font-medium">Beneficiario:</span>
                                            <span className="font-bold text-[#233657]">Accrual Consultoría SC</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 text-sm font-medium">Cuenta:</span>
                                            <span className="font-bold text-[#233657] font-mono">0123456789</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 text-sm font-medium">CLABE Interbancaria:</span>
                                            <span className="font-bold text-[#233657] font-mono">012 320 0123456789 0</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-gray-500 text-sm font-medium">Concepto (Opcional):</span>
                                            <span className="font-bold text-[#233657] font-mono uppercase bg-blue-100 px-3 py-1 rounded">CITA-{formData?.nombre?.substring(0,3)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-xl flex items-start gap-3 mb-8">
                                        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                                        <p>
                                            <strong>Instrucciones:</strong> Al hacer clic en "Confirmar", bloquearemos tu lugar en el calendario automáticamente. Tienes un plazo de <strong>2 horas</strong> para enviarnos tu comprobante de pago por WhatsApp y que la cita quede 100% asegurada.
                                        </p>
                                    </div>

                                    <button 
                                        onClick={handleTransferSubmit}
                                        disabled={isProcessing}
                                        className={`w-full text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(35,54,87,0.2)] transform transition-all duration-300 mt-4 flex items-center justify-center gap-3 ${isProcessing ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#233657] hover:bg-[#0F4C82] hover:scale-[1.02]'}`}>
                                        {isProcessing ? (
                                            <span>Registrando Cita...</span>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Ya realicé (o realizaré) la transferencia
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {paymentMethod === 'card' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-[#233657]/5 rounded-xl">
                                            <CreditCard className="w-6 h-6 text-[#233657]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[#233657]">Información de Tarjeta</h2>
                                            <p className="text-sm text-gray-500">Transacción segura procesada por Stripe</p>
                                        </div>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleCardSubmit}>
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

                                        <button 
                                            type="submit"
                                            disabled={isProcessing}
                                            className={`w-full text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(35,54,87,0.2)] transform transition-all duration-300 mt-4 flex items-center justify-center gap-3 ${isProcessing ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#233657] hover:bg-[#0F4C82] hover:scale-[1.02]'}`}>
                                            {isProcessing ? (
                                                <span>Procesando Pago Seguro...</span>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    Pagar en Línea
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4 font-medium">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                            <span>Pagos encriptados con seguridad bancaria de nivel militar.</span>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-[#233657] text-[#D0D0DA] p-8 rounded-3xl shadow-xl relative overflow-hidden lg:sticky lg:top-32">
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
                                            <span className="text-4xl font-black text-white">${price?.toLocaleString()} <span className="text-sm font-normal text-[#D0D0DA]/60">MXN</span></span>
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
