"""
PostgreSQL Database Setup Script
Run this after installing PostgreSQL to create the database
"""
import psycopg2
from psycopg2 import sql
import sys

def create_database():
    """Create the FYP database if it doesn't exist"""
    
    print("=" * 50)
    print("PostgreSQL Database Setup for FYP IIoT System")
    print("=" * 50)
    
    # Get credentials
    print("\nEnter PostgreSQL credentials:")
    host = input("Host (default: localhost): ").strip() or "localhost"
    port = input("Port (default: 5432): ").strip() or "5432"
    username = input("Username (default: postgres): ").strip() or "postgres"
    password = input("Password: ").strip()
    
    if not password:
        print("❌ Password is required!")
        sys.exit(1)
    
    database_name = "fyp_iiot_db"
    
    try:
        # Connect to PostgreSQL (default postgres database)
        print(f"\n🔌 Connecting to PostgreSQL at {host}:{port}...")
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database="postgres"  # Connect to default database first
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (database_name,)
        )
        exists = cursor.fetchone()
        
        if exists:
            print(f"✅ Database '{database_name}' already exists!")
        else:
            # Create database
            print(f"\n📦 Creating database '{database_name}'...")
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(database_name)
                )
            )
            print(f"✅ Database '{database_name}' created successfully!")
        
        cursor.close()
        conn.close()
        
        # Create .env file
        print("\n📝 Creating .env file...")
        connection_string = f"postgresql://{username}:{password}@{host}:{port}/{database_name}"
        
        env_content = f"""# Database Configuration
DATABASE_URL={connection_string}

# JWT Secret Key (generate using: openssl rand -hex 32)
SECRET_KEY=your-secret-key-change-this-in-production-{password[:8]}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=FYP IIoT System

# Frontend URL
FRONTEND_URL=http://localhost:3000

# reCAPTCHA (optional)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
"""
        
        with open(".env", "w") as f:
            f.write(env_content)
        
        print("✅ .env file created!")
        
        print("\n" + "=" * 50)
        print("✅ Setup Complete!")
        print("=" * 50)
        print(f"\nDatabase: {database_name}")
        print(f"Connection: {host}:{port}")
        print(f"\nNext steps:")
        print("1. Run: python create_admin.py")
        print("2. Run: python -m uvicorn main:app --reload")
        print("3. Visit: http://127.0.0.1:8000/docs")
        
    except psycopg2.Error as e:
        print(f"\n❌ Database error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check your credentials")
        print("3. Verify PostgreSQL is installed")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    create_database()
