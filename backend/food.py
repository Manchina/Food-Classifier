import sys
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# Load your model
model = load_model("food.h5")

# Preprocessing to match model input (64x64x3)
def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = image.resize((64, 64))  # Resize to expected shape
    image = img_to_array(image)
    image = image / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Shape: (1, 64, 64, 3)
    return image

def predict_image(image_path):
    image = preprocess_image(image_path)
    prediction = model.predict(image)[0][0]  # Assuming binary output
    label = "Food" if prediction >= 0.5 else "Not Food"
    confidence = float(prediction) if prediction >= 0.5 else 1 - float(prediction)
    return label, confidence

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python food.py <image_path>")
    else:
        image_path = sys.argv[1]
        label, confidence = predict_image(image_path)
        print(f"Prediction: {label} (Confidence: {confidence:.2f})")
