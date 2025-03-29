import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { ReactNode, useContext, useState, createContext } from "react";
import { auth } from "@/config/firebase";

interface AuthContextType {
  user: User | null;
  userDetails: Object | null;
  handleSignUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<Object | null>(null);

  const handleSignUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<void> => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
        console.log(user)
        alert("Sign up success")
      })
      .catch((error) => {
        
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        handleSignUp,
        loading,
      }}
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
