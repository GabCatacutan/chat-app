import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Logged in successfully!"); // Replace with actual login logic
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="flex space-x-2 bg-secondary 0 p-2 rounded-lg mb-2 justify-center w-full">
          <TabsTrigger
            value="login"
            className="px-4 py-2 rounded-lg data-[state=active]:bg-primary transition w-1/2"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="px-4 py-2 rounded-lg data-[state=active]:bg-primary transition w-1/2"
          >
            Sign-Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
