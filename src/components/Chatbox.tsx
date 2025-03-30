import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addDoc, collection } from "firebase/firestore";

export default function Chatbox() {
  const [newMessage, setNewMessage] = useState("");

  

  async function handleSubmit(event) {
    event.preventDefault(); // Prevents page refresh
    console.log(newMessage);
    // await addDoc(collection(db, "messages"), {
    //   text: newMessage,
    //   timestamp: new Date(),
    //   user: user.displayName,
    // });
    setNewMessage("");
  }

  return (
    <div className="flex flex-col bg-card border rounded-lg flex-grow-2">
      <div className="px-5 py-2 h-15 content-center">Chat for //User//</div>
      
      <hr></hr>
      <div className="flex-grow"></div>
      <form onSubmit={handleSubmit} className="flex m-5 space-x-2">
        <Input
          type="text"
          placeholder="Enter message..."
          className="flex-grow-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />{" "}
        <Button type="submit"> Send </Button>
      </form>
    </div>
  );
}
