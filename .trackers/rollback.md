# Rollback Information

- Previous known-good on main: b438f7f (backend foundation merge)
- To discard: git checkout main && git branch -D feat/user-auth-http-only-cookies
- Migration 001 can be rolled back with `alembic downgrade -1` if applied
