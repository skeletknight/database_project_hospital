# Database Migrations Guide (Alembic)

This project uses **Alembic** to handle database schema changes. This allows you to modify tables in `models.py` and propagate those changes to the database without deleting data.

## 1. Setup

Ensure you have installed the requirements:
```bash
pip install -r requirements.txt
```

## 2. Initial Migration

If this is your first time using migrations on this database, run:

```bash
# Generate the initial migration script based on models.py
alembic revision --autogenerate -m "Initial migration"

# Apply the migration to the database
alembic upgrade head
```

## 3. Making Changes

1. Modify your SQLAlchemy models in `backend/models.py` (e.g., add a column `phone_number` to `User`).
2. Run the command to generate a new migration file:
   ```bash
   alembic revision --autogenerate -m "Added phone number to users"
   ```
3. Check the generated file in `backend/alembic/versions/` to ensure it looks correct.
4. Apply the changes:
   ```bash
   alembic upgrade head
   ```

## 4. Troubleshooting

*   **Target database is not up to date:** Run `alembic stamp head` if your DB already has tables but Alembic doesn't know about them.
*   **Import Errors:** Ensure you are running alembic commands from inside the `backend/` directory.
