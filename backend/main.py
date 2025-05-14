from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PIL import Image
import numpy as np
import io
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.utils import img_to_array
import cloudinary
import cloudinary.uploader
import os

from models import Base, User, Transaction
from database import engine, get_db
from auth import hash_password, authenticate_user, create_access_token, get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === CLOUDINARY CONFIG ===
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)

# === INIT DB ===
Base.metadata.create_all(bind=engine)

# === LOAD MODELS ===
model_path = "food_classifier_model.h5"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file '{model_path}' not found. Ensure it's in the same folder.")

model = load_model(model_path)

# === CLASS LABELS (updated to match main.py) ===
class_labels = [
    'Burger', 'Butter Naan', 'Chai', 'Chapati', 'Chole Bhature',
    'Dal Makhani', 'Dhokla', 'Fried Rice', 'Idli', 'Jalebi',
    'Kaathi Rolls', 'Kadai Paneer', 'Kulfi', 'Masala Dosa', 'Momos',
    'Paani Puri', 'Pakode', 'Pav Bhaji', 'Pizza', 'Samosa'
]

item_to_category = {
    'Burger': 'Fast Food',
    'Butter Naan': 'Indian Bread',
    'Chai': 'Beverage',
    'Chapati': 'Indian Bread',
    'Chole Bhature': 'North Indian',
    'Dal Makhani': 'North Indian',
    'Dhokla': 'Snack',
    'Fried Rice': 'Chinese',
    'Idli': 'South Indian',
    'Jalebi': 'Dessert',
    'Kaathi Rolls': 'Fast Food',
    'Kadai Paneer': 'North Indian',
    'Kulfi': 'Dessert',
    'Masala Dosa': 'South Indian',
    'Momos': 'Chinese',
    'Paani_puri': 'Street Food',
    'Pakode': 'Snack',
    'Pav Bhaji': 'Street Food',
    'Pizza': 'Fast Food',
    'Samosa': 'Snack'
}


# === IMAGE PROCESSING ===
def preprocess_image(image_bytes):
    """Process image for the new food classifier model"""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)
    image_array = preprocess_input(image_array)  # MobileNetV2-specific preprocessing
    return image_array


# === CLOUDINARY UPLOAD ===
def upload_image_to_cloudinary(image_bytes):
    response = cloudinary.uploader.upload(io.BytesIO(image_bytes), resource_type="image")
    return response["secure_url"]

# === SIGNUP ROUTE ===
@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = hash_password(password)
    user = User(username=username, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    return {"msg": "Signup successful"}

# === LOGIN ROUTE ===
@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "user": user.username}

# === PREDICT ROUTE ===
@app.post("/predict")
async def predict_image(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_bytes = await image.read()

    # Step 1: Multiclass Prediction (updated to use threshold)
    processed_image = preprocess_image(image_bytes)
    predictions = model.predict(processed_image)
    predicted_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_index])

    THRESHOLD = 0.6  # adjust this value based on your experiments
    if confidence >= THRESHOLD:
        predicted_class = class_labels[predicted_index]
        category = item_to_category.get(predicted_class)
    else:
        predicted_class = "Unable to Detect"
        confidence = 0.0  # reset confidence for unknown
        return {
        "prediction": predicted_class,
        "confidence": confidence,
        "image_url": ""
        }

    # Step 2: Upload image to Cloudinary
    image_url = upload_image_to_cloudinary(image_bytes)

    # Step 3: Save Transaction
    transaction = Transaction(
        user_id=current_user.id,
        image_url=image_url,
        prediction=predicted_class,
        confidence=confidence
    )
    db.add(transaction)
    db.commit()

    return {
        "prediction": predicted_class,
        "category": category,
        "confidence": confidence,
        "image_url": image_url
    }



@app.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = [
        {
            "id": txn.id,
            "image_url": txn.image_url,
            "prediction": txn.prediction,
            "confidence": txn.confidence,
            "timestamp": txn.timestamp,
        }
        for txn in current_user.transactions
    ]
    return {"user": current_user.username, "history": history}
