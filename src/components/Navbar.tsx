import { auth } from "srcconfigconfig.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import Menu from "./Menu";

function Navbar() {
  return (
    <nav className="border border-black flex p-5">
      <h1 className="">ChatLite</h1>
      <div className="mr-0 ml-auto space-x-2">
        <ModeToggle></ModeToggle>
        <Menu></Menu>
      </div>
    </nav>
  );
}

export default Navbar;
