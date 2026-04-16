import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProductFilters({ categorias, subcategorias, colores, tallas, onFilterChange }) {
  const [expandedFilters, setExpandedFilters] = useState({
    categoria: true,
    subcategoria: true,
    talla: true,
    color: true,
    precio: true,
  });

  const [filters, setFilters] = useState({
    categoria: null,
    subcategoria: null,
    tallas: [],
    colores: [],
    precioMin: 0,
    precioMax: 1000000,
  });

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoriaChange = (categoriaId) => {
    const newFilters = {
      ...filters,
      categoria: filters.categoria === categoriaId ? null : categoriaId,
      subcategoria: null, // Reset subcategory when category changes
    };
    handleFilterChange(newFilters);
  };

  const handleSubcategoriaChange = (subcategoriaId) => {
    const newFilters = {
      ...filters,
      subcategoria: filters.subcategoria === subcategoriaId ? null : subcategoriaId,
    };
    handleFilterChange(newFilters);
  };

  const handleTallaChange = (tallaId) => {
    const newFilters = {
      ...filters,
      tallas: filters.tallas.includes(tallaId)
        ? filters.tallas.filter((id) => id !== tallaId)
        : [...filters.tallas, tallaId],
    };
    handleFilterChange(newFilters);
  };

  const handleColorChange = (colorId) => {
    const newFilters = {
      ...filters,
      colores: filters.colores.includes(colorId)
        ? filters.colores.filter((id) => id !== colorId)
        : [...filters.colores, colorId],
    };
    handleFilterChange(newFilters);
  };

  const handlePriceChange = (min, max) => {
    const newFilters = {
      ...filters,
      precioMin: min,
      precioMax: max,
    };
    handleFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      categoria: null,
      subcategoria: null,
      tallas: [],
      colores: [],
      precioMin: 0,
      precioMax: 1000000,
    });
    onFilterChange({
      categoria: null,
      subcategoria: null,
      tallas: [],
      colores: [],
      precioMin: 0,
      precioMax: 1000000,
    });
  };

  const hasActiveFilters =
    filters.categoria ||
    filters.subcategoria ||
    filters.tallas.length > 0 ||
    filters.colores.length > 0 ||
    filters.precioMin > 0 ||
    filters.precioMax < 1000000;

  return (
    <div className="w-full md:w-64 bg-white rounded-lg p-4 md:p-6 h-fit">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 transition font-semibold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Categoría */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleFilter('categoria')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-gray-600 transition"
        >
          Categoría
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedFilters.categoria ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedFilters.categoria && (
          <div className="mt-3 space-y-2">
            {categorias.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categoria === cat.id}
                  onChange={() => handleCategoriaChange(cat.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-0"
                />
                <span className="text-sm text-gray-600">{cat.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Subcategoría */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleFilter('subcategoria')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-gray-600 transition"
        >
          Subcategoría
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedFilters.subcategoria ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedFilters.subcategoria && (
          <div className="mt-3 space-y-2">
            {subcategorias.map((subcat) => (
              <label key={subcat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.subcategoria === subcat.id}
                  onChange={() => handleSubcategoriaChange(subcat.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-0"
                />
                <span className="text-sm text-gray-600">{subcat.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Talla */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleFilter('talla')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-gray-600 transition"
        >
          Talla
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedFilters.talla ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedFilters.talla && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {tallas.map((talla) => (
              <button
                key={talla.id}
                onClick={() => handleTallaChange(talla.id)}
                className={`py-2 px-3 text-sm font-medium rounded border transition ${
                  filters.tallas.includes(talla.id)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                }`}
              >
                {talla.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleFilter('color')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-gray-600 transition"
        >
          Color
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedFilters.color ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedFilters.color && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {colores.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color.id)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  filters.colores.includes(color.id)
                    ? 'border-black scale-110'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                style={{ backgroundColor: color.codigo_hex }}
                title={color.nombre}
              />
            ))}
          </div>
        )}
      </div>

      {/* Precio */}
      <div>
        <button
          onClick={() => toggleFilter('precio')}
          className="flex items-center justify-between w-full font-semibold text-gray-900 hover:text-gray-600 transition"
        >
          Precio
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedFilters.precio ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedFilters.precio && (
          <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-gray-600 font-medium">Rango de precio</label>
                <span className="text-xs font-semibold text-gray-900">
                  ${filters.precioMin.toLocaleString('es-CO')} - ${filters.precioMax.toLocaleString('es-CO')}
                </span>
              </div>
              
              {/* Minimum Price Slider */}
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={filters.precioMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= filters.precioMax) {
                      handlePriceChange(val, filters.precioMax);
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Maximum Price Slider */}
              <div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={filters.precioMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= filters.precioMin) {
                      handlePriceChange(filters.precioMin, val);
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            {/* Quick Price Presets */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {[
                { min: 0, max: 50000, label: 'Hasta $50k' },
                { min: 50000, max: 100000, label: '$50k-$100k' },
                { min: 100000, max: 200000, label: '$100k-$200k' },
                { min: 200000, max: 1000000, label: 'Más de $200k' },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className={`text-xs px-3 py-1 rounded border transition ${
                    filters.precioMin === range.min && filters.precioMax === range.max
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
