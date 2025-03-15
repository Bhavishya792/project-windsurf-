from flask import Flask, request, jsonify, render_template, send_from_directory, send_file
from dotenv import load_dotenv
import os
import io
from PIL import Image
import google.generativeai as genai
import base64
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro-vision')

app = Flask(__name__)

@app.route('/')
def home():
    """Render the home page"""
    maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    return render_template('index.html', maps_api_key=maps_api_key)

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """API endpoint to analyze uploaded images"""
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        # Get image data from the request
        image_data = data['image']
        
        try:
            # Convert base64 to image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(io.BytesIO(image_bytes))
            
            # Prepare prompt for Gemini
            prompt = """Analyze this image and provide a detailed recycling guide in the following format:
            1. Material Identification: Identify the main materials in the item
            2. Recycling Instructions: Step-by-step guide on how to properly recycle each material
            3. Local Considerations: Any special instructions for local recycling programs
            4. Environmental Impact: Brief explanation of environmental benefits of recycling this item
            5. Reuse Suggestions: Creative ways to reuse or upcycle the item before recycling

            Format the response with clear sections and bullet points where appropriate."""
            
            # Create image part for Gemini
            image_part = {'mime_type': 'image/jpeg', 'data': image_bytes}
            
            # Generate response
            response = model.generate_content([prompt, image_part])
            
            # Return analysis
            return jsonify({
                'success': True,
                'analysis': response.text
            })
            
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return jsonify({'error': 'Failed to process image'}), 500

    except Exception as e:
        print(f"Error in analyze_image: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/nearby-places')
def get_nearby_places():
    """Get nearby recycling centers"""
    try:
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        
        # Load recycling centers from JSON file
        with open('recycling_centers.json', 'r') as f:
            all_centers = json.load(f)
        
        # Filter centers within range (simplified distance calculation)
        nearby_centers = []
        for center in all_centers:
            # Simple distance check (not accurate for long distances)
            if abs(center['lat'] - lat) < 0.1 and abs(center['lng'] - lng) < 0.1:
                nearby_centers.append(center)
        
        return jsonify({'places': nearby_centers})
        
    except Exception as e:
        print(f"Error in get_nearby_places: {str(e)}")
        return jsonify({'error': 'Failed to fetch nearby places'}), 500

@app.route('/api/all-recycling-centers')
def get_all_centers():
    """Get all recycling centers"""
    try:
        with open('recycling_centers.json', 'r') as f:
            centers = json.load(f)
        return jsonify({'places': centers})
    except Exception as e:
        print(f"Error in get_all_centers: {str(e)}")
        return jsonify({'error': 'Failed to fetch recycling centers'}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)
import os
import json
import base64
import io
from PIL import Image
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
    
genai.configure(api_key=api_key)

def analyze_image_with_gemini(image_data):
    """
    Analyze an image using Google's Gemini API to generate a detailed recycling guide.
    
    Args:
        image_data: Base64 encoded image data
        
    Returns:
        String containing the analysis result or None if analysis failed
    """
    try:
        # Extract base64 data
        if ',' in image_data:
            image_bytes = base64.b64decode(image_data.split(',')[1])
        else:
            image_bytes = base64.b64decode(image_data)
        
        # Process image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Save as JPEG in memory
        output_buffer = io.BytesIO()
        image.save(output_buffer, format='JPEG')
        image_bytes = output_buffer.getvalue()
        
        # Create the Gemini model
        model = genai.GenerativeModel('gemini-pro-vision')
        
        # Prepare the prompt for detailed recycling guide
        prompt = """
        Analyze this image and provide a detailed recycling guide for the product shown. 
        Include the following sections in your response:

        1. Material Identification:
           - Identify all visible materials in the product
           - Specify recycling codes if applicable
           - Note any special materials or components

        2. Recycling Instructions:
           - Provide step-by-step breakdown process
           - Explain which parts go in which recycling bins
           - Describe any cleaning or preparation needed before recycling

        3. Local Considerations:
           - Mention common variations in recycling rules
           - Note any special disposal requirements
           - Suggest alternative recycling programs if standard recycling isn't available

        4. Environmental Impact:
           - Explain the impact if not recycled properly
           - Quantify benefits of recycling this item (energy savings, reduced emissions)
           - Provide biodegradability timeframe for different components

        5. Reuse Suggestions:
           - Offer creative reuse ideas
           - Suggest upcycling possibilities
           - Recommend ways to extend the product's life

        Be specific to what you actually see in the image. If you can't identify something clearly, say so.
        If certain parts require special handling, emphasize that.
        """
        
        # Generate content
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        
        # Return the analysis text
        if hasattr(response, 'text'):
            return response.text
        else:
            print("Error: Response has no text attribute")
            return None
        
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return None

@app.route('/')
def index():
    """Render the main page"""
    maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not maps_api_key:
        raise ValueError("GOOGLE_MAPS_API_KEY not found in environment variables")
    return render_template('index.html', maps_api_key=maps_api_key)

@app.route('/static/<path:path>')
def send_static(path):
    """Serve static files"""
    return send_from_directory('static', path)

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """API endpoint to analyze uploaded images"""
    try:
        # Get and validate request data
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
            
        image_data = data['image']
        if not image_data.startswith('data:image/'):
            return jsonify({'error': 'Invalid image format'}), 400
            
        # Analyze the image
        analysis = analyze_image_with_gemini(image_data)
        
        if not analysis:
            return jsonify({'error': 'Failed to analyze image. Please try a different image or check your internet connection.'}), 500
            
        return jsonify({'analysis': analysis})
        
    except Exception as e:
        print(f"Server error during analysis: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

@app.route('/api/nearby-places')
def nearby_places():
    """API endpoint to get nearby recycling centers"""
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        
        # Load recycling centers
        with open('recycling_centers.json', 'r') as f:
            data = json.load(f)
            centers = data.get('places', [])
        
        # Filter centers within 10km radius (rough approximation)
        nearby = []
        for center in centers:
            if abs(center['lat'] - lat) <= 0.1 and abs(center['lng'] - lng) <= 0.1:
                nearby.append(center)
        
        return jsonify({'places': nearby})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/all-recycling-centers')
def all_recycling_centers():
    """API endpoint to get all recycling centers"""
    try:
        with open('recycling_centers.json', 'r') as f:
            data = json.load(f)
            centers = data.get('places', [])
        return jsonify({'places': centers})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
