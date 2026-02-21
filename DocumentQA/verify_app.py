import requests
import sys

BASE_URL = "http://127.0.0.1:5001"

def test_index():
    print("Testing GET / ...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200 and "Document QA" in response.text:
            print("PASS: Index page loaded successfully.")
        else:
            print(f"FAIL: Index page returned {response.status_code}. Content preview: {response.text[:100]}")
            sys.exit(1)
    except Exception as e:
        print(f"FAIL: Could not connect to server. {e}")
        sys.exit(1)

def test_upload():
    print("Testing POST /upload ...")
    files = {'file': ('test.txt', open('test.txt', 'rb'), 'text/plain')}
    try:
        response = requests.post(f"{BASE_URL}/upload", files=files)
        if response.status_code == 200:
            data = response.json()
            if data.get('filename') == 'test.txt' and 'quick brown fox' in data.get('content', ''):
                print("PASS: File upload and text extraction successful.")
            else:
                print(f"FAIL: Unexpected response content. {data}")
                sys.exit(1)
        else:
            print(f"FAIL: Upload endpoint returned {response.status_code}. {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f"FAIL: Upload test failed. {e}")
        sys.exit(1)

def test_ask():
    print("Testing POST /ask (LLM) ...")
    # minimal context
    payload = {
        "question": "What is the quick brown fox doing?",
        "context": "The quick brown fox jumps over the lazy dog."
    }
    try:
        response = requests.post(f"{BASE_URL}/ask", json=payload)
        if response.status_code == 200:
            data = response.json()
            answer = data.get('answer', '')
            if answer and "Error" not in answer:
                print(f"PASS: LLM answered: {answer[:50]}...")
            else:
                print(f"FAIL: LLM returned error or empty. {answer}")
                sys.exit(1)
        else:
            print(f"FAIL: Ask endpoint returned {response.status_code}. {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f"FAIL: Ask test failed. {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_index()
    test_upload()
    test_ask()
    print("All verification tests passed!")
