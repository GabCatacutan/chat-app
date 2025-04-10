import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import sampleProfPic from "@/assets/sampleprofpic.jpg";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { userId } = useParams();
  const [image] = useState(sampleProfPic);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      return userSnapshot.exists() ? userSnapshot.data() : null;
    },
    enabled: !!userId,
  });

  if (isLoading)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const handleButtonClick = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <img
              src={image}
              alt="User Avatar"
              className="rounded-full w-24 h-24 object-cover border"
            />
          </div>
          {isEditing ? (
            <div className="space-y-2 mt-4">
              <Input
                type="text"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="mt-4 text-center">
              <p>Email: {user?.email || "N/A"}</p>
              <p>Name: {user?.username || "N/A"}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleButtonClick}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
