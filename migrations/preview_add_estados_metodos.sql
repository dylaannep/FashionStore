BEGIN TRANSACTION;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

GO

-- Running upgrade  -> d183faddbc41

INSERT INTO alembic_version (version_num) OUTPUT inserted.version_num VALUES ('d183faddbc41');

GO

-- Running upgrade d183faddbc41 -> c3e7da14e28c

ALTER TABLE [Colores] ADD [CodigoHex] VARCHAR(7) NULL;

GO

ALTER TABLE [Colores] ADD [FechaCreacion] DATETIME NOT NULL;

GO

ALTER TABLE [Tallas] ADD [Descripcion] VARCHAR(200) NULL;

GO

ALTER TABLE [Tallas] ADD [FechaCreacion] DATETIME NOT NULL;

GO

ALTER TABLE [Tallas] ALTER COLUMN [Nombre] VARCHAR(50) NOT NULL;

GO

UPDATE alembic_version SET version_num='c3e7da14e28c' WHERE alembic_version.version_num = 'd183faddbc41';

GO

-- Running upgrade c3e7da14e28c -> 0314a2ec02ba

DROP TABLE [ProductoVariantes];

GO

DROP TABLE [SubCategorias];

GO

DROP TABLE [MovimientosInventario];

GO

DROP TABLE [Pedidos];

GO

DROP TABLE [UsuarioRoles];

GO

DROP TABLE [Usuarios];

GO

DROP TABLE [Inventario];

GO

DROP TABLE [DetallePedido];

GO

DROP TABLE [Productos];

GO

ALTER TABLE [EstadosPedido] ADD [Activo] BIT NOT NULL;

GO

ALTER TABLE [EstadosPedido] ADD [FechaCreacion] DATETIME NOT NULL;

GO

ALTER TABLE [MetodosPago] ADD [FechaCreacion] DATETIME NOT NULL;

GO

UPDATE alembic_version SET version_num='0314a2ec02ba' WHERE alembic_version.version_num = 'c3e7da14e28c';

GO

COMMIT;

GO

