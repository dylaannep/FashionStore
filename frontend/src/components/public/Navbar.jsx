import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriasService, subcategoriasService } from '../../api/services';
import { useAuthStore } from '../../store/authStore';
import { useCart } from '../../store/CartContext';
import { ChevronDown, Menu, X, ShoppingCart, Search, Heart, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        categoriasService.getAll(),
        subcategoriasService.getAll()
      ]);
      // Filtrar solo categorías activas
      const categoriasActivas = catRes.data.filter(cat => cat.activo === true || cat.activo === 1);
      setCategorias(categoriasActivas);
      // Filtrar solo subcategorías activas
      const subcategoriasActivas = subRes.data.filter(sub => sub.activo === true || sub.activo === 1);
      setSubcategorias(subcategoriasActivas);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriasPorCategoria = (categoriaId) => {
    return subcategorias.filter((sub) => sub.categoria_id === categoriaId);
  };

  const getCategoriaId = (cat) => {
    // El API puede devolver id o id_categoria
    return cat.id || cat.id_categoria;
  };

  const getSubcategoriaId = (sub) => {
    // El API puede devolver id o id_subcategoria
    return sub.id || sub.id_subcategoria;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-100 py-2 px-4 md:px-6 flex justify-between items-center text-xs text-gray-600">
        <div className="flex gap-4">
          <a href="#" className="hover:text-black transition">✓ Envío gratis en compras mayores a $50.000</a>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-black transition">Ayuda</a>
          <a href="#" className="hidden md:inline hover:text-black transition">Contacto</a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight whitespace-nowrap">
          FASHION<span className="text-red-600">STORE</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-gray-600 transition">
            Inicio
          </Link>

          {/* Categories Mega Menu */}
          <div className="relative group">
            <button className="text-sm font-medium hover:text-gray-600 transition flex items-center gap-1">
              Categorías
              <ChevronDown size={16} />
            </button>

            {/* Mega Menu */}
            <div className="absolute left-0 top-full hidden group-hover:block w-auto bg-white shadow-2xl rounded-lg py-8 min-w-max">
              {loading ? (
                <div className="px-8 py-4 text-gray-500 text-sm">Cargando...</div>
              ) : (
                <div className="grid grid-cols-3 gap-8 px-8">
                  {categorias.map((cat) => {
                    const catId = getCategoriaId(cat);
                    const subs = getSubcategoriasPorCategoria(catId);
                    return (
                      <div key={catId}>
                        <Link
                          to={`/categoria/${catId}`}
                          className="block text-sm font-bold text-gray-900 mb-3 hover:text-red-600 transition"
                        >
                          {cat.nombre}
                        </Link>
                        <ul className="space-y-2">
                          {subs.map((sub) => {
                            const subId = getSubcategoriaId(sub);
                            return (
                              <li key={subId}>
                                <Link
                                  to={`/categoria/${catId}?subcategoria=${subId}`}
                                  className="text-xs text-gray-600 hover:text-gray-900 transition"
                                >
                                  {sub.nombre}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <Link to="/nuevos" className="text-sm font-medium hover:text-gray-600 transition">
            Nuevos
          </Link>
          <Link to="/ofertas" className="text-sm font-medium hover:text-gray-600 transition">
            Ofertas
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 outline-none text-sm flex-1"
          />
          <button type="submit" className="p-1 hover:text-gray-600 transition">
            <Search size={18} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition">
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition relative">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <Link 
            to="/carrito" 
            className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition relative"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Login / User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMenuOpen && (
        <form onSubmit={handleSearch} className="lg:hidden border-t border-gray-100 px-4 py-3 bg-gray-50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white outline-none text-sm flex-1 px-3 py-2 rounded-lg"
          />
          <button type="submit" className="p-2 hover:text-gray-600 transition">
            <Search size={18} />
          </button>
        </form>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 py-4 px-4 bg-white">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm font-medium py-2 hover:text-gray-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>

            {/* Categories Accordion */}
            <div>
              <button 
                onClick={() => setActiveCategory(activeCategory === 'all' ? null : 'all')}
                className="text-sm font-medium py-2 w-full text-left flex items-center justify-between hover:text-gray-600 transition"
              >
                Categorías
                <ChevronDown size={16} className={`transition-transform ${activeCategory === 'all' ? 'rotate-180' : ''}`} />
              </button>
              {activeCategory === 'all' && (
                <div className="pl-4 flex flex-col gap-2 mt-2">
                  {categorias.map((cat) => {
                    const subs = getSubcategoriasPorCategoria(cat.id);
                    return (
                      <div key={cat.id}>
                        <Link
                          to={`/categoria/${cat.id}`}
                          className="text-sm font-semibold text-gray-900 py-2 block hover:text-red-600 transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {cat.nombre}
                        </Link>
                        {subs.length > 0 && (
                          <div className="pl-4 flex flex-col gap-1 mb-2">
                            {subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/categoria/${cat.id}?subcategoria=${sub.id}`}
                                className="text-xs text-gray-600 hover:text-gray-900 transition"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {sub.nombre}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/nuevos"
              className="text-sm font-medium py-2 hover:text-gray-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Nuevos
            </Link>
            <Link
              to="/ofertas"
              className="text-sm font-medium py-2 hover:text-gray-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Ofertas
            </Link>

            {/* Mobile Cart & Wishlist */}
            <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <Heart size={18} />
                  <span className="text-sm font-medium">Favoritos</span>
                </button>
                <Link 
                  to="/carrito"
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={18} />
                  <span className="text-sm font-medium">Carrito</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
