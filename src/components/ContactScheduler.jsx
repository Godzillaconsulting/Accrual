import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Video, User } from 'lucide-react';
import contactBg from '../assets/full-shot-woman-couch-with-laptop.jpg';

const ContactScheduler = ({ showHeader = false, showMap = true }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    // Scheduler State
    const [bookingType, setBookingType] = useState('video');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [duration, setDuration] = useState('30min'); // '30min' or '60min'

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Calendar Navigation State
    const [currentDate, setCurrentDate] = useState(new Date()); // Initialize to Current Date

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to selected date on mount or update
        if (selectedDate && scrollContainerRef.current) {
            const selectedElement = document.getElementById('selected-day-scroll-item');
            if (selectedElement) {
                const container = scrollContainerRef.current;
                const scrollLeft = selectedElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (selectedElement.clientWidth / 2);
                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentDate, selectedDate]);

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'Por favor, escribe tu nombre';
        if (!formData.apellidos.trim()) newErrors.apellidos = 'Por favor, escribe tu apellido';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Por favor, introduce un correo válido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Por favor, introduce un correo electrónico válido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'Por favor, escribe tu número de teléfono';
        } else if (formData.telefono.length !== 10) {
            newErrors.telefono = 'El número debe tener 10 dígitos';
        }

        if (!formData.mensaje.trim()) newErrors.mensaje = 'Por favor, escribe tu asunto';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formData);
            setShowSuccess(true);
            setFormData({
                nombre: '',
                apellidos: '',
                email: '',
                telefono: '',
                mensaje: ''
            });
            setErrors({});
            // Hide success message after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (showSuccess) setShowSuccess(false);
    };

    // Calendar Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        // Adjust for Monday start (0=Mon, ..., 6=Sun) or keep Sunday start (0=Sun)
        // Design had LUN MAR MIE... so Monday start might be preferred visually in some regions, 
        // but JS getDay() is Sun=0. Let's assume standard grid where we map correct header.
        // If header is LUN MAR MIE JUE VIE SAB DOM, we need to shift getDay() result.
        // JS: 0 (Sun), 1 (Mon), 2 (Tue)...
        // WE WANT: 0 (Mon), 1 (Tue), ..., 6 (Sun)
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const formatMonthYear = (date) => {
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        const year = date.getFullYear();
        // Capitalize first letter of month and return "Month Year"
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="opacity-20 py-2"></div>);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday =
                i === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            // Check if it's the 15th of Jan 2026 for demo purpose (from original mockup)
            const isDemoSelected = i === 15 && currentDate.getMonth() === 0 && currentDate.getFullYear() === 2026;

            days.push(
                <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-full cursor-pointer hover:bg-[#0F4C82] hover:text-[#D0D0DA] transition-colors duration-300 ${isDemoSelected ? 'bg-[#0F4C82] text-[#D0D0DA] font-bold shadow-lg scale-110' : ''} ${isToday ? 'border border-[#233657]/40' : ''}`}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    return (
        <section className="relative w-full bg-[#D0D0DA]" id="contacto-form">
            {/* Contact Header Section */}
            {showHeader && (
                <div
                    className="py-16 text-center text-white bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${contactBg})` }}
                >
                    <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 tracking-tight">CONTACTO</h1>
                        <h2 className="text-xl md:text-2xl font-bold mb-2">Es tiempo de tomar un cambio</h2>
                        <p className="text-lg italic opacity-80 mb-12">"Tus problemas fiscales con soluciones reales"</p>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-md">
                                    <Phone className="w-5 h-5 text-[#233657]" />
                                </div>
                                <span className="whitespace-nowrap">+52 656 304 9604</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-md">
                                    <Mail className="w-5 h-5 text-[#233657]" />
                                </div>
                                <a href="mailto:contacto@accrual.com.mx" className="underline hover:text-white transition-colors">
                                    contacto@accrual.com.mx
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-md">
                                    <MapPin className="w-5 h-5 text-[#233657]" />
                                </div>
                                <span className="whitespace-nowrap">Calle Minerva 1174. Col. Olimpia</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Section: Google Map */}
            {showMap && (
                <div className="w-full h-[500px] bg-gray-300 relative z-0">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src="https://maps.google.com/maps?q=Calle+Minerva+1174.+Col.+Olimpia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        title="Google Map"
                        className="grayscale-[20%] contrast-[1.1] opacity-90"
                    ></iframe>
                    {/* Overlay to ensure map isn't too overpowering if needed, optional */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>
            )}


            {/* Overlapping Card Container */}
            <div className={`max-w-6xl mx-auto px-4 relative z-10 pb-20 ${showMap ? '-mt-32 md:-mt-40' : 'pt-20'}`}>
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Left: Form Section */}
                    <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 bg-white text-[#233657]">
                        <h2 className="text-3xl md:text-4xl font-black uppercase mb-10 leading-tight tracking-wide text-[#233657]">
                            Agenda una cita con <br /> Nosotros
                        </h2>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col group">
                                    <label className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70 group-focus-within:text-[#233657] transition-colors">Nombre(s) *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Juan José"
                                        className={`bg-transparent border-b border-gray-300 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-gray-400 ${errors.nombre ? 'border-red-500' : 'focus:border-[#233657]'}`}
                                    />
                                    {errors.nombre && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold italic">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.nombre}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col group">
                                    <label className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70 group-focus-within:text-[#233657] transition-colors">Apellidos *</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        placeholder="Pérez Rojas"
                                        className={`bg-transparent border-b border-gray-300 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-gray-400 ${errors.apellidos ? 'border-red-500' : 'focus:border-[#233657]'}`}
                                    />
                                    {errors.apellidos && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold italic">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.apellidos}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="flex flex-col group">
                                    <label className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70 group-focus-within:text-[#233657] transition-colors">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="correo@ejemplo.com"
                                        className={`bg-transparent border-b border-gray-300 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-gray-400 ${errors.email ? 'border-red-500' : 'focus:border-[#233657]'}`}
                                    />
                                    {errors.email && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold italic">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col group">
                                    <label className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70 group-focus-within:text-[#233657] transition-colors">Teléfono *</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        placeholder="10 dígitos"
                                        className={`bg-transparent border-b border-gray-300 outline-none py-2 transition-colors text-lg w-full placeholder:italic placeholder:text-gray-400 ${errors.telefono ? 'border-red-500' : 'focus:border-[#233657]'}`}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^0-9]/g, '');
                                            if (val.length > 10) val = val.slice(0, 10);
                                            setFormData(prev => ({ ...prev, telefono: val }));
                                            if (errors.telefono) setErrors(prev => ({ ...prev, telefono: '' }));
                                        }}
                                    />
                                    {errors.telefono && (
                                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold italic">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.telefono}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col group mt-4">
                                <label className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70 group-focus-within:text-[#233657] transition-colors">Mensaje *</label>
                                <textarea
                                    rows="2"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="¿En qué podemos ayudarte?"
                                    className={`bg-transparent border-b border-gray-300 outline-none py-2 transition-colors text-lg resize-none placeholder:italic placeholder:text-gray-400 ${errors.mensaje ? 'border-red-500' : 'focus:border-[#233657]'}`}
                                ></textarea>
                                {errors.mensaje && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold italic">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.mensaje}
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-xs italic opacity-50">*Campos obligatorios</p>
                                <button
                                    type="submit"
                                    className="bg-[#233657] text-white font-bold py-4 px-10 rounded-full uppercase transition-all shadow-lg text-sm tracking-widest hover:bg-[#0F4C82] transform hover:scale-105"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>

                            {showSuccess && (
                                <div className="mt-4 flex items-center justify-center gap-3 text-[#233657] font-bold italic bg-green-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <div className="bg-[#233657] rounded-full p-1">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                    <span>¡Mensaje enviado con éxito!</span>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right: Calendar Section (Dark) */}
                    <div className="lg:w-2/5 bg-[#233657] text-[#D0D0DA] p-6 md:p-10 flex flex-col relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F4C82] rounded-full filter blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#000000] rounded-full filter blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-xl font-bold mb-6 text-white text-center uppercase tracking-wide">
                                Agendar Asesoría
                            </h3>

                            {/* Appointment Type Toggle */}
                            <div className="bg-[#1a2844] p-1 rounded-xl flex mb-6 shadow-inner border border-white/5">
                                <button
                                    onClick={() => setBookingType('presencial')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${bookingType === 'presencial' ? 'bg-[#D0D0DA] text-[#233657] shadow-md' : 'text-[#D0D0DA]/60 hover:text-[#D0D0DA]'}`}
                                >
                                    <MapPin className="w-4 h-4" />
                                    Presencial
                                </button>
                                <button
                                    onClick={() => setBookingType('video')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${bookingType === 'video' ? 'bg-[#D0D0DA] text-[#233657] shadow-md' : 'text-[#D0D0DA]/60 hover:text-[#D0D0DA]'}`}
                                >
                                    <Video className="w-4 h-4" />
                                    Videollamada
                                </button>
                            </div>



                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-4 px-2">
                                <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-lg capitalize">{formatMonthYear(currentDate)}</span>
                                <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Horizontal Day List */}
                            <div className="mb-6 -mx-2">
                                <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 px-2 pb-2 scrollbar-hide mask-linear-fade">
                                    {(() => {
                                        // Generate next 14 days from active month start for demo
                                        const days = [];
                                        const daysInMonth = getDaysInMonth(currentDate);
                                        const startDay = 1; // Start from 1st of month for simplicity in this view

                                        // We'll show a scrolling strip of days for the selected month
                                        for (let i = 1; i <= daysInMonth; i++) {
                                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                                            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
                                            const isSelected = selectedDate && selectedDate.getDate() === i && selectedDate.getMonth() === currentDate.getMonth();

                                            days.push(
                                                <button
                                                    key={i}
                                                    id={isSelected ? 'selected-day-scroll-item' : undefined}
                                                    onClick={() => {
                                                        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
                                                        setSelectedTime(null); // Reset time when day changes
                                                    }}
                                                    className={`flex flex-col items-center justify-center min-w-[4.5rem] p-3 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? 'bg-[#D0D0DA] border-[#D0D0DA] text-[#233657] shadow-lg scale-105'
                                                        : 'bg-[#1a2844] border-white/10 text-[#D0D0DA]/70 hover:border-[#D0D0DA]/30 hover:bg-[#1a2844]/80'
                                                        }`}
                                                >
                                                    <span className="text-xs uppercase font-bold tracking-wider mb-1">{dayName}</span>
                                                    <span className="text-xl font-black">{i}</span>
                                                </button>
                                            );
                                        }
                                        return days;
                                    })()}
                                </div>
                            </div>

                            {/* Time Slots Grid */}
                            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        "09:00 am", "09:30 am", "10:00 am",
                                        "10:30 am", "11:00 am", "11:30 am",
                                        "12:00 pm", "12:30 pm", "01:00 pm",
                                        "03:00 pm", "03:30 pm", "04:00 pm",
                                        "04:30 pm", "05:00 pm", "05:30 pm"
                                    ].map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all duration-200 border ${selectedTime === time
                                                ? 'bg-[#0F4C82] border-[#0F4C82] text-white shadow-[0_0_15px_rgba(15,76,130,0.5)] transform scale-105'
                                                : 'bg-transparent border-[#D0D0DA]/20 text-[#D0D0DA] hover:border-[#0F4C82] hover:shadow-[0_0_10px_rgba(15,76,130,0.4)] hover:bg-[#0F4C82]/10'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs uppercase font-bold tracking-widest text-[#D0D0DA]/60 mb-3 text-center">Duración de la Asesoría</p>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        onClick={() => setDuration('30min')}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 border ${duration === '30min'
                                            ? 'bg-[#D0D0DA] text-[#233657] border-[#D0D0DA] shadow-[0_0_15px_rgba(208,208,218,0.4)]'
                                            : 'bg-transparent text-[#D0D0DA] border-[#D0D0DA]/30 hover:border-[#D0D0DA] hover:shadow-[0_0_10px_rgba(208,208,218,0.3)] hover:bg-[#D0D0DA]/5'}`}
                                    >
                                        Media hora
                                    </button>
                                    <button
                                        onClick={() => setDuration('60min')}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 border ${duration === '60min'
                                            ? 'bg-[#D0D0DA] text-[#233657] border-[#D0D0DA] shadow-[0_0_15px_rgba(208,208,218,0.4)]'
                                            : 'bg-transparent text-[#D0D0DA] border-[#D0D0DA]/30 hover:border-[#D0D0DA] hover:shadow-[0_0_10px_rgba(208,208,218,0.3)] hover:bg-[#D0D0DA]/5'}`}
                                    >
                                        Una hora
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!selectedTime) {
                                            alert('Por favor selecciona una hora para tu asesoría.');
                                            return;
                                        }
                                        const price = duration === '30min' ? 600 : 1000;
                                        navigate('/pago', { state: { bookingType, selectedDate, selectedTime, duration, price } });
                                    }}
                                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[#233657] shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${selectedTime ? 'bg-[#D0D0DA] hover:bg-white' : 'bg-[#D0D0DA]/50 cursor-not-allowed opacity-70'}`}
                                >
                                    Agendar Asesoría
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactScheduler;
