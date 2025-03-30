import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { ReactNode, useContext, useState, createContext, useEffect } from "react";
import { auth } from "@/config/firebase";

interface AuthContextType {
  user: User | null;
  userDetails: Object | null;
  handleSignUp: (email: string, password: string, username: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(user)

  // ✅ Automatically persist user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, username: string): Promise<void> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert("Sign up success");
      window.location.href = "/"; // Redirect after sign-up
    } catch (error) {
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
      window.location.href = "/"; // Redirect after sign-in
    } catch (error) {
      console.error(error.message);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("signing out...")
      await signOut(auth);
      setUser(null);
      window.location.href = "/"; // Redirect to home page after logout
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userDetails: null, handleSignUp, handleSignIn, loading, handleSignOut }}
    >
      {!loading && children}
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
