import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addDoc, collection } from "firebase/firestore";

export default function Chatbox() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", user: "Bot", timestamp: new Date().toLocaleString() },
    { id: 2, text: "Can you tell me about Firebase?", user: "User", timestamp: new Date().toLocaleString() },
    { id: 3, text: "Sure! Firebase is a platform by Google...", user: "Bot", timestamp: new Date().toLocaleString() },
  ]);
  const [visibleTimestamp, setVisibleTimestamp] = useState(null);

  function handleTimestampClick(id) {
    setVisibleTimestamp(visibleTimestamp === id ? null : id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg = { id: messages.length + 1, text: newMessage, user: "User", timestamp: new Date().toLocaleString() };
    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulating Firebase Firestore
    // await addDoc(collection(db, "messages"), {
    //   text: newMessage,
    //   timestamp: new Date(),
    //   user: user.displayName,
    // });
  }

  return (
    <div className="flex flex-col bg-card border rounded-lg flex-grow-2 p-4">
      <div className="px-5 py-2 h-15 content-center">Chat for //User//</div>
      <hr />
      <div className="flex-grow overflow-y-auto p-3 h-60 border rounded-lg space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user === "User" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-xs p-3 rounded-xl cursor-pointer ${msg.user === "User" ? "bg-primary" : "bg-secondary"}`} 
              onClick={() => handleTimestampClick(msg.id)}
            >
              <strong>{msg.user}: </strong>{msg.text}
              {visibleTimestamp === msg.id && (
                <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex m-5 space-x-2">
        <Input
          type="text"
          placeholder="Enter message..."
          className="flex-grow-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit"> Send </Button>
      </form>
    </div>
  );
}