import { userRegister } from "@/lib/api/user.api";
import { BriefcaseBusiness, LockKeyhole, MailIcon, User2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import Logo from "../ui/logo";

export default function UserRegister(): React.ReactNode {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password != confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    const response = await userRegister({
      name: name,
      email: email,
      company_name: companyName,
      password: password,
    });
    const responseBody = await response.json();
    console.log(responseBody);
    if (response.status === 200) {
      await toast.success("User create successfully");
      await navigate({
        pathname: "/login",
      });
    } else {
      await toast.error(responseBody.error);
    }
  }

  return (
    <div className="bg-card p-8 w-full max-w-md rounded-3xl  backdrop-blur-sm">
      <div className="text-center mb-8">
        <Logo />
        <p className="text-gray-500 mt-4">Create a new account</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm gap-6">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Name</Label>
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Company Name</Label>
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <InputGroupAddon>
                <BriefcaseBusiness />
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

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Confirm Password</Label>
            <InputGroup>
              <InputGroupInput
                type="password"
                placeholder="Enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button type="submit">Sign Up</Button>
          <div className="text-center text-sm text-gray-400">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
