from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import pytz  # Required for timezone support

# Define IST timezone
IST = pytz.timezone("Asia/Kolkata")

# Function to return timezone-aware IST datetime
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
    # Store timezone-aware datetime in IST
    timestamp = Column(DateTime(timezone=True), default=get_ist_time)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="transactions")
