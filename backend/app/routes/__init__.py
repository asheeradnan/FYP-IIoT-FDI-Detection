from .auth import router as auth_router
from .admin import router as admin_router
from .model import router as model_router

__all__ = ["auth_router", "admin_router", "model_router"]
