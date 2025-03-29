import {auth} from "src\config\config.ts"
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

function Navbar() {
  return (
    <nav className="border border-black flex p-5">
      <h1 className="">ChatLite</h1>
      <div className="mr-0 ml-auto">
      <ModeToggle></ModeToggle>
      </div>
    </nav>
  );
}

export default Navbar;
