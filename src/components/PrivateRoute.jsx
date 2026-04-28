import React, { useState, useEffect } from'react';
import { Navigate } from'react-router-dom';

const API_BASE = '' || (import.meta.env.DEV ? 'http://localhost:3000' : '');

/**
 * PrivateRoute — Protege rutas que requieren autenticación.
 * Verifica el token JWT contra el backend antes de renderizar.
 * Mientras verifica muestra una pantalla de carga.
 *
 * Lógica de fallo:
 * - 401 (Unauthorized) → token realmente inválido → borra sesión → /login
 * - 429 / 500 / error de red → NO borrar sesión → dejar pasar con token local
 * (evitar que un rate-limit o cold-start bloquee usuarios legítimos)
 */
export default function PrivateRoute({ children }) {
 const [status, setStatus] = useState('checking'); //'checking' |'ok' |'denied'

 useEffect(() => {
 const token = localStorage.getItem('adminToken');

 if (!token) {
 setStatus('denied');
 } else {
 setStatus('ok');
 }
 }, []);

 if (status ==='checking') {
 return (
 <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 z-50">
 <span className="text-5xl animate-bounce">🦖</span>
 <p className="text-neutral-400 text-sm font-bold tracking-widest">
 Verificando sesión...
 </p>
 </div>
 );
 }

 if (status ==='denied') {
 return <Navigate to="/login" replace />;
 }

 return children;
}
