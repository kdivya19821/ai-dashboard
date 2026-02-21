import requests
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(f"Key loaded: {GROQ_API_KEY[:5]}...")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

prompt = "Context:\nThe quick brown fox.\n\nQuestion: What is the fox?\n\nAnswer:"

data = {
    "model": "llama-3.3-70b-versatile", 
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.5
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Error Body: {response.text}")
    response.raise_for_status()
    print("Success!")
    print(response.json()['choices'][0]['message']['content'])
except Exception as e:
    print(f"Exception: {e}")
