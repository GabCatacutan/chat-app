import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && loading === false) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user, loading]);

  if(loading){
    return (<></>)
  }

  return children;
}
