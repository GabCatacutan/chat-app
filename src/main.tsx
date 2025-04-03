import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import { ThemeProvider } from "./components/context/ThemeProvider.tsx";
import Navbar from "./components/Navbar.tsx";
import { AuthProvider } from "./components/context/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/:conversationId",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/profile/:profileId",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Navbar></Navbar>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
