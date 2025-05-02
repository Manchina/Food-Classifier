from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import pytz  # <-- Add this import

# Define IST timezone
IST = pytz.timezone("Asia/Kolkata")

# Function to get current IST time
def get_ist_time():
    return datetime.now(IST)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    transactions = relationship("Transaction", back_populates="owner")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=get_ist_time)  # <-- Uses IST time
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="transactions")
