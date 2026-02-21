import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GROQ_API_KEY")
print(f"Key found: {'Yes' if key else 'No'}")
if key:
    print(f"Key starts with: {key[:4]}")
