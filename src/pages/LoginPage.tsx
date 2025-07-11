import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";

export default function LoginPage() {

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
