import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the user type
interface User {
  id: string;
  username: string;
}

export function NewConversationModal() {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(""); // Store selected user ID
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList: User[] = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username || "Unknown User",
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle submit button click
  const handleSave = () => {
    if (selectedUserId) {
      console.log("Selected User ID:", selectedUserId);
    } else {
      console.log("No user selected.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Enter Username to add to your conversations
          </DialogDescription>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedUserId
                ? users.find((user) => user.id === selectedUserId)?.username || "Unknown User"
                : "Select User to chat with"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search user..." className="h-9" />
              <CommandList>
                {loading ? (
                  <CommandEmpty>Loading users...</CommandEmpty>
                ) : users.length === 0 ? (
                  <CommandEmpty>No user found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={(currentValue: string) => {
                          setSelectedUserId(currentValue === selectedUserId ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {user.username}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedUserId === user.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
