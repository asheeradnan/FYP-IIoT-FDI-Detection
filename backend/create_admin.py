"""
Script to create a default admin user
"""
from app.database import SessionLocal, engine, Base
from app.models import User, UserRole, UserStatus
from app.utils.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def create_admin():
    db = SessionLocal()
    
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@fyp.com").first()
    
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin = User(
        name="System Admin",
        employee_id="ADMIN001",
        email="admin@fyp.com",
        hashed_password=get_password_hash("Admin@123"),
        role=UserRole.ADMIN,
        status=UserStatus.APPROVED,
        is_active=True
    )
    
    db.add(admin)
    db.commit()
    db.close()
    
    print("✅ Admin user created successfully!")
    print("Email: admin@fyp.com")
    print("Password: Admin@123")
    print("\n⚠️  Please change the password after first login!")

if __name__ == "__main__":
    create_admin()
