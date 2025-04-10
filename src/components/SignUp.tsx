import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";

function SignUp() {
  const { handleSignUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");


  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      await handleSignUp(email, password, username);
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false)
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center ">
          Please Enter Your Details To Sign Up
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              className="mt-1"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmpassword">Password</Label>
            <Input
              id="confirmpassword"
              type="password"
              placeholder="Re-enter your password"
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing-Up" : "Sign-Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignUp;
