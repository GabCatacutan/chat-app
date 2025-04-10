import "./App.css";
import Chatbox from "./components/Chatbox";
import ConversationsList from "./components/ConversationsList";

function App() {
  return (
    <div className="flex h-screen p-5 space-x-10">
        <ConversationsList />
      <Chatbox />
    </div>
  );
}

export default App;
