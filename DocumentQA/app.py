import os
import requests
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from pypdf import PdfReader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
# Robustly determine upload folder
try:
    # Try to use local 'uploads' folder
    UPLOAD_FOLDER = 'uploads'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
except OSError:
    # Fallback to /tmp (read-only file system or Vercel)
    UPLOAD_FOLDER = '/tmp'

ALLOWED_EXTENSIONS = {'txt', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    reader = PdfReader(filepath)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def query_groq(question, context):
    if not GROQ_API_KEY or "your_groq_api_key" in GROQ_API_KEY:
        return "Error: Groq API Key is missing. Please add it to the .env file."
    
    # Truncate context to prevent 413 errors (Payload Too Large)
    # Llama 3.3 has a large context, but the API endpoint might have limits on the request body size.
    # Safe limit: ~30,000 characters (approx 7-8k tokens).
    MAX_CONTEXT_CHARS = 30000
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "... (truncated)"
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"
    
    data = {
        "model": "llama-3.3-70b-versatile", 
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code != 200:
            print(f"Groq Error: {response.text}")
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"Error communicating with LLM: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text immediately for simplicity in this version
        content = ""
        if filename.endswith('.pdf'):
            content = extract_text_from_pdf(filepath)
        else:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
        # In a real app, we might store 'content' in a DB or vector store.
        # Here we return it to the client to keep state simple for now, 
        # or we could cache it in memory/session. 
        # For this MVP, let's send it back so the client can send it with the question.
        
        return jsonify({
            'message': 'File uploaded successfully', 
            'filename': filename,
            'content': content[:50000] # Limit content size for prompt context if needed
        })
        
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    context = data.get('context')
    
    if not question or not context:
        return jsonify({'error': 'Missing question or document context'}), 400
        
    answer = query_groq(question, context)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
