import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.0-flash")


def generate_ai_feedback(question, answer):
    prompt = f"""
    You are an interview evaluator.

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate based on:
    - technical clarity
    - communication
    - relevance
    - improvements needed

    Give concise feedback.
    """

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("Gemini Error:", e)

        # fallback feedback
        return """
AI service temporarily unavailable.

Fallback Feedback:
- Try giving more structured answers
- Mention project architecture
- Talk about challenges faced
- Include measurable results/impact
- Use STAR method for behavioral responses
"""