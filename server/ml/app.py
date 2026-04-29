from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Load model once at startup
print("Loading model...")
model = tf.keras.models.load_model('mediscan_model.h5')
CLASS_NAMES = ['NORMAL', 'PNEUMONIA']  # match your training classes
print("✅ Model loaded!")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    img_bytes = file.read()

    # Preprocess image
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    predictions = model.predict(img_array)
    predicted_index = int(np.argmax(predictions[0]))
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions[0])) * 100

    all_probs = {
        CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 2)
        for i in range(len(CLASS_NAMES))
    }

    return jsonify({
        'prediction': predicted_class,
        'confidence': round(confidence, 2),
        'probabilities': all_probs
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'MediScan MobileNetV2'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)