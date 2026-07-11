import { useEffect, useState, useRef } from "react";
import { FiSidebar, FiMenu } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { FiMoreVertical } from "react-icons/fi";
import api from "./services/api";
import { FiCpu } from "react-icons/fi";

function App() {

  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);


  useEffect(() => {
    loadConversations();
  }, []);
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages, loading]);


  async function loadConversations() {
  try {
    const res = await api.get("/conversations");
    setConversations(res.data);

    // Automatically select the latest conversation
    if (res.data.length > 0 && selectedChat === null) {
      const latestChat = res.data[0];
      setSelectedChat(latestChat.id);
      loadMessages(latestChat.id);
    }

  } catch (error) {
    console.error(error);
  }
}


  async function createNewChat() {

    try {

      const res = await api.post("/conversations", {
        title: "New Chat"
      });

      await loadConversations();

      setSelectedChat(res.data.conversation_id);
      setMessages([]);

    } catch(error) {
      console.error(error);
    }

  }


  async function loadMessages(id) {

    try {

      const res = await api.get(`/messages/${id}`);

      setMessages(res.data);
      setSelectedChat(id);

    } catch(error) {
      console.error(error);
    }

  }


  async function deleteChat(id) {

    try {

      await api.delete(`/conversations/${id}`);

      await loadConversations();

      if(selectedChat === id) {
        setSelectedChat(null);
        setMessages([]);
      }

    } catch(error) {

      console.error(error);

    }

  }


  async function sendMessage() {

  const text = message.trim();

  if (!text) return;

  let chatId = selectedChat;

  try {

    // Create a chat automatically if none exists
    if (!chatId) {

  const chatRes = await api.post("/conversations", {
    title: text.slice(0, 30)
  });

      chatId = chatRes.data.conversation_id;

      setSelectedChat(chatId);

      await loadConversations();
    }

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        message: text
      }
    ]);

    setMessage("");

    setLoading(true);

    const res = await api.post("/chat", {
      conversation_id: chatId,
      message: text
    });

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        message: res.data.response
      }
    ]);

    await loadConversations();

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

  


      


  return (

    <div className="flex h-screen overflow-hidden bg-slate-900 text-white">


      {/* Sidebar */}

      <aside
  className={`h-screen bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
    sidebarOpen ? "w-72" : "w-16"
  }`}
>
  <div className="flex items-center justify-between p-4">
  {sidebarOpen && (
    <div className="flex items-center gap-2">
  <FiCpu className="text-sky-400" size={22} />
  <h2 className="text-xl font-bold tracking-wide">
    
  </h2>
</div>
  )}

  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="p-2 rounded-lg hover:bg-slate-700 transition"
  >
    {sidebarOpen ? <FiSidebar size={20} /> : <FiMenu size={20} />}
  </button>
</div>


        <div className="p-4">

<button
  onClick={createNewChat}
  className="bg-sky-800 hover:bg-sky-700 transition-colors duration-200 w-full rounded-lg py-3 font-semibold"
>
  + New Chat
</button>

{sidebarOpen && (
  <h2 className="mt-5 mb-3 font-semibold text-lg">
    Conversations
  </h2>
)}

</div>


<div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 sidebar-scroll">
  {conversations.length === 0 && (
  <p className="text-gray-400 text-sm text-center mt-5">
    No conversations yet.
  </p>
)}

          {
            conversations.map(chat => (

              <div
  key={chat.id}
  className={`p-3 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-colors duration-200 ${
    selectedChat === chat.id
      ? "bg-sky-800 hover:bg-sky-700"
      : "bg-slate-700 hover:bg-slate-600"
  }`}
>

                <div
  onClick={() => loadMessages(chat.id)}
  className="flex items-center flex-1 min-w-0"
>
  <FiMessageSquare className="text-slate-300 text-lg" />

  {sidebarOpen && (
    <span
  className="ml-3 flex-1 truncate text-sm font-medium"
  title={chat.title}
>
  {chat.title}
</span>
  )}
</div>


                {sidebarOpen && (
  <div className="relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setMenuOpen(menuOpen === chat.id ? null : chat.id);
      }}
      className="p-1 rounded-md hover:bg-slate-600 transition"
    >
      <FiMoreVertical className="text-slate-300" size={18} />
    </button>

    {menuOpen === chat.id && (
      <div className="absolute right-0 top-8 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">

        <button
  onClick={() => {
    setMenuOpen(null);
    // Rename logic later
  }}
  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition"
>
  ✏️ Rename
</button>

        <button
  onClick={() => {
    setMenuOpen(null);
    // Pin logic later
  }}
  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition"
>
  📌 Pin
</button>

        <button
  onClick={() => {
    setMenuOpen(null);
    // Archive logic later
  }}
  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition"
>
  📦 Archive
</button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteChat(chat.id);
            setMenuOpen(null);
          }}
          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-700 transition"
        >
          🗑 Delete
        </button>

      </div>
    )}
  </div>
)}


              </div>

            ))
          }

        </div>


      </aside>



      {/* Chat Area */}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">


        <header className="p-5 border-b border-slate-700">
  <div className="flex items-center gap-3">
    <FiCpu className="text-sky-400" size={24} />
    <h1 className="text-2xl font-bold">
      NeuraAI
    </h1>
  </div>
