import { auth } from "srcconfigconfig.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import Menu from "./Menu";
import { useAuth } from "./context/AuthProvider";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center border border-black p-5">
      <a className="text-lg font-semibold" href="/">
        ChatLite
      </a>
      {user && <p className="ml-2">Welcome Back! {user.email}</p>}
      <div className="ml-auto space-x-2 flex items-center">
        <ModeToggle />
        <Menu />
      </div>
    </nav>
  );
}

export default Navbar;
