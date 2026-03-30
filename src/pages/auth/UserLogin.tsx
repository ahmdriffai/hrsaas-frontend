import { userLogin } from "@/lib/api/user.api";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole, User2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../components/ui/input-group";
import { Label } from "../../components/ui/label";
import Logo from "../../components/ui/logo";
import { Spinner } from "../../components/ui/spinner";

export default function UserLogin(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage("token", "");
  const mutation = useMutation({
    mutationFn: userLogin,
    onSuccess: async (response) => {
      const responseBody = await response.json();

      if (response.status === 200) {
        const user = responseBody?.data?.user;
        if (!user?.role || user.role.toUpperCase() !== "ADMIN") {
          toast.error("Unauthorized: admin access only");
          return;
        }

        toast.success("User login successfully");
        const token = responseBody.data.token;
        setToken(token);

        await navigate({
          pathname: "/dashboard",
        });
      } else {
        await toast.error(responseBody.error);
      }
    },
    onError: async (error) => {
      toast.error(error?.message || "Login failed");
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await mutation.mutate({ email, password });
  }

  return (
    <div className="bg-card p-8 border shadow-2xl w-full max-w-md rounded-3xl">
      <div className="text-center mb-8">
        <Logo />
        <p className="text-gray-500 mt-4">Login user </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm gap-6">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder="Enter your name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Password</Label>
            <InputGroup>
              <InputGroupInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {mutation.isPending ? (
            <Button disabled size="sm">
              <Spinner />
              Loading...
            </Button>
          ) : (
            <Button type="submit">Sign In</Button>
          )}

          <div className="text-center text-sm text-gray-400">
            Dont already have an account?
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
