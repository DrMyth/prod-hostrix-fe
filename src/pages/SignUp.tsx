import backgroundImage from "../assets/placeholder.svg";
import { SignupForm } from "@/components/signup";
import LoginHeader from "@/components/auth-header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <LoginHeader isVerify={true} setError={setError} />
        <div className="flex flex-1 items-center justify-center  xl:scale-120">
          <div className="w-full max-w-xs">
            <SignupForm error={error} setError={setError} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-20 flex h-full items-end p-8 text-white">
          <div className="max-w-md space-y-4">
            <blockquote className="text-lg font-semibold italic">
              "The best way to predict the future is to create it."
            </blockquote>
            <p className="text-sm font-medium text-gray-300">
              – Join thousands of innovators already shaping tomorrow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
