from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, UserStatus

# User Schemas
class UserBase(BaseModel):
    name: str
    employee_id: str
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    confirm_password: str
    recaptcha_token: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    status: UserStatus
    is_active: bool
    email_verified: bool = False
    created_at: datetime
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True
    
    @model_validator(mode='after')
    def set_full_name(self):
        if self.full_name is None:
            self.full_name = self.name
        return self

class UserApprovalRequest(BaseModel):
    user_id: int
    approved: bool

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Anomaly Schemas
class AnomalyResponse(BaseModel):
    id: int
    node_id: str
    confidence: float
    detected_at: datetime
    is_resolved: bool
    severity: str
    
    class Config:
        from_attributes = True

# Model Prediction Schema
class PredictionRequest(BaseModel):
    sensor_data: dict

class PredictionResponse(BaseModel):
    anomalies: list[dict]
    topology: dict
    timestamp: datetime
