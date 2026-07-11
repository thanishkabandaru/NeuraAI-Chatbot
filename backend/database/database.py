import sqlite3
from pathlib import Path

# Database file path
DB_PATH = Path(__file__).parent / "chatbot.db"


def get_connection():
    """Create and return a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database():
    """Create tables if they do not already exist."""
    conn = get_connection()
    cursor = conn.cursor()

    # Conversations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id)
        )
    """)

    conn.commit()
    conn.close()

def create_conversation(title="New Chat"):
    """Create a new conversation and return its ID."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO conversations (title) VALUES (?)",
        (title,)
    )

    conn.commit()
    conversation_id = cursor.lastrowid
    conn.close()

    return conversation_id


def get_all_conversations():
    """Return all conversations ordered by newest first."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM conversations
        ORDER BY created_at DESC
    """)

    conversations = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return conversations

def delete_conversation(conversation_id):
    """Delete a conversation and all its messages."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM messages WHERE conversation_id = ?",
        (conversation_id,)
    )

    cursor.execute(
        "DELETE FROM conversations WHERE id = ?",
        (conversation_id,)
    )

    conn.commit()
    conn.close()
def save_message(conversation_id, role, message):
    """Save a message to the database."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO messages (conversation_id, role, message)
        VALUES (?, ?, ?)
        """,
        (conversation_id, role, message)
    )

    conn.commit()
    conn.close()
def get_messages(conversation_id):
    """Return all messages for a conversation."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
    role,
    message,
    datetime(created_at, '+5 hours', '+30 minutes') AS created_at
FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        """,
        (conversation_id,)
    )

    messages = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return messages


def update_conversation_title(conversation_id, title):
    """Update a conversation title."""

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE conversations
        SET title = ?
        WHERE id = ?
        """,
        (title, conversation_id)
    )

    conn.commit()
    conn.close()


    