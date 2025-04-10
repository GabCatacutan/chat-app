import { Link, useParams } from "react-router";
import { useAuth } from "./context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import dayjs from "dayjs";

interface ConversationProps {
  id: string;
  members: string[];
}

export default function Conversation({ id, members }: ConversationProps) {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const img_url = "src/assets/sampleprofpic.jpg";

  const recepientFilter = members.filter(
    (member: string) => member != user?.uid
  );
  const recepientId = recepientFilter[0];

  //Get recepient details
  const { data: recepient, isLoading } = useQuery({
    queryKey: ["recepientName", recepientId],
    queryFn: async () => {
      const docRef = doc(db, "users", recepientId);
      const docSnap = await getDoc(docRef);

      // Check if the document exists before accessing its data
      const docData = docSnap.data();
      if (!docData) {
        throw new Error("Document not found or data is undefined.");
      }

      return docData.username;
    },
    enabled: !!user?.uid, // Ensure query runs only if user is logged in
  });

  //Get latest message
  const { data: latestMessage, isLoading: isMessageLoading } = useQuery({
    queryKey: ["latest-message", id],
    queryFn: async () => {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("conversationId", "==", id),
        orderBy("timestamp")
      );

      const querySnapshot = await getDocs(q);

      // Map the querySnapshot to get the message data
      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp;

        // If timestamp is a Firestore Timestamp object, we can access `seconds`
        const timestampInSeconds =
          timestamp instanceof Timestamp ? timestamp.seconds : 0;

        return {
          id: doc.id,
          text:data.text,
          ...data,
          timestampInSeconds, // Adding the parsed timestamp in seconds
        };
      });

    // Sort messages client-side by timestamp in descending order
    const sortedMessages = messages.sort((a, b) => b.timestampInSeconds - a.timestampInSeconds);

      // Return the most recent message (the first one after sorting)
      return sortedMessages[0] || null; // If no messages, return null
    },
    enabled: !!user?.uid, // Ensure query runs only if user is logged in
  });

  if (isLoading || isMessageLoading) {
    return <></>;
  }

  const parsedDate = latestMessage
  ? dayjs.unix(latestMessage.timestampInSeconds).format("YYYY-MM-DD HH:mm:ss")
  : " "; // Fallback if latestMessage is null or undefined

  return (
    <Link to={`/${id}`} className="block">
      <div
        className={`flex items-center p-3 border-b cursor-pointer rounded-lg 
          hover:bg-secondary 
          ${conversationId === id ? "bg-primary" : "bg-transparent"}`}
      >
        {/* Profile Picture */}
        <img
          src={img_url}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />

        {/* Chat Info */}
        <div className="flex-1">
          <h3 className="font-semibold">{recepient}</h3>
          <p className="text-sm text-gray-500 truncate">
            {latestMessage?.text || "No messages yet..."}
          </p>
        </div>

        {/* Timestamp of last message */}
        <span className="text-xs text-secondary-foreground">{parsedDate}</span>
      </div>
    </Link>
  );
}
