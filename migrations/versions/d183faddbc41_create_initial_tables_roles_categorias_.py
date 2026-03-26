"""Placeholder migration to restore missing revision file

This is a minimal placeholder so Alembic can locate the revision id
that was previously stamped into the database. It intentionally does
no schema changes (upgrade/downgrade are no-ops). If you later want
this to reflect real schema operations, replace the body with the
original generated migration or a proper migration script.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd183faddbc41'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # No-op placeholder
    pass


def downgrade():
    # No-op placeholder
    pass
