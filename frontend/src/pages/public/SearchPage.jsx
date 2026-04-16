import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import ProductFilters from '../../components/public/ProductFilters';
import ProductoCard from '../../components/public/ProductoCard';
import { productosService, variantesService, categoriasService, subcategoriasService, coloresService, tallasService } from '../../api/services';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
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
  const [sortBy, setSortBy] = useState('relevancia');

  useEffect(() => {
    fetchAllData();
  }, [searchQuery]);

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

  const buscarProductos = (productosActuales) => {
    if (!searchQuery.trim()) return productosActuales;

    const query = searchQuery.toLowerCase();
    return productosActuales.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.categoria?.nombre.toLowerCase().includes(query) ||
        p.subcategoria?.nombre.toLowerCase().includes(query)
    );
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

  const productosConBusqueda = buscarProductos(productos);
  const productosFiltratos = aplicarFiltros(productosConBusqueda);

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
      case 'relevancia':
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

      {/* Search Header */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Search size={24} />
            <h1 className="text-3xl font-bold">
              Resultados para: <span className="text-gray-600">"{searchQuery}"</span>
            </h1>
          </div>
          <p className="text-gray-600">
            {productosOrdenados.length} {productosOrdenados.length === 1 ? 'producto' : 'productos'} encontrado
            {productosOrdenados.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <ProductFilters
            categorias={categorias}
            subcategorias={subcategorias}
            colores={colores}
            tallas={tallas}
            onFilterChange={setFiltros}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="relevancia">Más relevante</option>
                <option value="nuevo">Más nuevo</option>
                <option value="popular">Más popular</option>
                <option value="precio-bajo">Menor precio</option>
                <option value="precio-alto">Mayor precio</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 aspect-square rounded-lg animate-pulse" />
                ))}
              </div>
            ) : productosOrdenados.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay resultados
                </h3>
                <p className="text-gray-600">
                  Intenta con otras palabras clave o cambia tus filtros
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
