import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";


function Login() {
  const [loading, setLoading] = useState(false);
  const {handleSignIn} = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleSignIn(email,password)
    setTimeout(() => {
      setLoading(false);
      alert("Logged in successfully!"); // Replace with actual login logic
    }, 2000);
  };

  return (
    <>
      <Card className="w-full max-w-md hadow-lg">
        <CardHeader>
          <CardTitle className="text-center ">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex justify-between text-sm">
              <a href="#" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default Login;