</header>



       <section className="flex-1 overflow-y-auto p-6 min-h-0">

  {messages.length === 0 && !loading ? (

<div className="flex flex-col h-full items-center justify-center gap-8">

  <h1 className="text-4xl font-semibold text-white">
    What can I help with?
  </h1>


  <div className="w-full max-w-3xl">

    <div className="bg-slate-800 rounded-2xl px-6 py-5 text-gray-400 text-lg border border-slate-700">
      Ask anything...
    </div>


    <div className="flex gap-3 mt-6 flex-wrap">


      <button
        onClick={() => setMessage("Create an idea")}
        className="px-5 py-3 rounded-full border border-slate-600 hover:bg-slate-700"
      >
        ✨ Create
      </button>


      <button
        onClick={() => setMessage("Help me brainstorm ideas")}
        className="px-5 py-3 rounded-full border border-slate-600 hover:bg-slate-700"
      >
        💡 Brainstorm
      </button>


      <button
        onClick={() => setMessage("Help me with coding")}
        className="px-5 py-3 rounded-full border border-slate-600 hover:bg-slate-700"
      >
        💻 Code
      </button>


      <button
        onClick={() => setMessage("Help me write")}
        className="px-5 py-3 rounded-full border border-slate-600 hover:bg-slate-700"
      >
        ✍️ Write
      </button>


    </div>

  </div>

</div>

) : (
  <div className="space-y-4">

    {messages.map((msg, index) => (
  <div
    key={index}
    className={
      msg.role === "user"
        ? "flex justify-end"
        : "flex justify-start"
    }
  >
    <div
      className={
        msg.role === "user"
          ? "bg-sky-900 rounded-xl px-4 py-3 max-w-[75%] break-words whitespace-pre-wrap"
          : "bg-slate-700 rounded-xl px-4 py-3 max-w-[75%] break-words whitespace-pre-wrap"
      }
    >
      <p>{msg.message}</p>

      {msg.created_at && (
        <div className="mt-2 flex justify-end">
          <span className="text-[10px] text-slate-500">
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  </div>
))}

    {loading && (
      <div className="flex justify-start">
  <div className="bg-slate-700 rounded-xl px-4 py-3 flex items-center gap-2">
    <span className="text-sky-400 font-medium">
      NeuraAI
    </span>

    <span className="animate-pulse">●</span>
    <span className="animate-pulse delay-150">●</span>
    <span className="animate-pulse delay-300">●</span>
  </div>
</div>
    )}

    <div ref={messagesEndRef}></div>

  </div>
)}
</section>



        <footer className="p-4 border-t border-slate-700 bg-slate-900">


          <div className="flex gap-3">


            <input
  value={message}
  disabled={loading}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  placeholder={
  selectedChat
    ? "Type your message..."
    : "Start a new conversation..."
}
  className="flex-1 bg-slate-800 rounded-lg px-4 py-3 outline-none disabled:opacity-50"
/>

  


            <button
  onClick={sendMessage}
  disabled={loading}
  className={`px-6 rounded-lg ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-sky-800 hover:bg-sky-700 transition-colors"
  }`}
>
  {loading ? "Sending..." : "Send"}
</button>


          </div>


        </footer>


      </main>


    </div>

  );

}

export default App;


