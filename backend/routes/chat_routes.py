from flask import Blueprint, jsonify, request

from services.gemini_service import generate_response

from database.database import (
    create_conversation,
    get_all_conversations,
    delete_conversation,
     
    save_message,
    get_messages,
    update_conversation_title,
)

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "K-Hub Chatbot Backend is Running!"
    })


@chat_bp.route("/conversations", methods=["GET"])
def list_conversations():
    conversations = get_all_conversations()
    return jsonify(conversations)


@chat_bp.route("/conversations", methods=["POST"])
def new_conversation():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "New Chat")

    conversation_id = create_conversation(title)

    return jsonify({
        "message": "Conversation created successfully",
        "conversation_id": conversation_id
    }), 201


@chat_bp.route("/conversations/<int:conversation_id>", methods=["DELETE"])
def remove_conversation(conversation_id):
    delete_conversation(conversation_id)

    return jsonify({
        "message": "Conversation deleted successfully"
    })





@chat_bp.route("/messages/<int:conversation_id>", methods=["GET"])
def list_messages(conversation_id):
    messages = get_messages(conversation_id)
    return jsonify(messages)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    conversation_id = data["conversation_id"]
    user_message = data["message"]

    # Save user's message
    save_message(conversation_id, "user", user_message)

    # Rename the conversation if it is still "New Chat"
    conversations = get_all_conversations()

    for chat in conversations:
        if chat["id"] == conversation_id and chat["title"] == "New Chat":
            update_conversation_title(
                conversation_id,
                user_message[:30]
            )
            break

    # Get the full conversation history
    history = get_messages(conversation_id)

    # System prompt
    prompt = """
You are K-Hub AI Chatbot.

Instructions:
- Answer directly without greetings such as "Hi", "Hello", or "Certainly".
- Explain concepts in simple English.
- Keep answers concise but informative.
- When explaining technical topics, follow this format:

Definition:
<short definition>

Key Points:
• Point 1
• Point 2
• Point 3

Example:
<one real-world example>

If the user asks for more details, provide a longer explanation.
Use previous conversation history to answer follow-up questions.
"""

    # Add previous conversation
    for msg in history:
     if msg["role"] == "user":
        prompt += f"User: {msg['message']}\n"
     else:
        prompt += f"Assistant: {msg['message']}\n"

    prompt += "Assistant:"
    print("========== PROMPT ==========")
    print(prompt)
    print("============================")

    try:
        ai_response = generate_response(prompt)

    except Exception as e:
        print("Chat Route Error:", e)
        ai_response = (
            "⚠️ The AI service is temporarily unavailable. "
            "Please try again in a few moments."
    )

    save_message(conversation_id, "assistant", ai_response)

    return jsonify({
      "response": ai_response
})