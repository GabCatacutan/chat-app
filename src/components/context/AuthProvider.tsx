import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, useContext, useState, createContext, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userDetails: Object | null;
  handleSignUp: (email: string, password: string, username: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const userRef = collection(db, "users")

  // ✅ Automatically persist user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, username: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the auto-generated firebase uid
  
      // Store user data in Firestore with the UID as the document ID
      await setDoc(doc(userRef, userId), {
        username,
        email,
        createdAt: new Date(),
      });
  
      setUser(userCredential.user);
      alert("Sign up success");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      window.location.href = "/"; // Redirect after sign-in
    } catch (error) {
      console.error(error.message);
      alert("Login failed");
    } finally {
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = "/login"; // Redirect to home page after logout
    } catch (error) {
      console.error(error.message);
    } finally {
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userDetails: null, handleSignUp, handleSignIn, handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
