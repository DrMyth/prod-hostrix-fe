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

export function LoginForm({
  className,
  error,
  setError,
  ...props
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: any) {
    setError("");
    event.preventDefault();
    // console.log("Username: ", username);
    // console.log("Password: ", password);
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`,
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        // console.log("Login successful");
        const token = response.data.tokens.AccessToken;
        // console.log("Token: ", token);
        await localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (e: any) {
      setError(
        e.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
      console.error("Login error:", e.response?.data);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Good to see you! Let’s get back to building something great.
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
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="bg-blue-50/25"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="bg-blue-50/25"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
        >
          Sign In
        </Button>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Create Account
        </a>
      </div>
    </form>
  );
}
