# Document QA System

A Flask-based application to analyze and chat with documents (PDF/TXT) using Groq AI.

## Deployment on Vercel

1. **Push to GitHub**: Upload these files to a GitHub repository.
2. **Import to Vercel**: 
   - Go to https://vercel.com/new
   - Import your GitHub repository.
3. **Environment Variables**:
   - Add `GROQ_API_KEY`: Your Groq API Key.
   - Add `DATABASE_URL`: Your Postgres connection string.
4. **Deploy**: Click Deploy!

## Local Run

```bash
pip install -r requirements.txt
python app.py
```
