"""Add Talla model

Revision ID: c3e7da14e28c
Revises: d183faddbc41
Create Date: 2026-03-25 18:51:19.794765

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = 'c3e7da14e28c'
down_revision = 'd183faddbc41'
branch_labels = None
depends_on = None


def upgrade():
    # Mantener sólo las operaciones necesarias para este cambio de modelo.
    # Se añaden columnas a 'Colores' y 'Tallas' y se ajusta la longitud de 'Nombre' en 'Tallas'.
    with op.batch_alter_table('Colores', schema=None) as batch_op:
        batch_op.add_column(sa.Column('CodigoHex', sa.String(length=7), nullable=True))
        batch_op.add_column(sa.Column('FechaCreacion', sa.DateTime(), nullable=False))

    with op.batch_alter_table('Tallas', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Descripcion', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('FechaCreacion', sa.DateTime(), nullable=False))
        batch_op.alter_column('Nombre',
               existing_type=sa.VARCHAR(length=20, collation='SQL_Latin1_General_CP1_CI_AS'),
               type_=sa.String(length=50),
               existing_nullable=False)


def downgrade():
    # Revertir únicamente los cambios aplicados en upgrade().
    with op.batch_alter_table('Tallas', schema=None) as batch_op:
        batch_op.alter_column('Nombre',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=20, collation='SQL_Latin1_General_CP1_CI_AS'),
               existing_nullable=False)
        batch_op.drop_column('FechaCreacion')
        batch_op.drop_column('Descripcion')

    with op.batch_alter_table('Colores', schema=None) as batch_op:
        batch_op.drop_column('FechaCreacion')
        batch_op.drop_column('CodigoHex')
