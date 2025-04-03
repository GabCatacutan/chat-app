import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./context/ThemeProvider";
import { auth } from "@/config/firebase";
import { useAuth } from "./context/AuthProvider";

export default function Menu() {
  const { setTheme } = useTheme();
  const { handleSignOut, user } = useAuth();

  const unauthMenu = (
    <>
      {" "}
      <DropdownMenuItem onClick={() => (window.location.href = "/login")}>
        Login/Sign-Up
      </DropdownMenuItem>
    </>
  );

  const authMenu = (
    <>
      <DropdownMenuItem
        onClick={() => (window.location.href = `/profile/${user.uid}`)}
      >
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{user ? authMenu : unauthMenu}</DropdownMenuContent>
    </DropdownMenu>
  );
}
