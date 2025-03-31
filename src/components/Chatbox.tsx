import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { useAuth } from "./context/AuthProvider";
import { useParams } from "react-router";

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  senderId: string;
  conversationId: string;
}

const fetchUsername = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().username : "Unknown User";
  } catch (error) {
    console.error("Error fetching username:", error);
    return "Unknown User";
  }
};

export default function Chatbox() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleTimestamp, setVisibleTimestamp] = useState<string | null>(null);
  const [chatPartner, setChatPartner] = useState()

  //Use effect for fetching 
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesWithUsernames = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const username = await fetchUsername(data.user);
          return {
            id: doc.id,
            text: data.text,
            senderId: data.user,
            username: username,
            conversationId: data.conversationId,
            timestamp: data.timestamp?.toDate().toLocaleString() || "",
          };
        })
      );

      setMessages(messagesWithUsernames);
    });

    return () => unsubscribe();
  }, [conversationId]);


  //Use effect for fetching chat partner
  useEffect(() => {
    if (!conversationId || !user) return;
  
    const fetchChatPartner = async () => {
      try {
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationSnap = await getDoc(conversationRef);
  
        if (conversationSnap.exists()) {
          const members: string[] = conversationSnap.data().members;
  
          // Find the other participant (excluding current user)
          const otherUserId = members.find((id) => id !== user.uid);
  
          if (otherUserId) {
            const username = await fetchUsername(otherUserId);
            setChatPartner(username);
          }
        }
      } catch (error) {
        console.error("Error fetching chat partner:", error);
      }
    };
  
    fetchChatPartner();
  }, [conversationId, user]);

  function handleTimestampClick(id: string) {
    setVisibleTimestamp(visibleTimestamp === id ? null : id);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: user.uid,
      conversationId: conversationId,
      timestamp: Timestamp.now(),
    });

    setNewMessage("");
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col bg-card border rounded-lg flex-grow p-4 items-center justify-center">
        <p className="text-gray-500">No conversation selected. Please choose a chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card border rounded-lg flex-grow p-4">
      <div className="px-5 py-2 h-15 content-center">Now chatting with {chatPartner} </div>
      <hr />
      <div className="flex-grow overflow-y-auto p-3 h-60 border rounded-lg space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === user.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-xl cursor-pointer ${
                msg.senderId === user.uid ? "bg-primary" : "bg-secondary"
              }`}
              onClick={() => handleTimestampClick(msg.id)}
            >
              <strong>{msg.username}: </strong>
              {msg.text}
              {visibleTimestamp === msg.id && (
                <div className="text-xs text-gray-500 mt-1">
                  {msg.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex m-5 space-x-2">
        <Input
          id="newMessage"
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
