import os
import requests
import json

GROQ_QUIZ_KEY = os.getenv("GROQ_QUIZ_KEY")
GROQ_API_BASE = os.getenv("GROQ_API_BASE")
MODEL = os.getenv("MODEL")

def generate_quiz_from_summary(summary_text, num_questions=5):
    if not summary_text:
        return []

    prompt = f"""
    Generate exactly {num_questions} multiple-choice questions based on the following summary.
    Each question should have options A-D and indicate the correct answer.
    Return the output as a JSON array of objects with:
    - id (int)
    - question (str)
    - options (array of 4 strings)
    - answer (str)

    Summary:
    {summary_text}
    """

    headers = {
        "Authorization": f"Bearer {GROQ_QUIZ_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL,
        "input": prompt
    }

    try:
        response = requests.post(f"{GROQ_API_BASE}/completions", headers=headers, json=data)
        response.raise_for_status()
        result = response.json()

        # Groq sometimes returns a field called 'output_text' or 'output'
        text_output = result.get("output_text") or result.get("output") or ""
        
        # Try to parse JSON safely
        questions = json.loads(text_output)
        return questions

    except json.JSONDecodeError:
        print("Error parsing JSON from Groq response:", text_output)
        return []
    except requests.RequestException as e:
        print("Error generating quiz:", e)
        return []
