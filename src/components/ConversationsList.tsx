import Conversation from "./Conversation";
import { NewConversationModal } from "./NewConversationModal";
import { Input } from "./ui/input";



const sampleConversations = [
  {
    username: "User 1",
    img_url: "src/assets/yoru.webp",
    date_created: "Date",
  },
  {
    username: "User 2",
    img_url: "src/assets/yoru.webp",
    date_created: "Date",
  },
  {
    username: "User 3",
    img_url: "src/assets/yoru.webp",
    date_created: "Date",
  },
  
];

export default function ConversationsList() {
  //Retrieve messages here
  return (
    <div className="bg-card flex flex-col border rounded-lg  flex-grow-1">
      <div className="flex px-5 py-2 h-15">
        <p className="content-center">Chats</p>
        <div className="ml-auto content-center">
          {" "}
          <NewConversationModal></NewConversationModal>
        </div>
      </div>
      <hr></hr>
      {/* For each conversation retrieved, render 1 <Component /> */}
      <div className="overflow-y-auto">
        {sampleConversations.length > 0 ? (
          sampleConversations.map((conv) => <Conversation {...conv} />)
        ) : (
          <p className="text-center py-4 text-gray-500">No conversations yet</p>
        )}
      </div>
    </div>
  );
}
