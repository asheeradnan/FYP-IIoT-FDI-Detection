# PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set a password for the `postgres` user (remember this!)
   - Default port: 5432 (keep this)
   - Install pgAdmin 4 (GUI tool)

### Alternative - Using Docker (Easier):
```powershell
# Install Docker Desktop first, then run:
docker run --name fyp-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fyp_iiot_db -p 5432:5432 -d postgres:15
```

## Step 2: Create Database

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin 4
2. Connect to PostgreSQL (localhost)
3. Right-click "Databases" → Create → Database
4. Name: `fyp_iiot_db`
5. Click "Save"

### Option B: Using Command Line
```powershell
# Open PowerShell and run:
psql -U postgres
# Enter your postgres password when prompted

# Then in psql terminal:
CREATE DATABASE fyp_iiot_db;
\q
```

### Option C: Using the provided script
```powershell
cd backend
python setup_database.py
```

## Step 3: Configure Environment

1. Create `.env` file in the `backend` folder:
```powershell
cd backend
cp .env.example .env
```

2. Edit `.env` file and update the DATABASE_URL:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/fyp_iiot_db
```
Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

## Step 4: Install Python PostgreSQL Driver

```powershell
cd backend
python -m pip install psycopg2-binary
```

## Step 5: Initialize Database

```powershell
cd backend
python create_admin.py
```

This will:
- Create all necessary tables
- Create the default admin user

## Step 6: Verify Connection

Start the server:
```powershell
cd backend
python -m uvicorn main:app --reload
```

Visit: http://127.0.0.1:8000/docs

## Troubleshooting

### Error: "could not connect to server"
- Ensure PostgreSQL service is running
- Windows: Services → PostgreSQL → Start

### Error: "password authentication failed"
- Check your password in the .env file
- Verify postgres user password

### Error: "database does not exist"
- Run: `CREATE DATABASE fyp_iiot_db;` in psql

## Database Credentials (Default)

```
Host: localhost
Port: 5432
Database: fyp_iiot_db
Username: postgres
Password: (set during installation)
```

## Viewing Your Data

### Using pgAdmin:
1. Open pgAdmin 4
2. Navigate to: Servers → PostgreSQL → Databases → fyp_iiot_db → Schemas → public → Tables
3. Right-click on "users" → View/Edit Data → All Rows

### Using SQL:
```sql
-- View all users
SELECT * FROM users;

-- View all anomalies
SELECT * FROM anomalies;
```
