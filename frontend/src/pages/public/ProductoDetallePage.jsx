import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Check, ChevronRight } from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { productosService, variantesService } from '../../api/services';

export default function ProductoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProductoDetalle();
  }, [id]);

  const fetchProductoDetalle = async () => {
    try {
      setLoading(true);
      const [prodRes, varRes] = await Promise.all([
        productosService.getById(id),
        variantesService.getAll(),
      ]);

      setProducto(prodRes.data);
      
      // Filter variantes para este producto
      const prodId = prodRes.data.id_producto || prodRes.data.id;
      const variantesProducto = varRes.data.filter((v) => {
        const vProdId = v.id_producto || v.producto_id;
        return vProdId === prodId && (v.activo === true || v.activo === 1);
      });
      setVariantes(variantesProducto);

      // Select first variant by default
      if (variantesProducto.length > 0) {
        const colorId = variantesProducto[0].id_color || variantesProducto[0].color_id;
        const tallaId = variantesProducto[0].id_talla || variantesProducto[0].talla_id;
        setSelectedColor(colorId);
        setSelectedTalla(tallaId);
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg" />
              <div>
                <div className="h-8 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                <div className="h-12 bg-gray-200 rounded mt-8" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <button
            onClick={() => navigate('/productos')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a la tienda
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const varianteSeleccionada = variantes.find((v) => {
    const vColorId = v.id_color || v.color_id;
    const vTallaId = v.id_talla || v.talla_id;
    return vColorId === selectedColor && vTallaId === selectedTalla;
  });

  const coloresUnicos = Array.from(
    new Map(variantes.map((v) => {
      const colorId = v.id_color || v.color_id;
      return [colorId, v];
    })).values()
  );

  const tallasUnicos = Array.from(
    new Map(variantes.map((v) => {
      const tallaId = v.id_talla || v.talla_id;
      return [tallaId, v];
    })).values()
  );

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/productos')} className="hover:text-gray-900 transition">
              Tienda
            </button>
            <ChevronRight size={16} />
            {producto?.categoria?.nombre && (
              <>
                <button onClick={() => navigate(`/categoria/${producto.categoria_id}`)} className="hover:text-gray-900 transition">
                  {producto.categoria.nombre}
                </button>
                <ChevronRight size={16} />
              </>
            )}
            <span className="text-gray-900 font-medium">{producto?.nombre}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-100 aspect-square rounded-xl overflow-hidden mb-4 sticky top-24">
              <img
                src={varianteSeleccionada?.imagen || producto.imagen || '/placeholder.jpg'}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {variantes.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {variantes.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedColor(v.color_id);
                      setSelectedTalla(v.talla_id);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      v.id === varianteSeleccionada?.id
                        ? 'border-red-600 scale-105'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={v.imagen || producto.imagen}
                      alt={`Variante ${v.id}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {producto?.subcategoria?.nombre && (
              <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">
                {producto.subcategoria.nombre}
              </p>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              {producto?.nombre}
            </h1>

            {/* Rating - Placeholder */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reseñas)</span>
            </div>

            {/* Price */}
            {varianteSeleccionada && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${varianteSeleccionada.precio.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </span>
                  {varianteSeleccionada.precio_original > varianteSeleccionada.precio && (
                    <span className="text-xl text-gray-500 line-through">
                      ${varianteSeleccionada.precio_original.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
                {varianteSeleccionada.descuento > 0 && (
                  <p className="text-red-600 font-bold mt-2 text-lg">
                    Ahorra {varianteSeleccionada.descuento}%
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {producto?.descripcion && (
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {producto.descripcion}
              </p>
            )}

            {/* Color Selection */}
            {coloresUnicos.length > 1 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {coloresUnicos.map((v) => {
                    const vColorId = v.id_color || v.color_id;
                    return (
                    <button
                      key={vColorId}
                      onClick={() => setSelectedColor(vColorId)}
                      className={`w-12 h-12 rounded-full border-2 transition flex items-center justify-center shadow-sm hover:shadow-md ${
                        vColorId === selectedColor
                          ? 'border-red-600 ring-2 ring-red-300 scale-110'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                      style={{ backgroundColor: v.color?.codigo_hex || '#000' }}
                      title={v.color?.nombre}
                    >
                      {v.color_id === selectedColor && (
                        <Check size={20} className="text-white drop-shadow" />
                      )}
                    </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {tallasUnicos.length > 1 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Talla</h3>
                <div className="grid grid-cols-4 gap-2">
                  {tallasUnicos.map((v) => {
                    const vTallaId = v.id_talla || v.talla_id;
                    return (
                    <button
                      key={vTallaId}
                      onClick={() => setSelectedTalla(vTallaId)}
                      className={`py-3 px-4 text-sm font-semibold rounded-lg border-2 transition ${
                        vTallaId === selectedTalla
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {v.talla?.nombre}
                    </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {varianteSeleccionada && (
              <div className="mb-8">
                {varianteSeleccionada.stock > 0 ? (
                  <div className="flex items-center gap-3 text-green-600 font-bold text-lg">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                    {varianteSeleccionada.stock <= 3
                      ? `Solo ${varianteSeleccionada.stock} unidades disponibles`
                      : 'En stock'}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-600 font-bold text-lg">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    Producto agotado
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Actions */}
            {varianteSeleccionada && varianteSeleccionada.stock > 0 && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-200 transition text-lg font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-l border-r border-gray-300 py-3 focus:outline-none bg-gray-50 font-bold"
                      min="1"
                      max={varianteSeleccionada.stock}
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(varianteSeleccionada.stock, quantity + 1))
                      }
                      className="px-4 py-3 hover:bg-gray-200 transition text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 font-bold text-lg rounded-lg transition flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={24} />
                      Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      Agregar al carrito
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-full py-4 px-6 font-bold text-lg rounded-lg border-2 transition flex items-center justify-center gap-3 ${
                    isWishlisted
                      ? 'bg-red-50 text-red-600 border-red-600 hover:bg-red-100'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                  {isWishlisted ? 'En favoritos' : 'Agregar a favoritos'}
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Envío gratis</h4>
                  <p className="text-sm text-gray-600">En compras mayores a $50.000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Devolución fácil</h4>
                  <p className="text-sm text-gray-600">30 días sin preguntas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Garantía premium</h4>
                  <p className="text-sm text-gray-600">Calidad garantizada 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
