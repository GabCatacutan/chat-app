import "./App.css";
import Chatbox from "./components/Chatbox";
import ConversationsList from "./components/ConversationsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  return (
    <div className="flex h-screen p-5 space-x-10">
        <ConversationsList />
      <Chatbox />
    </div>
  );
}

export default App;
