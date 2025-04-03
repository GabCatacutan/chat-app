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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import React, { useState } from "react";
import { db } from "@/config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "./context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the user type
interface User {
  id: string;
  username: string;
}

export function NewConversationModal() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(""); // Store selected user ID
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch users using React Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!user?.uid) return [];
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      return userSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          username: doc.data().username || "Unknown User",
        }))
        .filter((u) => u.id !== user.uid);
    },
    enabled: !!user?.uid, // Prevents query execution if no user is logged in
  });

  // Mutation to add a new conversation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId || !user?.uid) return;
      return addDoc(collection(db, "conversations"), {
        members: [selectedUserId, user.uid],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]); // Refresh conversations list
      setDialogOpen(false);
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? "Loading..." : "+"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>Select a user to start a chat</DialogDescription>
        </DialogHeader>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="w-[200px] justify-between"
            >
              {selectedUserId
                ? users.find((u) => u.id === selectedUserId)?.username || "Unknown User"
                : "Select User"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search user..." className="h-9" />
              <CommandList>
                {isLoading ? (
                  <CommandEmpty>Loading users...</CommandEmpty>
                ) : users.length === 0 ? (
                  <CommandEmpty>No user found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => {
                          setSelectedUserId((prev) => (prev === user.id ? "" : user.id));
                          setPopoverOpen(false);
                        }}
                      >
                        {user.username}
                        <Check className={cn("ml-auto", selectedUserId === user.id ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogFooter>
          <Button type="button" onClick={() => mutation.mutate()} disabled={!selectedUserId || mutation.isLoading}>
            {mutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
