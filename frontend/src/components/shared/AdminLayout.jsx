import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutDashboard, ShoppingBag, Boxes, Users, List, Layers, Package, ClipboardList, Palette, Ruler, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/admin/dashboard' },
  { label: 'Productos', icon: <ShoppingBag size={20} />, to: '/admin/productos', sub: [
    { label: 'Categorías', icon: <List size={18} />, to: '/admin/categorias' },
    { label: 'Subcategorías', icon: <Layers size={18} />, to: '/admin/subcategorias' },
    { label: 'Productos', icon: <Package size={18} />, to: '/admin/productos' },
    { label: 'Variantes', icon: <Boxes size={18} />, to: '/admin/producto-variantes' },
    { label: 'Colores', icon: <Palette size={18} />, to: '/admin/colores' },
    { label: 'Tallas', icon: <Ruler size={18} />, to: '/admin/tallas' },
  ]},
  { label: 'Inventario', icon: <Boxes size={20} />, to: '/admin/inventario' },
  { label: 'Movimientos', icon: <ClipboardList size={20} />, to: '/admin/movimientos' },
  { label: 'Pedidos', icon: <ClipboardList size={20} />, to: '/admin/pedidos' },
  { label: 'Usuarios', icon: <Users size={20} />, to: '/admin/usuarios' },
  { label: 'Configuración', icon: <Settings size={20} />, to: '/admin/configuracion' },
];

const AdminLayout = () => {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-fondo">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex flex-col">
        <div className="p-4 text-lg font-bold">FashionStore</div>
        <nav className="flex-1">
          <ul>
            {navItems.map((item, idx) => (
              <li key={idx} className="hover:bg-sidebarHover px-4 py-2">
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-2 hover:bg-acento/10 rounded transition ${isActive ? 'bg-acento/10 text-acento border-l-2 border-acento' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
                {item.sub && (
                  <ul className="ml-4">
                    {item.sub.map((sub, subIdx) => (
                      <li key={subIdx} className="hover:bg-sidebarHover px-4 py-2">
                        <NavLink
                          to={sub.to}
                          className={({ isActive }) => `flex items-center gap-2 px-2 py-1 text-sm hover:bg-acento/10 rounded transition ${isActive ? 'bg-acento/10 text-acento' : ''}`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{usuario?.nombre}</span>
            <span className="text-xs text-gris">({usuario?.email})</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-error hover:text-acento transition">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </header>
        <div className="flex-1 p-4 bg-fondo">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
