from flask import Flask
from flask_cors import CORS

from routes.chat_routes import chat_bp
from database.database import initialize_database


def create_app():
    app = Flask(__name__)

    CORS(app)

    # Create database tables
    initialize_database()

    # Register routes
    app.register_blueprint(chat_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)