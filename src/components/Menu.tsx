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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => (window.location.href = "/login")}>
          Login
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSignOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
