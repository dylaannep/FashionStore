"""
Servicio de Carrito de Compras - Capa de Lógica de Negocio
"""
from flask import session
from app.models.product_model import Product


class CartService:
    """
    Servicio para manejar la lógica del carrito de compras
    Utiliza sesiones para almacenar el carrito temporalmente
    """
    
    CART_SESSION_KEY = 'shopping_cart'
    
    @staticmethod
    def get_cart():
        """
        Obtiene el carrito actual de la sesión
        
        Returns:
            dict: Carrito de compras
        """
        if CartService.CART_SESSION_KEY not in session:
            session[CartService.CART_SESSION_KEY] = {}
        return session[CartService.CART_SESSION_KEY]
    
    @staticmethod
    def add_to_cart(product_id, quantity=1):
        """
        Agrega un producto al carrito
        
        Args:
            product_id (int): ID del producto
            quantity (int): Cantidad a agregar
            
        Returns:
            tuple: (success, message)
        """
        # Validar producto
        product = Product.query.get(product_id)
        if not product:
            return False, "Producto no encontrado"
        
        if not product.is_active:
            return False, "Producto no disponible"
        
        if not product.is_in_stock():
            return False, "Producto sin stock"
        
        # Obtener carrito
        cart = CartService.get_cart()
        product_id_str = str(product_id)
        
        # Calcular nueva cantidad
        current_quantity = cart.get(product_id_str, 0)
        new_quantity = current_quantity + quantity
        
        # Validar stock disponible
        if new_quantity > product.stock:
            return False, f"Stock insuficiente. Disponible: {product.stock}"
        
        # Agregar al carrito
        cart[product_id_str] = new_quantity
        session[CartService.CART_SESSION_KEY] = cart
        session.modified = True
        
        return True, "Producto agregado al carrito"
    
    @staticmethod
    def update_cart_item(product_id, quantity):
        """
        Actualiza la cantidad de un producto en el carrito
        
        Args:
            product_id (int): ID del producto
            quantity (int): Nueva cantidad
            
        Returns:
            tuple: (success, message)
        """
        if quantity <= 0:
            return CartService.remove_from_cart(product_id)
        
        # Validar producto y stock
        product = Product.query.get(product_id)
        if not product:
            return False, "Producto no encontrado"
        
        if quantity > product.stock:
            return False, f"Stock insuficiente. Disponible: {product.stock}"
        
        # Actualizar carrito
        cart = CartService.get_cart()
        cart[str(product_id)] = quantity
        session[CartService.CART_SESSION_KEY] = cart
        session.modified = True
        
        return True, "Carrito actualizado"
    
    @staticmethod
    def remove_from_cart(product_id):
        """
        Elimina un producto del carrito
        
        Args:
            product_id (int): ID del producto
            
        Returns:
            tuple: (success, message)
        """
        cart = CartService.get_cart()
        product_id_str = str(product_id)
        
        if product_id_str in cart:
            del cart[product_id_str]
            session[CartService.CART_SESSION_KEY] = cart
            session.modified = True
            return True, "Producto eliminado del carrito"
        
        return False, "Producto no encontrado en el carrito"
    
    @staticmethod
    def clear_cart():
        """
        Vacía el carrito completamente
        """
        session[CartService.CART_SESSION_KEY] = {}
        session.modified = True
    
    @staticmethod
    def get_cart_items():
        """
        Obtiene los items del carrito con información completa de productos
        
        Returns:
            list: Lista de items con información del producto
        """
        cart = CartService.get_cart()
        items = []
        
        for product_id_str, quantity in cart.items():
            product = Product.query.get(int(product_id_str))
            if product and product.is_active:
                items.append({
                    'product': product,
                    'quantity': quantity,
                    'subtotal': product.get_final_price() * quantity
                })
        
        return items
    
    @staticmethod
    def get_cart_total():
        """
        Calcula el total del carrito
        
        Returns:
            float: Total del carrito
        """
        items = CartService.get_cart_items()
        return sum(item['subtotal'] for item in items)
    
    @staticmethod
    def get_cart_count():
        """
        Obtiene la cantidad total de items en el carrito
        
        Returns:
            int: Cantidad de items
        """
        cart = CartService.get_cart()
        return sum(cart.values())
    
    @staticmethod
    def validate_cart():
        """
        Valida que todos los productos del carrito estén disponibles y tengan stock
        
        Returns:
            tuple: (valid, errors)
        """
        cart = CartService.get_cart()
        errors = []
        
        for product_id_str, quantity in cart.items():
            product = Product.query.get(int(product_id_str))
            
            if not product:
                errors.append(f"Producto con ID {product_id_str} no encontrado")
                continue
            
            if not product.is_active:
                errors.append(f"{product.name} ya no está disponible")
                continue
            
            if not product.is_in_stock():
                errors.append(f"{product.name} está sin stock")
                continue
            
            if quantity > product.stock:
                errors.append(f"{product.name}: stock insuficiente (disponible: {product.stock})")
        
        return len(errors) == 0, errors
