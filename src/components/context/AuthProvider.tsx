import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, useContext, useState, createContext, useEffect } from "react";
import { auth, db } from "@/config/firebase";
import { setDoc, doc, collection } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

interface AuthContextType {
  user: User | null;
  userDetails: Object | null;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const userRef = collection(db, "users");

  // ✅ Automatically persist user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false)
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, username: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(userRef, userId), {
        username,
        email,
        createdAt: new Date(),
      });

      setUser(userCredential.user);
      alert("Sign up success");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(`Firebase error: ${error.message}`);
        alert(`Login failed: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`General error: ${error.message}`);
        alert(`Login failed: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert("Login failed due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = "/login";
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(`Firebase error: ${error.message}`);
        alert(`Sign-out failed: ${error.message}`);
      } else if (error instanceof Error) {
        console.error(`General error: ${error.message}`);
        alert(`Sign-out failed: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert("Sign-out failed due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userDetails: null, loading, handleSignUp, handleSignIn, handleSignOut }}>
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
