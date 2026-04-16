import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Newsletter Section */}
      <div className="bg-black py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Suscríbete a nuestro newsletter</h3>
            <p className="text-gray-400 mb-6">Recibe ofertas exclusivas y novedades de moda</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo"
                className="flex-1 px-4 py-3 bg-white text-gray-900 outline-none"
                required
              />
              <button className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100 transition">
                Suscribir
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h4 className="text-lg font-bold mb-4">FASHIONSTORE</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino para moda premium y trendy. Descubre las mejores colecciones de ropa y accesorios.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-semibold mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/productos" className="hover:text-white transition">Todos los productos</Link></li>
              <li><Link to="/nuevos" className="hover:text-white transition">Nuevas colecciones</Link></li>
              <li><Link to="/ofertas" className="hover:text-white transition">Ofertas especiales</Link></li>
              <li><a href="#" className="hover:text-white transition">Outlet</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition">Envíos y devoluciones</a></li>
              <li><a href="#" className="hover:text-white transition">Preguntas frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition">Política de privacidad</a></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-white hover:text-black transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} FashionStore. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Términos de servicio</a>
              <a href="#" className="hover:text-white transition">Política de privacidad</a>
              <a href="#" className="hover:text-white transition">Política de cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
