from flask import Blueprint, jsonify, request

from services.gemini_service import generate_response

from database.database import (
    create_conversation,
    get_all_conversations,
    delete_conversation,
    save_message,
    get_messages,
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

    # Get Gemini response
    ai_response = generate_response(user_message)

    # Save AI response
    save_message(conversation_id, "assistant", ai_response)

    return jsonify({
        "response": ai_response
    })