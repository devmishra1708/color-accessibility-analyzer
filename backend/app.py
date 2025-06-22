from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

# Color blindness simulation matrices
COLOR_BLINDNESS_MATRICES = {
    "protanopia": np.array([[0.567, 0.433, 0.0],
                            [0.558, 0.442, 0.0],
                            [0.0,   0.242, 0.758]]),
    "deuteranopia": np.array([[0.625, 0.375, 0.0],
                              [0.7,   0.3,   0.0],
                              [0.0,   0.3,   0.7]]),
    "tritanopia": np.array([[0.95,  0.05,  0.0],
                            [0.0,   0.433, 0.567],
                            [0.0,   0.475, 0.525]]),
    "achromatopsia": np.array([[0.299, 0.587, 0.114],
                               [0.299, 0.587, 0.114],
                               [0.299, 0.587, 0.114]])
}

def simulate_color_blindness(image, vision_type):
    if vision_type not in COLOR_BLINDNESS_MATRICES:
        vision_type = "protanopia"

    matrix = COLOR_BLINDNESS_MATRICES[vision_type]
    img_float = image.astype(np.float32) / 255.0
    simulated = np.dot(img_float, matrix.T)
    simulated = np.clip(simulated, 0, 1)
    simulated = (simulated * 255).astype(np.uint8)
    return simulated

def calculate_contrast(p1, p2):
    def luminance(pixel):
        r, g, b = [x / 255.0 for x in pixel]
        r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    l1 = luminance(p1)
    l2 = luminance(p2)
    ratio = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
    return ratio

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['file']
    vision_type = request.form.get('vision_type', 'protanopia')

    image = Image.open(file.stream).convert("RGB")
    image_np = np.array(image)

    # Simulate image based on selected vision type
    simulated = simulate_color_blindness(image_np, vision_type)

    # Pick two pixels for contrast analysis
    h, w, _ = image_np.shape
    p1 = image_np[h // 4, w // 4]
    p2 = image_np[3 * h // 4, 3 * w // 4]
    ratio = calculate_contrast(p1, p2)

    contrast_result = {
        'pixel_1': p1.tolist(),
        'pixel_2': p2.tolist(),
        'contrast_ratio': round(ratio, 2),
        'passes_wcag': str(ratio >= 4.5)  # Make sure it's JSON serializable
    }

    # Convert simulated image to base64
    _, buffer = cv2.imencode('.png', simulated)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return jsonify({
        'message': 'Image processed successfully.',
        'simulation': vision_type,
        'contrast_result': contrast_result,
        'simulated_image': encoded_image
    })

if __name__ == '__main__':
    app.run(debug=True)
