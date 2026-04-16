import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight, Zap } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import ProductFilters from '../../components/public/ProductFilters';
import ProductoCard from '../../components/public/ProductoCard';
import { productosService, variantesService, categoriasService, subcategoriasService, coloresService, tallasService } from '../../api/services';

export default function CategoryPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoriaParm = searchParams.get('subcategoria');

  const [category, setCategory] = useState(null);
  const [productos, setProductos] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: id ? parseInt(id) : null,
    subcategoria: subcategoriaParm ? parseInt(subcategoriaParm) : null,
    tallas: [],
    colores: [],
    precioMin: 0,
    precioMax: 1000000,
  });
  const [sortBy, setSortBy] = useState('nuevo');

  useEffect(() => {
    fetchAllData();
  }, [id, subcategoriaParm]);

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

      setCategorias(catRes.data);
      setSubcategorias(subRes.data);
      setColores(colRes.data);
      setTallas(talRes.data);

      // Set category
      if (id) {
        const cat = catRes.data.find((c) => c.id === parseInt(id));
        setCategory(cat);
      }

      // Filter only active products
      const productosActivos = prodRes.data.filter((p) => p.activo === true || p.activo === 1);
      setProductos(productosActivos);

      // Filter only active variants with stock
      const variantesActivas = varRes.data.filter(
        (v) => (v.activo === true || v.activo === 1) && v.stock > 0
      );
      setVariantes(variantesActivas);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (productosActuales) => {
    return productosActuales.filter((producto) => {
      // Filter por categoría
      if (filtros.categoria && producto.categoria_id !== filtros.categoria) {
        return false;
      }

      // Filter por subcategoría
      if (filtros.subcategoria && producto.subcategoria_id !== filtros.subcategoria) {
        return false;
      }

      // Filter por talla y color (via variantes)
      const variantesDelProducto = variantes.filter((v) => v.producto_id === producto.id);

      if (filtros.tallas.length > 0) {
        const tieneTalla = variantesDelProducto.some((v) => filtros.tallas.includes(v.talla_id));
        if (!tieneTalla) return false;
      }

      if (filtros.colores.length > 0) {
        const tieneColor = variantesDelProducto.some((v) => filtros.colores.includes(v.color_id));
        if (!tieneColor) return false;
      }

      // Filter por precio
      if (variantesDelProducto.length > 0) {
        const precioMin = Math.min(...variantesDelProducto.map((v) => v.precio));
        const precioMax = Math.max(...variantesDelProducto.map((v) => v.precio));

        if (precioMin > filtros.precioMax || precioMax < filtros.precioMin) {
          return false;
        }
      }

      return true;
    });
  };

  const productosFiltratos = aplicarFiltros(productos);

  const productosOrdenados = [...productosFiltratos].sort((a, b) => {
    switch (sortBy) {
      case 'nuevo':
        return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
      case 'precio-bajo':
        const minA = Math.min(...variantes.filter((v) => v.producto_id === a.id).map((v) => v.precio) || [Infinity]);
        const minB = Math.min(...variantes.filter((v) => v.producto_id === b.id).map((v) => v.precio) || [Infinity]);
        return minA - minB;
      case 'precio-alto':
        const maxA = Math.max(...variantes.filter((v) => v.producto_id === a.id).map((v) => v.precio) || [0]);
        const maxB = Math.max(...variantes.filter((v) => v.producto_id === b.id).map((v) => v.precio) || [0]);
        return maxB - maxA;
      case 'popular':
        return (b.vistas || 0) - (a.vistas || 0);
      default:
        return 0;
    }
  });

  const obtenerVariantesDelProducto = (productoId) => {
    return variantes.filter((v) => v.producto_id === productoId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Category Header */}
      {category && (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <a href="/" className="hover:text-white transition">
                Inicio
              </a>
              <ChevronRight size={16} />
              <span className="text-gray-300 font-medium">{category.nombre}</span>
            </div>

            {/* Title and Description */}
            <div className="mb-6">
              <span className="inline-block text-red-500 font-semibold text-sm uppercase tracking-widest mb-2">
                {category.nombre}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {category.nombre}
              </h1>
              {category.descripcion && (
                <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                  {category.descripcion}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} disponible{productosOrdenados.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Productos en esta categoría</h2>
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
                    categoria: id ? parseInt(id) : null,
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
                  const variantesProducto = obtenerVariantesDelProducto(producto.id);
                  const variantePrincipal = variantesProducto[0];
                  return (
                    <ProductoCard
                      key={producto.id}
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

      <Footer />
    </div>
  );
}

