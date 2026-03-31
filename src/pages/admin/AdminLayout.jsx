import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import accrualLogo from '../../assets/Accrual logo (sin slogan).png';
import { Home, Users, Briefcase, FileText, Settings, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Homepage', path: '/admin/homepage', icon: Home },
        { name: 'Quiénes somos', path: '/admin/quienes-somos', icon: Users },
        { name: 'Servicios', path: '/admin/servicios', icon: Briefcase },
        { name: 'Artículos', path: '/admin/articulos', icon: FileText },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/');
    };

    return (
        <div className="flex bg-[#F3F4F6] min-h-screen text-gray-800 font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[#233657] text-white shadow-2xl transition-all duration-300 z-20">
                <div className="flex items-center justify-center h-20 border-b border-white/10 px-6">
                    <Link to="/" className="w-full flex items-center justify-center transition-transform duration-300 hover:scale-105" title="Ir a la página principal">
                        <img src={accrualLogo} alt="Accrual Logo" className="max-h-12 w-auto object-contain drop-shadow-lg" />
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                                    isActive
                                        ? 'bg-[#00D0B0] text-[#233657] font-semibold shadow-md transform scale-105'
                                        : 'text-[#D0D0DA] hover:bg-white/10 hover:text-white hover:translate-x-1'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[#D0D0DA] hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#233657] text-white fixed top-0 w-full z-30 shadow-md h-16">
                <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105" title="Ir a la página principal">
                    <img src={accrualLogo} alt="Accrual Logo" className="h-8 w-auto object-contain drop-shadow-md" />
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white/10 rounded-md text-white hover:bg-white/20 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-20 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    {/* Sidebar */}
                    <aside className="w-64 bg-[#233657] text-white flex flex-col pt-20 relative z-30 shadow-2xl animate-fade-in-right">
                        <nav className="flex-1 py-4 px-3 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.exact}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-[#00D0B0] text-[#233657] font-semibold'
                                                : 'text-[#D0D0DA] hover:bg-white/10 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-[#D0D0DA] hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D0B0]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#233657]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

                {/* Header for Desktop */}
                <header className="hidden md:flex h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm items-center px-8 justify-end z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#233657] text-white flex items-center justify-center font-bold shadow-md">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Administrador</p>
                            <p className="text-xs text-gray-500">contacto@accrual.com.mx</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
