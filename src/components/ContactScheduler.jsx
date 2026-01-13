import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const ContactScheduler = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

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

    return (
        <section className="bg-[#e0e0e0] py-24 px-4 relative overflow-hidden">
            {/* Decorative background elements for glass effect to be visible */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <img src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#47544b] rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#2d3830] rounded-full filter blur-[100px] opacity-20"></div>

            {/* Main Container Container - Refined Glass Effect */}
            <div className="max-w-6xl mx-auto bg-[#2d3830]/40 backdrop-blur-2xl border border-[#e0e0e0]/20 rounded-[2rem] p-8 md:p-16 text-[#e0e0e0] shadow-2xl relative z-10">

                {/* Header - Centered */}
                <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-16 leading-tight tracking-wide">
                    Agenda una cita con <br /> Nosotros
                </h2>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Left: Form (Takes up 3 cols) */}
                    <div className="lg:col-span-3">
                        <form className="space-y-10" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                                <div className="flex flex-col group">
                                    <label className="text-base font-medium mb-2 opacity-90 group-focus-within:text-[#2d3830] transition-colors whitespace-nowrap">Nombre(s) *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Juan José"
                                        className={`bg-transparent border-b-2 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-[#e0e0e0]/40 ${errors.nombre ? 'border-red-500' : 'border-[#e0e0e0]/50 focus:border-[#2d3830]'}`}
                                    />
                                    {errors.nombre && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-bold italic">
                                            <AlertCircle className="w-4 h-4 fill-red-500 text-[#e0e0e0]" />
                                            {errors.nombre}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col group">
                                    <label className="text-base font-medium mb-2 opacity-90 group-focus-within:text-[#2d3830] transition-colors whitespace-nowrap">Apellidos *</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        placeholder="Pérez Rojas"
                                        className={`bg-transparent border-b-2 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-[#e0e0e0]/40 ${errors.apellidos ? 'border-red-500' : 'border-[#e0e0e0]/50 focus:border-[#2d3830]'}`}
                                    />
                                    {errors.apellidos && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-bold italic">
                                            <AlertCircle className="w-4 h-4 fill-red-500 text-[#e0e0e0]" />
                                            {errors.apellidos}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                                <div className="flex flex-col group">
                                    <label className="text-base font-medium mb-2 opacity-90 group-focus-within:text-[#2d3830] transition-colors whitespace-nowrap">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="juanjoseperezrojas@outlook.com"
                                        className={`bg-transparent border-b-2 outline-none py-2 transition-colors text-lg placeholder:italic placeholder:text-[#e0e0e0]/40 ${errors.email ? 'border-red-500' : 'border-[#e0e0e0]/50 focus:border-[#2d3830]'}`}
                                    />
                                    {errors.email && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-bold italic">
                                            <AlertCircle className="w-4 h-4 fill-red-500 text-[#e0e0e0]" />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col group">
                                    <label className="text-base font-medium mb-2 opacity-90 group-focus-within:text-[#2d3830] transition-colors whitespace-nowrap">Número de teléfono *</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        placeholder="Ingresa tu número a 10 dígitos"
                                        className={`bg-transparent border-b-2 outline-none py-2 transition-colors text-lg w-full placeholder:italic placeholder:text-[#e0e0e0]/40 ${errors.telefono ? 'border-red-500' : 'border-[#e0e0e0]/50 focus:border-[#2d3830]'}`}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^0-9]/g, '');
                                            if (val.length > 10) val = val.slice(0, 10);
                                            setFormData(prev => ({ ...prev, telefono: val }));
                                            if (errors.telefono) setErrors(prev => ({ ...prev, telefono: '' }));
                                        }}
                                    />
                                    {errors.telefono && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-bold italic">
                                            <AlertCircle className="w-4 h-4 fill-red-500 text-[#e0e0e0]" />
                                            {errors.telefono}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col group mt-4">
                                <label className="text-base font-medium mb-4 opacity-90 group-focus-within:text-[#2d3830] transition-colors whitespace-nowrap">¿Qué podemos hacer por ti? *</label>
                                <textarea
                                    rows="2"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Escribe tu mensaje"
                                    className={`bg-transparent border-b-2 outline-none py-2 transition-colors text-lg resize-none placeholder:italic placeholder:text-[#e0e0e0]/40 ${errors.mensaje ? 'border-red-500' : 'border-[#e0e0e0]/50 focus:border-[#2d3830]'}`}
                                ></textarea>
                                {errors.mensaje && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-bold italic">
                                        <AlertCircle className="w-4 h-4 fill-red-500 text-[#e0e0e0]" />
                                        {errors.mensaje}
                                    </div>
                                )}
                            </div>

                            <div className="pt-8">
                                <p className="text-sm italic opacity-60 mb-4">*Este campo es obligatorio</p>
                                <button
                                    type="submit"
                                    className="bg-[#e0e0e0]/10 hover:bg-[#2d3830] text-[#e0e0e0] font-bold py-4 px-12 rounded-full uppercase w-full transition-all shadow-lg text-lg tracking-wide transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md border border-[#e0e0e0]/20"
                                >
                                    Enviar
                                </button>

                                {showSuccess && (
                                    <div className="mt-6 flex items-center justify-center gap-3 text-[#2d3830] font-bold italic animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-[#2d3830] rounded-full p-1">
                                            <Check className="w-4 h-4 text-[#e0e0e0]" strokeWidth={3} />
                                        </div>
                                        <span>El correo ha sido enviado exitosamente</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right: Calendar Mockup (Takes up 2 cols) */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <div className="bg-[#1a231e]/40 rounded-xl p-6 shadow-xl border border-[#e0e0e0]/20 backdrop-blur-md">
                            <div className="bg-[#47544b] text-[#e0e0e0] text-center py-3 font-semibold rounded-t-lg mb-4">
                                Enero 2026
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 opacity-80 font-medium">
                                <div>LUN</div><div>MAR</div><div>MIE</div><div>JUE</div><div>VIE</div><div>SAB</div><div>DOM</div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {/* Offset for start of month */}
                                <div className="opacity-30 py-2">29</div><div className="opacity-30 py-2">30</div><div className="opacity-30 py-2">31</div>
                                {[...Array(31)].map((_, i) => (
                                    <div key={i} className={`py-2 rounded cursor-pointer hover:bg-[#e0e0e0]/10 transition-colors flex items-center justify-center ${i + 1 === 15 ? 'bg-[#2d3830] text-[#e0e0e0] font-bold h-8 w-8 mx-auto rounded-full' : ''}`}>
                                        {i + 1}
                                    </div>
                                ))}
                                <div className="opacity-30 py-2">1</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactScheduler;
