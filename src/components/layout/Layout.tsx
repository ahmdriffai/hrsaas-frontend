import type React from "react";
import { Outlet, useNavigate } from "react-router";
import { useEffectOnce, useLocalStorage } from "react-use";
import { Toaster } from "sonner";

export default function Layout(): React.ReactNode {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();

  useEffectOnce(() => {
    if (token) {
      navigate({
        pathname: "/dashboard",
      });
    }
  });

  return (
    <div className="bg-background shadow font-poppins  flex items-center justify-center min-h-screen p-4">
      <Toaster richColors position="top-center" />
      <Outlet />
    </div>
  );
}
