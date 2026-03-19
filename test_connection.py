"""
Script de prueba de conexión a SQL Server
Usa este archivo para verificar que tu configuración de base de datos es correcta.

Uso:
    python test_connection.py
"""
from app import create_app, db
from sqlalchemy import text

def test_database_connection():
    """Prueba la conexión a la base de datos SQL Server"""
    print("=" * 60)
    print("🔌 Probando conexión a SQL Server...")
    print("=" * 60)
    
    try:
        # Crear la aplicación Flask
        app = create_app()
        
        with app.app_context():
            # Información de configuración (sin mostrar contraseña)
            print(f"\n📋 Configuración:")
            print(f"   - Servidor: {app.config.get('DB_SERVER')}")
            print(f"   - Base de datos: {app.config.get('DB_NAME')}")
            print(f"   - Usuario: {app.config.get('DB_USERNAME')}")
            print(f"   - Driver: {app.config.get('DB_DRIVER')}")
            
            # Intentar conectar y ejecutar una consulta simple
            print(f"\n🔄 Intentando conectar...")
            result = db.session.execute(text('SELECT @@VERSION as version'))
            version_info = result.fetchone()
            
            print(f"\n✅ ¡Conexión exitosa!")
            print(f"\n📊 Información del servidor:")
            print(f"   {version_info[0][:100]}...")
            
            # Listar las tablas en la base de datos
            print(f"\n📦 Verificando tablas en la base de datos...")
            tables_query = text("""
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_NAME
            """)
            tables = db.session.execute(tables_query).fetchall()
            
            if tables:
                print(f"\n✅ Se encontraron {len(tables)} tablas:")
                for table in tables:
                    print(f"   - {table[0]}")
            else:
                print(f"\n⚠️  No se encontraron tablas.")
                print(f"   Ejecuta el script 'database/script_bd.sql' para crear las tablas.")
            
            print("\n" + "=" * 60)
            print("✅ Prueba de conexión completada exitosamente")
            print("=" * 60)
            return True
            
    except Exception as e:
        print(f"\n❌ Error al conectar a la base de datos:")
        print(f"   {str(e)}")
        print(f"\n💡 Soluciones posibles:")
        print(f"   1. Verifica que SQL Server esté corriendo")
        print(f"   2. Revisa las credenciales en el archivo .env")
        print(f"   3. Asegúrate de que ODBC Driver 17 esté instalado")
        print(f"   4. Verifica que la base de datos '{app.config.get('DB_NAME')}' exista")
        print("=" * 60)
        return False

if __name__ == '__main__':
    test_database_connection()
