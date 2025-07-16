import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginHeader = ({
  isVerify,
  setError,
}: {
  isVerify: boolean;
  setError?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();

  async function handleGuestLogin() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`,
        {
          username: import.meta.env.VITE_GUEST_USERNAME,
          password: import.meta.env.VITE_GUEST_PASSWORD,
        }
      );

      if (response.status === 200) {
        // console.log("Login successful");
        const token = response.data.tokens.AccessToken;
        // console.log("Token: ", token);
        await localStorage.setItem("token", token);
        navigate("/dashboard");
        return;
      }
    } catch (e: any) {
      if (setError) {
        setError(
          e.response?.data?.error ||
            "Something went wrong. Please try again later."
        );
        console.error("Login error:", e.response?.data);
      }
    }
  }

  return (
    <div className="flex justify-center gap-2 md:justify-start border p-2 rounded-full px-5 xl:mx-12 z-20">
      <a href="/" className="flex items-center font-medium">
        <div className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-primary-foreground">
          <img src={Logo} className="scale-125" />
        </div>
        <div className="text-lg">Hostrix</div>
      </a>
      {isVerify ? (
        <Button
          variant="ghost"
          className="flex items-center gap-2 ml-auto rounded-lg text-gray-600 hover:text-blue-600"
          onClick={handleGuestLogin}
        >
          <User className="h-4 w-4" />
          Login as Guest
        </Button>
      ) : null}
    </div>
  );
};

export default LoginHeader;
