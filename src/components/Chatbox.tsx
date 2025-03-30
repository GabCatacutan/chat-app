import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chatbox() {
  return (
    <div className="flex flex-col bg-card border rounded-lg flex-grow-2">
      <div className="flex-grow">

      </div>
      <div className="flex m-5 space-x-2">
        <Input
          type="text"
          placeholder="Enter message..."
          className="flex-grow-2"
        />{" "}
        <Button className=""> Send </Button>
      </div>
    </div>
  );
}
