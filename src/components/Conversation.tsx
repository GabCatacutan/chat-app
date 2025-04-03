import { Link, useParams } from "react-router";
import { useAuth } from "./context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import dayjs from 'dayjs'

export default function Conversation({ id, members }) {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const img_url = "src/assets/sampleprofpic.jpg";

  const recepientFilter = members.filter(
    (member: string) => member != user.uid
  );
  const recepientId = recepientFilter[0];

  //Get recepient details
  const { data: recepient, isLoading } = useQuery({
    queryKey: ["recepientName", recepientId],
    queryFn: async () => {
      const docRef = doc(db, "users", recepientId);
      const docSnap = await getDoc(docRef);
      return docSnap.data().username;
    },
    enabled: !!user?.uid, // Ensure query runs only if user is logged in
  });

  //Get latest message
  const { data: latestMessage, isMessageLoading } = useQuery({
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
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Spread the document data into the object
      }));
  
      // Sort messages client-side by timestamp in descending order
      const sortedMessages = messages.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  
      // Return the most recent message (the first one after sorting)
      return sortedMessages[0] || null;  // If no messages, return null
    },
    enabled: !!user?.uid, // Ensure query runs only if user is logged in
  });

  if(isLoading || isMessageLoading){
    return(<></>)
  }


  const parsedDate = latestMessage ? dayjs(latestMessage?.timestamp.toDate()).format('YYYY-MM-DD HH:mm:ss') : " "

  console.log(parsedDate)

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
          <p className="text-sm text-gray-500 truncate">{latestMessage?.text || "No messages yet..."}</p>
        </div>

        {/* Timestamp of last message */}
        <span className="text-xs text-secondary-foreground">{parsedDate}</span>
      </div>
    </Link>
  );
}
