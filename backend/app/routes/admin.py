from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserStatus, UserRole
from app.schemas import UserResponse, UserApprovalRequest
from app.utils.auth import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Verify admin user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    email = payload.get("sub")
    role = payload.get("role")
    
    if role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access admin resources"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/pending-users", response_model=List[UserResponse])
async def get_pending_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all pending user registration requests"""
    pending_users = db.query(User).filter(User.status == UserStatus.PENDING).all()
    return pending_users

@router.post("/approve-user")
async def approve_user(
    request: UserApprovalRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Approve or decline a user registration"""
    
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if request.approved:
        user.status = UserStatus.APPROVED
        user.is_active = True
        message = "User approved successfully"
        # TODO: Send approval email
    else:
        user.status = UserStatus.DECLINED
        user.is_active = False
        message = "User declined"
        # TODO: Send decline email
    
    db.commit()
    
    return {"message": message, "user_id": user.id, "status": user.status}

@router.get("/analytics")
async def get_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get system analytics"""
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    pending_users = db.query(User).filter(User.status == UserStatus.PENDING).count()
    
    # TODO: Add anomaly frequency and system health metrics
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "pending_users": pending_users,
        "anomaly_frequency": 0,  # Placeholder
        "system_health": "Good"  # Placeholder
    }
