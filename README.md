# NeuraAI

## AI-Powered Conversational Assistant

NeuraAI is a full-stack AI chatbot application that enables users to have intelligent conversations with an AI assistant through a modern and responsive web interface.

The application integrates Google's Gemini AI model to generate meaningful responses while maintaining conversation history using a backend-powered database system.

Built with **React, Flask, SQLite, and Gemini AI API**, NeuraAI demonstrates full-stack development, REST API integration, database management, and AI-powered application development.

---

# Features

## 🤖 AI Chat Assistant

* Real-time conversations with an AI assistant
* Integrated with Gemini AI API for intelligent responses
* Maintains conversation context
* Handles user queries dynamically

## 💬 Conversation Management

* Create new conversations
* View previous conversations
* Store chat history permanently
* Delete unwanted conversations
* Automatically generate conversation titles

## 🗄️ Database Management

* SQLite database integration
* Stores conversations and messages
* Maintains chat records with timestamps

## 🎨 User Interface

* Modern dark-themed interface
* Responsive chat layout
* Sidebar for conversation history
* Message timestamps
* Loading indicators for better user experience

---

# Tech Stack

## Frontend

| Technology | Purpose                             |
| ---------- | ----------------------------------- |
| React.js   | Building interactive user interface |
| Vite       | Frontend development environment    |
| JavaScript | Application logic                   |
| CSS        | Styling and responsive design       |

## Backend

| Technology | Purpose                                    |
| ---------- | ------------------------------------------ |
| Python     | Backend programming language               |
| Flask      | REST API development                       |
| REST APIs  | Communication between frontend and backend |

## Database

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| SQLite     | Storing conversations and messages |

## Artificial Intelligence

| Technology        | Purpose                |
| ----------------- | ---------------------- |
| Google Gemini API | AI response generation |

---

# System Architecture

```
                 User
                  |
                  |
                  ↓
          React Frontend
                  |
                  |
          REST API Requests
                  |
                  ↓
          Flask Backend
                  |
        -----------------
        |               |
        ↓               ↓
  Gemini AI API     SQLite Database
        |               |
        ↓               ↓
     AI Response   Chat History
                  |
                  ↓
          Displayed to User
```

---

# Project Structure

```
NeuraAI/

│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── services/
│   │   └── components/
│   │
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   │
│   ├── routes/
│   │   └── chat_routes.py
│   │
│   ├── services/
│   │   └── gemini_service.py
│   │
│   └── database/
│       └── database.py
│       └── chatbot.db
└── README.md
```

---

# Installation and Setup

## Prerequisites

Make sure you have installed:

* Python 3.x
* Node.js and npm
* Git

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate virtual environment:

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Start Flask server:

```bash
python app.py
```

Backend will run at:

```
http://127.0.0.1:5000
```

---

# Frontend Setup

Open a new terminal.

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# API Endpoints

| Method |      Endpoint       |            Description             |
|--------|---------------------|------------------------------------|
| GET    | `/`                 | Check backend status               |
| GET    | `/conversations`    | Retrieve all conversations         |
| POST   | `/conversations`    | Create a new conversation          |
| POST   | `/chat`             | Send message and get AI response   |
| GET    | `/messages/<id>`    | Retrieve messages of a conversation|
| DELETE |`/conversations/<id>`| Delete a conversation              |

---

# Application Workflow

1. User enters a message in the React interface.
2. Frontend sends the request through a REST API.
3. Flask backend receives and processes the request.
4. Backend communicates with Gemini AI API.
5. AI response is returned to the frontend.
6. Conversation data is stored in SQLite.
7. User receives the generated response.

---
# Screenshots

## Chat Interface

![NeuraAI Chat Interface](screenshots\1.png,screenshots\2.png)

## Conversation Management

![NeuraAI Conversations](screenshots\3.png,screenshots\4.png,screenshots\5.png)

# Key Learning Outcomes

Through developing NeuraAI, the project demonstrates:

* Full-stack web application development
* Frontend and backend integration
* REST API design and communication
* Database operations using SQLite
* AI API integration
* Clean project organization

---

# Future Enhancements

* User authentication and profiles
* Rename chat functionality
* Streaming AI responses
* Search previous conversations
* Voice-based interaction
* Cloud deployment
* Enhanced AI personalization

---

# Author

**Thanishka Bandaru**

B.Tech Computer Science Engineering (AIML)

---

# License

This project is developed for learning and demonstration purposes.



