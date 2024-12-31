# app/database/base.py

from .connection import Base
from .models.user import User

# Import all models here
# This prevents circular imports while ensuring all models are registered

# You can list all your models here for easy importing elsewhere
__all__ = ['Base', 'User']