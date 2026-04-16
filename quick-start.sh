#!/bin/bash

# FashionStore - Quick Start Script
# Este script configura y ejecuta FashionStore automáticamente

echo "🚀 FashionStore - Quick Start"
echo "=============================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones
print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Backend Setup
echo -e "${BLUE}1️⃣  Backend Setup${NC}"
echo "--------------------"

if [ ! -d "venv" ]; then
    print_step "Creando entorno virtual..."
    python3 -m venv venv
    print_success "Entorno virtual creado"
fi

print_step "Activando entorno virtual..."
source venv/bin/activate
print_success "Entorno activado"

print_step "Instalando dependencias backend..."
pip install -r requirements.txt > /dev/null 2>&1
print_success "Dependencias instaladas"

echo ""
echo -e "${BLUE}2️⃣  Frontend Setup${NC}"
echo "--------------------"

if [ ! -d "frontend/node_modules" ]; then
    print_step "Instalando dependencias frontend..."
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
    print_success "Dependencias instaladas"
else
    print_success "Dependencias frontend ya instaladas"
fi

echo ""
echo -e "${BLUE}3️⃣  Starting Services${NC}"
echo "--------------------"

print_warning "Asegúrate de tener dos terminales abiertas"
echo ""
print_step "Backend (Terminal 1):"
echo "  cd /path/to/FashionStore"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
print_step "Frontend (Terminal 2):"
echo "  cd /path/to/FashionStore/frontend"
echo "  npm run dev"
echo ""
echo -e "${GREEN}✨ Setup completado!${NC}"
echo ""
echo "URLs de acceso:"
echo -e "  ${BLUE}Frontend${NC}: http://localhost:5173"
echo -e "  ${BLUE}Backend${NC}:  http://localhost:5000"
echo -e "  ${BLUE}API${NC}:      http://localhost:5000/api"
echo ""
echo "Próximos pasos:"
echo "  1. Abre dos terminales"
echo "  2. En Terminal 1: python run.py"
echo "  3. En Terminal 2: cd frontend && npm run dev"
echo "  4. Abre http://localhost:5173 en tu navegador"
echo ""
