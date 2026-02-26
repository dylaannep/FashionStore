"""
Servicio de Órdenes - Capa de Lógica de Negocio
"""
from datetime import datetime
from app import db
from app.models.order_model import Order, OrderItem
from app.models.product_model import Product
from app.services.cart_service import CartService


class OrderService:
    """
    Servicio para manejar la lógica de órdenes de compra
    """
    
    @staticmethod
    def create_order_from_cart(user_id, customer_name, customer_email, shipping_address, **kwargs):
        """
        Crea una orden a partir del carrito actual
        
        Args:
            user_id (int): ID del usuario
            customer_name (str): Nombre del cliente
            customer_email (str): Email del cliente
            shipping_address (str): Dirección de envío
            **kwargs: Información adicional de envío
            
        Returns:
            tuple: (Order, error_message)
        """
        # Validar carrito
        is_valid, errors = CartService.validate_cart()
        if not is_valid:
            return None, "; ".join(errors)
        
        cart_items = CartService.get_cart_items()
        if not cart_items:
            return None, "El carrito está vacío"
        
        try:
            # Crear orden
            order = Order(
                user_id=user_id,
                customer_name=customer_name,
                customer_email=customer_email,
                shipping_address=shipping_address,
                **kwargs
            )
            
            # Calcular subtotal
            subtotal = 0
            
            # Agregar items a la orden
            for item in cart_items:
                product = item['product']
                quantity = item['quantity']
                
                # Crear item de orden
                order_item = OrderItem(
                    order_id=None,  # Se asignará automáticamente
                    product_id=product.id,
                    product_name=product.name,
                    product_sku=product.sku,
                    price=product.get_final_price(),
                    quantity=quantity
                )
                
                order.items.append(order_item)
                subtotal += order_item.get_total()
                
                # Reducir stock del producto
                product.stock -= quantity
            
            # Establecer totales
            order.subtotal = subtotal
            order.total = float(subtotal) + float(order.tax) + float(order.shipping_cost)
            
            # Guardar en base de datos
            db.session.add(order)
            db.session.commit()
            
            # Limpiar carrito
            CartService.clear_cart()
            
            return order, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al crear la orden: {str(e)}"
    
    @staticmethod
    def get_order_by_id(order_id):
        """
        Obtiene una orden por su ID
        
        Args:
            order_id (int): ID de la orden
            
        Returns:
            Order: Orden encontrada o None
        """
        return Order.query.get(order_id)
    
    @staticmethod
    def get_order_by_number(order_number):
        """
        Obtiene una orden por su número de orden
        
        Args:
            order_number (str): Número de orden
            
        Returns:
            Order: Orden encontrada o None
        """
        return Order.query.filter_by(order_number=order_number).first()
    
    @staticmethod
    def get_user_orders(user_id, page=1, per_page=10):
        """
        Obtiene las órdenes de un usuario
        
        Args:
            user_id (int): ID del usuario
            page (int): Número de página
            per_page (int): Órdenes por página
            
        Returns:
            Pagination: Objeto de paginación
        """
        return Order.query.filter_by(user_id=user_id).order_by(
            Order.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
    
    @staticmethod
    def get_all_orders(page=1, per_page=20, status=None):
        """
        Obtiene todas las órdenes (para administradores)
        
        Args:
            page (int): Número de página
            per_page (int): Órdenes por página
            status (str): Filtrar por estado
            
        Returns:
            Pagination: Objeto de paginación
        """
        query = Order.query
        
        if status:
            query = query.filter_by(status=status)
        
        return query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
    
    @staticmethod
    def update_order_status(order_id, new_status):
        """
        Actualiza el estado de una orden
        
        Args:
            order_id (int): ID de la orden
            new_status (str): Nuevo estado
            
        Returns:
            tuple: (success, message)
        """
        order = Order.query.get(order_id)
        if not order:
            return False, "Orden no encontrada"
        
        try:
            order.status = new_status
            
            # Actualizar timestamps específicos según el estado
            if new_status == Order.STATUS_CONFIRMED:
                order.confirmed_at = datetime.utcnow()
            elif new_status == Order.STATUS_SHIPPED:
                order.shipped_at = datetime.utcnow()
            elif new_status == Order.STATUS_DELIVERED:
                order.delivered_at = datetime.utcnow()
            
            db.session.commit()
            return True, f"Estado actualizado a {new_status}"
            
        except Exception as e:
            db.session.rollback()
            return False, f"Error al actualizar el estado: {str(e)}"
    
    @staticmethod
    def cancel_order(order_id):
        """
        Cancela una orden y restaura el stock
        
        Args:
            order_id (int): ID de la orden
            
        Returns:
            tuple: (success, message)
        """
        order = Order.query.get(order_id)
        if not order:
            return False, "Orden no encontrada"
        
        if not order.can_be_cancelled():
            return False, "Esta orden no puede ser cancelada"
        
        try:
            # Restaurar stock de productos
            for item in order.items:
                product = Product.query.get(item.product_id)
                if product:
                    product.stock += item.quantity
            
            # Actualizar estado
            order.status = Order.STATUS_CANCELLED
            
            db.session.commit()
            return True, "Orden cancelada correctamente"
            
        except Exception as e:
            db.session.rollback()
            return False, f"Error al cancelar la orden: {str(e)}"
    
    @staticmethod
    def get_order_statistics():
        """
        Obtiene estadísticas generales de órdenes
        
        Returns:
            dict: Estadísticas de órdenes
        """
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status=Order.STATUS_PENDING).count()
        completed_orders = Order.query.filter_by(status=Order.STATUS_DELIVERED).count()
        
        # Calcular ingresos totales de órdenes entregadas
        total_revenue = db.session.query(db.func.sum(Order.total)).filter_by(
            status=Order.STATUS_DELIVERED
        ).scalar() or 0
        
        return {
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'total_revenue': float(total_revenue)
        }
