import { auth } from "srcconfigconfig.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import Menu from "./Menu";
import { useAuth } from "./context/AuthProvider";

function Navbar() {
  const {user} = useAuth()
  
  return (
    <nav className="border border-black flex p-5">
      <a className="" href="/">ChatLite</a>

      {user ? <p className="ml-2"> Welcome Back! {user.email}</p> : <></>}
      <div className="mr-0 ml-auto space-x-2">
        <ModeToggle></ModeToggle>
        <Menu></Menu>
      </div>
    </nav>
  );
}

export default Navbar;
