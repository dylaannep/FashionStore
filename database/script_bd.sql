-- Script de base de datos para FashionStore
-- SQL Server

-- TODO: Agregar scripts de creación de tablas


CREATE DATABASE TiendaRopaDB;
GO

USE TiendaRopaDB;
GO


CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(200),
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO


CREATE TABLE UsuarioRoles (
    IdUsuario INT NOT NULL,
    IdRol INT NOT NULL,
    PRIMARY KEY (IdUsuario, IdRol),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (IdRol) REFERENCES Roles(IdRol)
);
GO


CREATE TABLE Categorias (
    IdCategoria INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descripcion VARCHAR(200),
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);
GO


CREATE TABLE SubCategorias (
    IdSubCategoria INT PRIMARY KEY IDENTITY(1,1),
    IdCategoria INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(200),
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_SubCategorias_Categorias
        FOREIGN KEY (IdCategoria)
        REFERENCES Categorias(IdCategoria)
);
GO


CREATE TABLE Colores (
    IdColor INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Activo BIT NOT NULL DEFAULT 1
);
GO


CREATE TABLE Tallas (
    IdTalla INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL UNIQUE, -- S, M, L, 38, 39, etc.
    Activo BIT NOT NULL DEFAULT 1
);
GO


CREATE TABLE Productos (
    IdProducto INT PRIMARY KEY IDENTITY(1,1),
    IdSubCategoria INT NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion VARCHAR(500),
    Marca VARCHAR(100),
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Productos_SubCategorias
        FOREIGN KEY (IdSubCategoria)
        REFERENCES SubCategorias(IdSubCategoria)
);
GO



CREATE TABLE ProductoVariantes (
    IdProductoVariante INT PRIMARY KEY IDENTITY(1,1),
    IdProducto INT NOT NULL,
    IdColor INT NOT NULL,
    IdTalla INT NOT NULL,
    SKU VARCHAR(100) NOT NULL UNIQUE,
    Precio DECIMAL(10,2) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Variantes_Producto
        FOREIGN KEY (IdProducto)
        REFERENCES Productos(IdProducto),

    CONSTRAINT FK_Variantes_Color
        FOREIGN KEY (IdColor)
        REFERENCES Colores(IdColor),

    CONSTRAINT FK_Variantes_Talla
        FOREIGN KEY (IdTalla)
        REFERENCES Tallas(IdTalla),

    CONSTRAINT UQ_Producto_Color_Talla
        UNIQUE (IdProducto, IdColor, IdTalla)
);
GO


CREATE TABLE Inventario (
    IdInventario INT PRIMARY KEY IDENTITY(1,1),
    IdProductoVariante INT NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    StockMinimo INT NOT NULL DEFAULT 0,
    UltimaActualizacion DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Inventario_Variantes
        FOREIGN KEY (IdProductoVariante)
        REFERENCES ProductoVariantes(IdProductoVariante)
);
GO


CREATE TABLE MovimientosInventario (
    IdMovimiento INT PRIMARY KEY IDENTITY(1,1),
    IdProductoVariante INT NOT NULL,
    TipoMovimiento VARCHAR(20) NOT NULL, -- ENTRADA / SALIDA / AJUSTE
    Cantidad INT NOT NULL,
    Motivo VARCHAR(200),
    FechaMovimiento DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Movimientos_Variante
        FOREIGN KEY (IdProductoVariante)
        REFERENCES ProductoVariantes(IdProductoVariante)
);
GO


CREATE TABLE EstadosPedido (
    IdEstado INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE
);
GO


CREATE TABLE MetodosPago (
    IdMetodoPago INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Activo BIT NOT NULL DEFAULT 1
);
GO


CREATE TABLE Pedidos (
    IdPedido INT PRIMARY KEY IDENTITY(1,1),
    IdUsuario INT NOT NULL,
    IdEstado INT NOT NULL,
    IdMetodoPago INT NOT NULL,
    FechaPedido DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(12,2) NOT NULL,

    CONSTRAINT FK_Pedidos_Usuarios
        FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),

    CONSTRAINT FK_Pedidos_Estado
        FOREIGN KEY (IdEstado) REFERENCES EstadosPedido(IdEstado),

    CONSTRAINT FK_Pedidos_MetodoPago
        FOREIGN KEY (IdMetodoPago) REFERENCES MetodosPago(IdMetodoPago)
);
GO


CREATE TABLE DetallePedido (
    IdDetalle INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL,
    IdProductoVariante INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(12,2) NOT NULL,

    CONSTRAINT FK_Detalle_Pedido
        FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),

    CONSTRAINT FK_Detalle_Variante
        FOREIGN KEY (IdProductoVariante) 
        REFERENCES ProductoVariantes(IdProductoVariante)
);
GO