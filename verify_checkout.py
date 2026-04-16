#!/usr/bin/env python3
"""
Script de verificación rápida del flujo de carrito y checkout
Verifica que todos los archivos necesarios existan y estén correctamente configurados
"""

import os
import sys
import json

def check_file_exists(path, description):
    """Verifica si un archivo existe"""
    if os.path.exists(path):
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description}: {path} NO ENCONTRADO")
        return False

def check_backend_config():
    """Verifica la configuración del backend"""
    print("\n" + "="*60)
    print("🔍 VERIFICANDO CONFIGURACIÓN DEL BACKEND")
    print("="*60)
    
    base_path = "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore"
    
    checks = [
        (f"{base_path}/run.py", "Archivo run.py"),
        (f"{base_path}/config.py", "Archivo config.py"),
        (f"{base_path}/app/__init__.py", "Archivo app/__init__.py"),
        (f"{base_path}/app/models/metodos_pago_model.py", "Modelo MetodoPago"),
        (f"{base_path}/app/services/metodos_pago_service.py", "Servicio MetodosPago"),
        (f"{base_path}/app/routes/metodos_pago_routes.py", "Rutas MetodosPago"),
    ]
    
    results = []
    for path, desc in checks:
        results.append(check_file_exists(path, desc))
    
    # Verificar que el blueprint está registrado
    print("\n📋 Verificando registro de blueprint en app/__init__.py...")
    with open(f"{base_path}/app/__init__.py", 'r') as f:
        content = f.read()
        if 'metodos_pago_bp' in content:
            print("✅ Blueprint de métodos de pago registrado")
            results.append(True)
        else:
            print("❌ Blueprint de métodos de pago NO ESTÁ registrado")
            results.append(False)
    
    return all(results)

def check_frontend_config():
    """Verifica la configuración del frontend"""
    print("\n" + "="*60)
    print("🔍 VERIFICANDO CONFIGURACIÓN DEL FRONTEND")
    print("="*60)
    
    base_path = "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore/frontend/src"
    
    checks = [
        (f"{base_path}/api/axios.js", "Archivo axios.js"),
        (f"{base_path}/api/services.js", "Archivo services.js"),
        (f"{base_path}/store/CartContext.jsx", "CartContext.jsx"),
        (f"{base_path}/pages/client/CartPage.jsx", "CartPage.jsx"),
        (f"{base_path}/components/public/CheckoutModal.jsx", "CheckoutModal.jsx"),
        (f"{base_path}/components/ui/FormField.jsx", "FormField.jsx"),
        (f"{base_path}/components/ui/Button.jsx", "Button.jsx"),
    ]
    
    results = []
    for path, desc in checks:
        results.append(check_file_exists(path, desc))
    
    # Verificar que axios usa puerto 5001
    print("\n🔌 Verificando configuración de puerto...")
    with open(f"{base_path}/api/axios.js", 'r') as f:
        content = f.read()
        if 'localhost:5001' in content:
            print("✅ Axios configurado para puerto 5001")
            results.append(True)
        else:
            print("❌ Axios NO usa puerto 5001")
            results.append(False)
    
    # Verificar que getMetodosPago existe
    print("\n📦 Verificando servicio getMetodosPago...")
    with open(f"{base_path}/api/services.js", 'r') as f:
        content = f.read()
        if 'getMetodosPago' in content:
            print("✅ Función getMetodosPago existe en services.js")
            results.append(True)
        else:
            print("❌ Función getMetodosPago NO existe en services.js")
            results.append(False)
    
    return all(results)

def check_cors_config():
    """Verifica la configuración de CORS"""
    print("\n" + "="*60)
    print("🔍 VERIFICANDO CONFIGURACIÓN DE CORS")
    print("="*60)
    
    base_path = "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore"
    
    with open(f"{base_path}/app/__init__.py", 'r') as f:
        content = f.read()
        
        checks = [
            ('from flask_cors import CORS', 'Import de CORS'),
            ('CORS(app', 'Configuración de CORS'),
            ('localhost:5173', 'Origen del frontend permitido'),
            ('supports_credentials=True', 'Credenciales permitidas'),
        ]
        
        results = []
        for check_str, desc in checks:
            if check_str in content:
                print(f"✅ {desc}")
                results.append(True)
            else:
                print(f"❌ {desc} NO encontrado")
                results.append(False)
    
    return all(results)

def main():
    """Función principal"""
    print("\n" + "="*60)
    print("🧪 VERIFICACIÓN DE CARRITO Y CHECKOUT COMPLETO")
    print("="*60)
    
    backend_ok = check_backend_config()
    frontend_ok = check_frontend_config()
    cors_ok = check_cors_config()
    
    print("\n" + "="*60)
    print("📊 RESUMEN FINAL")
    print("="*60)
    
    print(f"\n✅ Backend: {'LISTO' if backend_ok else 'PENDIENTE'}")
    print(f"✅ Frontend: {'LISTO' if frontend_ok else 'PENDIENTE'}")
    print(f"✅ CORS: {'LISTO' if cors_ok else 'PENDIENTE'}")
    
    if backend_ok and frontend_ok and cors_ok:
        print("\n🎉 ¡TODA LA CONFIGURACIÓN ESTÁ CORRECTA!")
        print("\nPróximos pasos:")
        print("1. Terminal 1: cd Proyecto/FashionStore && python run.py")
        print("2. Terminal 2: cd Proyecto/FashionStore/frontend && npm run dev")
        print("3. Abre http://localhost:5173 en tu navegador")
        print("4. Prueba el flujo de carrito y checkout")
        return 0
    else:
        print("\n⚠️  REVISIÓN NECESARIA")
        print("Por favor revisa los errores listados arriba")
        return 1

if __name__ == '__main__':
    sys.exit(main())
