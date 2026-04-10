import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutDashboard, ShoppingBag, Boxes, Users, List, Layers, Package, ClipboardList, Palette, Ruler, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/admin/dashboard' },
  { label: 'Productos', icon: <ShoppingBag size={20} />, to: '/admin/productos', sub: [
    { label: 'Categorías', icon: <List size={18} />, to: '/admin/categorias' },
    { label: 'Subcategorías', icon: <Layers size={18} />, to: '/admin/subcategorias' },
    { label: 'Productos', icon: <Package size={18} />, to: '/admin/productos' },
    { label: 'Variantes', icon: <Boxes size={18} />, to: '/admin/variantes' },
    { label: 'Colores', icon: <Palette size={18} />, to: '/admin/colores' },
    { label: 'Tallas', icon: <Ruler size={18} />, to: '/admin/tallas' },
  ]},
  { label: 'Inventario', icon: <Boxes size={20} />, to: '/admin/inventario' },
  { label: 'Movimientos', icon: <ClipboardList size={20} />, to: '/admin/movimientos' },
  { label: 'Pedidos', icon: <ClipboardList size={20} />, to: '/admin/pedidos' },
  { label: 'Usuarios', icon: <Users size={20} />, to: '/admin/usuarios' },
  { label: 'Configuración', icon: <Settings size={20} />, to: '/admin/configuracion' },
];

export default function AdminLayout() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex min-h-screen bg-fondo">
      {/* Sidebar */}
      <aside className={`bg-secundario text-primario w-64 transition-all duration-300 ${sidebarOpen ? 'block' : 'w-16'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gris">
          <span className="font-bold text-acento text-xl">FS</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gris ml-2">{sidebarOpen ? '<' : '>'}</button>
        </div>
        <nav className="mt-4">
          {navItems.map((item, idx) => (
            <div key={idx}>
              <Link to={item.to} className="flex items-center gap-3 px-4 py-2 hover:bg-fondo rounded transition">
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
              {item.sub && sidebarOpen && (
                <div className="ml-8">
                  {item.sub.map((sub, subIdx) => (
                    <Link key={subIdx} to={sub.to} className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-fondo rounded transition">
                      {sub.icon}
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-secundario border-b border-gris flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{usuario?.nombre}</span>
            <span className="text-xs text-gris">({usuario?.email})</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-error hover:text-acento transition">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </header>
        <main className="flex-1 p-8 bg-fondo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
