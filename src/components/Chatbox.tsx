import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { db } from "@/config/firebase";
import { collection, addDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { useAuth } from "./context/AuthProvider";

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

export default function Chatbox() {
  const {user} = useAuth()
  console.log(user)
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleTimestamp, setVisibleTimestamp] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            user: data.user,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toLocaleString() : "",
          };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  function handleTimestampClick(id: string) {
    setVisibleTimestamp(visibleTimestamp === id ? null : id);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: user.uid,
      timestamp: Timestamp.now(),
    });

    setNewMessage("");
  }

  return (
    <div className="flex flex-col bg-card border rounded-lg flex-grow p-4">
      <div className="px-5 py-2 h-15 content-center">Chat for //User//</div>
      <hr />
      <div className="flex-grow overflow-y-auto p-3 h-60 border rounded-lg space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user === user.uid ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-xs p-3 rounded-xl cursor-pointer ${msg.user === user.uid ? "bg-primary" : "bg-secondary"}`} 
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
          className="flex-grow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit"> Send </Button>
      </form>
    </div>
  );
}
