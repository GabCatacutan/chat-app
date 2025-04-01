import { useEffect, useState } from "react";
import { NewConversationModal } from "./NewConversationModal";
import { Input } from "./ui/input";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Conversation from "./Conversation";
import { useParams } from "react-router";
import { useAuth } from "./context/AuthProvider";

// Define the user type
interface Conversation {
  members: string[];
}

export default function ConversationsList() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const conversationCollection = collection(db, "conversations");
        const q = query(conversationCollection, where("members", "array-contains", user?.uid));
        const conversationSnapshot = await getDocs(q);
        const conversationList: Conversation[] = conversationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Conversation), // Type assertion
        }));
        setConversations(conversationList);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.uid]);

  return (
    <div className="bg-card flex flex-col border rounded-lg flex-grow-1">
      <div className="flex px-5 py-2 h-15">
        <p className="content-center">Chats</p>
        <div className="ml-auto content-center">
          {" "}
          <NewConversationModal />
        </div>
      </div>
      <hr />
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-4">Loading conversations...</div>
      ) : (
        <div className="overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => <Conversation key={conv.id} {...conv} />)
          ) : (
            <p className="text-center py-4 text-gray-500">No conversations yet</p>
          )}
        </div>
      )}
    </div>
  );
}
