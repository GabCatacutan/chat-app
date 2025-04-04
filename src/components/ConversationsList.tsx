import { useEffect, useState } from "react";
import { NewConversationModal } from "./NewConversationModal";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Conversation from "./Conversation";
import { useAuth } from "./context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

// Define the Conversation type
interface Conversation {
  id: string;
  members: string[];
}

export default function ConversationsList() {
  const { user } = useAuth();

  // Fetch conversations using React Query
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const conversationCollection = collection(db, "conversations");
      const q = query(
        conversationCollection,
        where("members", "array-contains", user.uid)
      );
      const conversationSnapshot = await getDocs(q);
      return conversationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Conversation),
      }));
    },
    enabled: !!user?.uid, // Ensure query runs only if user is logged in
  });

  //Filter members to only include unique users
  const uniqueMembers = [...new Set(conversations.flatMap(obj => obj.members))]

  return (
    <div className="bg-card flex flex-col border rounded-lg flex-grow-1">
      <div className="flex px-5 py-2 h-15">
        <p className="content-center">Chats</p>
        <div className="ml-auto content-center">
          <NewConversationModal {...uniqueMembers} />
        </div>
      </div>
      <hr />
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          Loading conversations...
        </div>
      ) : (
        <div className="overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <Conversation key={conv.id} {...conv} />
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              No conversations yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
