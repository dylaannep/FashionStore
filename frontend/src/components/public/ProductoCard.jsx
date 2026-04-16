import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductoCard({ producto, variant }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Usar imagen de la variante o del producto
  const imageUrl = variant?.imagen || producto?.imagen || '/placeholder-product.jpg';
  const precio = variant?.precio || producto?.precio || 0;
  const nombreProducto = producto?.nombre || 'Producto sin nombre';
  const descuento = variant?.descuento || 0;
  const precioOriginal = variant?.precio_original || 0;
  const rating = producto?.rating || 4.5;
  const numResenas = producto?.num_resenas || 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/producto/${producto?.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div
          className="relative bg-gray-100 aspect-square overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={imageUrl}
            alt={nombreProducto}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovering ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Discount Badge */}
            {descuento > 0 && (
              <div className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full shadow-md">
                -{descuento}%
              </div>
            )}

            {/* New Badge */}
            {producto?.es_nuevo && (
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
                NUEVO
              </div>
            )}
          </div>

          {/* Action Buttons - Show on Hover */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-end justify-center gap-3 p-4 transition-opacity duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 rounded-lg py-3 font-semibold hover:bg-gray-100 transition transform hover:scale-105"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Carrito</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-3 rounded-lg transition transform hover:scale-110 ${
                isWishlisted ? 'bg-red-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Agregar a favoritos"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Stock Status Overlay */}
          {variant?.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <span className="text-white font-bold text-lg block mb-1">AGOTADO</span>
                <span className="text-white text-xs">Próxima reposición</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          {/* Category Badge */}
          {producto?.categoria?.nombre && (
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
              {producto.categoria.nombre}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition mb-2">
            {nombreProducto}
          </h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {rating.toFixed(1)} ({numResenas})
              </span>
            </div>
          )}

          {/* Color/Variant Info */}
          {variant?.color?.nombre && (
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
                style={{
                  backgroundColor: variant.color.codigo_hex || '#000',
                }}
                title={variant.color.nombre}
              />
              <span className="text-xs text-gray-600 font-medium">{variant.color.nombre}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">{formatPrice(precio)}</span>
            {precioOriginal > precio && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(precioOriginal)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="pt-3 border-t border-gray-100">
            {variant?.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${variant.stock <= 3 ? 'bg-orange-500' : 'bg-green-500'}`} />
                <span className={`text-xs font-medium ${variant.stock <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                  {variant.stock <= 3 ? 'Pocas unidades disponibles' : 'En stock'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-xs text-gray-600 font-medium">Agotado</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
