import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(type(e))
        print(e)
        print("==================================")
        return f"ERROR: {e}"


print("API Key:", GEMINI_API_KEY[:10] + "...")