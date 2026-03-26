"""Add EstadosPedido and MetodosPago models

Revision ID: 0314a2ec02ba
Revises: c3e7da14e28c
Create Date: 2026-03-25 19:10:30.145183

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = '0314a2ec02ba'
down_revision = 'c3e7da14e28c'
branch_labels = None
depends_on = None


def upgrade():
    # Aplicar únicamente las modificaciones esperadas para estos modelos.
    # Añadimos columnas 'Activo' y 'FechaCreacion' a 'EstadosPedido' y 'FechaCreacion' a 'MetodosPago'.
    with op.batch_alter_table('EstadosPedido', schema=None) as batch_op:
        batch_op.add_column(sa.Column('Activo', sa.Boolean(), nullable=False, server_default=sa.text('((1))')))
        batch_op.add_column(sa.Column('FechaCreacion', sa.DateTime(), nullable=False, server_default=sa.text('(getdate())')))

    with op.batch_alter_table('MetodosPago', schema=None) as batch_op:
        batch_op.add_column(sa.Column('FechaCreacion', sa.DateTime(), nullable=False, server_default=sa.text('(getdate())')))


def downgrade():
    # Revertir únicamente las columnas añadidas en upgrade().
    with op.batch_alter_table('MetodosPago', schema=None) as batch_op:
        batch_op.drop_column('FechaCreacion')

    with op.batch_alter_table('EstadosPedido', schema=None) as batch_op:
        batch_op.drop_column('FechaCreacion')
        batch_op.drop_column('Activo')
