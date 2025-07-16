import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginFormProps extends React.ComponentProps<"form"> {
  error?: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function SignupForm({
  className,
  error,
  setError,
  ...props
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    if (!username) {
      setError("Username is required.");
      return;
    } else if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email is invalid.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
        {
          username,
          email,
          password,
        }
      );

      // console.log(response);

      if (response.status === 200) {
        // console.log("Signup successful");
        navigate("/verify", { state: { username } });
      }
    } catch (e: any) {
      setError(
        e.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
      console.error("Signup error:", e.response?.data);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Sign up now, because great ideas need <br /> great hosting!
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            required
            className="bg-blue-50/25"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="johndoe@hostrix.com"
            required
            className="bg-blue-50/25"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            className="bg-blue-50/25"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
        >
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          href="/signin"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </a>
      </div>
    </form>
  );
}
