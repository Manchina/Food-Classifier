import io
import sys
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

MODEL_PATH = "food_classifier_mobilenet.h5"
model = load_model(MODEL_PATH)

class_labels = [
    "Bread", "Dairy", "Dessert", "Egg", "Fried Food", 
    "Meat", "Noodles", "Rice", "Seafood", "Soup", "Vegetable"
]

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict_image(file_path):
    with open(file_path, "rb") as f:
        image_bytes = f.read()
    processed = preprocess_image(image_bytes)
    predictions = model.predict(processed)
    predicted_index = np.argmax(predictions[0])
    predicted_class = class_labels[predicted_index]
    return predicted_class

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
    else:
        result = predict_image(sys.argv[1])
        print(f"Predicted class: {result}")
