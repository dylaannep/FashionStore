import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import ProductFilters from '../../components/public/ProductFilters';
import ProductoCard from '../../components/public/ProductoCard';
import { productosService, variantesService, categoriasService, subcategoriasService, coloresService, tallasService } from '../../api/services';

export default function StorePage() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: null,
    subcategoria: null,
    tallas: [],
    colores: [],
    precioMin: 0,
    precioMax: 1000000,
  });
  const [sortBy, setSortBy] = useState('nuevo');

  // Determinar si es Nuevos u Ofertas basado en la ruta
  const isNuevos = location.pathname === '/nuevos';
  const isOfertas = location.pathname === '/ofertas';
  const pageTitle = isNuevos ? 'Productos Nuevos' : isOfertas ? 'Ofertas Especiales' : 'Todos los Productos';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, varRes, catRes, subRes, colRes, talRes] = await Promise.all([
        productosService.getAll(),
        variantesService.getAll(),
        categoriasService.getAll(),
        subcategoriasService.getAll(),
        coloresService.getAll(),
        tallasService.getAll(),
      ]);

      // Filter solo productos activos
      let productosActivos = prodRes.data.filter((p) => p.activo === true || p.activo === 1);

      // Si es página de Nuevos, filtrar productos de los últimos 7 días
      if (isNuevos) {
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        productosActivos = productosActivos.filter((p) => {
          const fechaCreacion = new Date(p.fecha_creacion);
          return fechaCreacion >= hace7Dias;
        });
      }

      // Si es página de Ofertas, filtrar productos con descuento > 0
      if (isOfertas) {
        // Primero obtener variantes activas para verificar si tienen descuento
        const variantesActivas = varRes.data.filter((v) => (v.activo === true || v.activo === 1) && v.stock > 0);
        const productosConDescuento = new Set();
        variantesActivas.forEach((v) => {
          if (v.descuento > 0) {
            productosConDescuento.add(v.producto_id);
          }
        });
        productosActivos = productosActivos.filter((p) => productosConDescuento.has(p.id));
      }

      setProductos(productosActivos);
      
      // Filter solo variantes activas (incluyendo las sin stock, para mostrar como agotadas)
      const variantesActivas = varRes.data.filter((v) => (v.activo === true || v.activo === 1));
      setVariantes(variantesActivas);
      
      // Filtrar solo categorías activas
      const categoriasActivas = catRes.data.filter((c) => c.activo === true || c.activo === 1);
      setCategorias(categoriasActivas);
      
      // Filtrar solo subcategorías activas
      const subcategoriasActivas = subRes.data.filter((s) => s.activo === true || s.activo === 1);
      setSubcategorias(subcategoriasActivas);
      
      setColores(colRes.data);
      setTallas(talRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (productosActuales) => {
    return productosActuales.filter((producto) => {
      const prodId = producto.id_producto || producto.id;
      const subCatId = producto.id_subcategoria || producto.subcategoria_id;
      
      // Filter por categoría
      if (filtros.categoria) {
        // Buscar la subcategoría del producto para verificar su categoría
        const subCatDelProd = subcategorias.find(s => {
          const sId = s.id_subcategoria || s.id;
          return sId === subCatId;
        });
        if (!subCatDelProd) return false;
        const catId = subCatDelProd.id_categoria || subCatDelProd.categoria_id;
        if (catId !== filtros.categoria) return false;
      }

      // Filter por subcategoría
      if (filtros.subcategoria && subCatId !== filtros.subcategoria) {
        return false;
      }

      // Filter por talla y color (via variantes)
      const variantesDelProducto = variantes.filter((v) => {
        const vProdId = v.id_producto || v.producto_id;
        return vProdId === prodId;
      });
      
      if (filtros.tallas.length > 0) {
        const tallaIds = filtros.tallas;
        const tieneTalla = variantesDelProducto.some((v) => {
          const vTallaId = v.id_talla || v.talla_id;
          return tallaIds.includes(vTallaId);
        });
        if (!tieneTalla) return false;
      }

      if (filtros.colores.length > 0) {
        const colorIds = filtros.colores;
        const tieneColor = variantesDelProducto.some((v) => {
          const vColorId = v.id_color || v.color_id;
          return colorIds.includes(vColorId);
        });
        if (!tieneColor) return false;
      }

      // Filter por precio
      if (variantesDelProducto.length > 0) {
        const precios = variantesDelProducto.map((v) => v.precio || 0);
        const precioMin = Math.min(...precios);
        const precioMax = Math.max(...precios);
        
        if (precioMin > filtros.precioMax || precioMax < filtros.precioMin) {
          return false;
        }
      }

      return true;
    });
  };

  const productosFiltratos = aplicarFiltros(productos);

  const productosOrdenados = [...productosFiltratos].sort((a, b) => {
    const aId = a.id_producto || a.id;
    const bId = b.id_producto || b.id;
    
    switch (sortBy) {
      case 'nuevo':
        return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
      case 'precio-bajo': {
        const minA = Math.min(...variantes.filter((v) => {
          const vProdId = v.id_producto || v.producto_id;
          return vProdId === aId;
        }).map((v) => v.precio || 0) || [Infinity]);
        const minB = Math.min(...variantes.filter((v) => {
          const vProdId = v.id_producto || v.producto_id;
          return vProdId === bId;
        }).map((v) => v.precio || 0) || [Infinity]);
        return minA - minB;
      }
      case 'precio-alto': {
        const maxA = Math.max(...variantes.filter((v) => {
          const vProdId = v.id_producto || v.producto_id;
          return vProdId === aId;
        }).map((v) => v.precio || 0) || [0]);
        const maxB = Math.max(...variantes.filter((v) => {
          const vProdId = v.id_producto || v.producto_id;
          return vProdId === bId;
        }).map((v) => v.precio || 0) || [0]);
        return maxB - maxA;
      }
      case 'popular':
        return (b.vistas || 0) - (a.vistas || 0);
      default:
        return 0;
    }
  });

  const obtenerVariantesDelProducto = (productoId) => {
    return variantes.filter((v) => {
      const vProdId = v.id_producto || v.producto_id;
      return vProdId === productoId;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-red-500 font-semibold text-sm md:text-base mb-4 uppercase tracking-widest">
              {isNuevos ? '✨ Lo Más Reciente' : isOfertas ? '🎉 Descuentos Especiales' : '✨ Colección Exclusiva 2025'}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
              {pageTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              {isNuevos 
                ? 'Descubre los productos agregados en los últimos 7 días'
                : isOfertas 
                ? 'Aprovecha nuestras ofertas especiales con descuentos increíbles'
                : 'Descubre las últimas tendencias en moda exclusiva inspirada en marcas de lujo como Nike y Zara'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 md:px-10 py-3 md:py-4 font-semibold hover:bg-red-700 transition transform hover:scale-105">
                Explorar Colección
                <ArrowRight size={20} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 md:px-10 py-3 md:py-4 font-semibold border border-white/20 hover:bg-white/20 transition">
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-white/50 animate-bounce">
            <p className="text-xs uppercase tracking-wider">Desplázate</p>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorías Destacadas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestras colecciones principales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categorias.slice(0, 3).map((cat, index) => {
            const catId = cat.id_categoria || cat.id;
            return (
            <Link
              key={catId}
              to={`/categoria/${catId}`}
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                index === 0 ? 'from-blue-600 to-blue-900' :
                index === 1 ? 'from-red-600 to-red-900' :
                'from-purple-600 to-purple-900'
              }`} />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end justify-start p-6 md:p-8 z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:translate-x-2 transition-transform">
                    {cat.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                    Explorar
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* Icon Badge */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                {index === 0 ? '👟' : index === 1 ? '👕' : '🎒'}
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {/* Main Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categorias={categorias}
              subcategorias={subcategorias}
              colores={colores}
              tallas={tallas}
              onFilterChange={setFiltros}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Todos los productos</h2>
                <p className="text-gray-600">
                  {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} encontrado{productosOrdenados.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="nuevo">Más nuevo</option>
                <option value="popular">Más popular</option>
                <option value="precio-bajo">Menor precio</option>
                <option value="precio-alto">Mayor precio</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="bg-gray-200 aspect-square rounded-lg animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : productosOrdenados.length === 0 ? (
              <div className="text-center py-16">
                <Zap size={56} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta cambiar tus filtros para ver más productos
                </p>
                <button
                  onClick={() => setFiltros({
                    categoria: null,
                    subcategoria: null,
                    tallas: [],
                    colores: [],
                    precioMin: 0,
                    precioMax: 1000000,
                  })}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosOrdenados.map((producto) => {
                  const prodId = producto.id_producto || producto.id;
                  const variantesProducto = obtenerVariantesDelProducto(prodId);
                  
                  // Solo mostrar producto si tiene variantes activas con stock
                  if (variantesProducto.length === 0) {
                    return null;
                  }
                  
                  const variantePrincipal = variantesProducto[0];
                  return (
                    <ProductoCard
                      key={prodId}
                      producto={producto}
                      variant={variantePrincipal}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="bg-gray-50 my-16 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Shipping */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Envío Gratis</h3>
                  <p className="text-blue-100">
                    En todas las compras mayores a $50.000
                  </p>
                </div>
                <span className="text-5xl">🚚</span>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 font-semibold rounded-lg hover:bg-blue-50 transition">
                Comprar ahora
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Easy Returns */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-8 md:p-12 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Devoluciones Fáciles</h3>
                  <p className="text-red-100">
                    30 días para devolver sin preguntas
                  </p>
                </div>
                <span className="text-5xl">↩️</span>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 bg-white text-red-600 px-6 py-2 font-semibold rounded-lg hover:bg-red-50 transition">
                Más información
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recibe Ofertas Exclusivas</h2>
          <p className="text-gray-300 mb-8">
            Suscríbete a nuestro newsletter y obtén un 10% de descuento en tu próxima compra
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
            <button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition whitespace-nowrap">
              Suscribir
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
