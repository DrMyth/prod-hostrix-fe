import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export function OtpVerifyForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const username = location.state?.username || "User";
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    // console.log("OTP: ", otpValue);

    if (otpValue.length < 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/confirm`,
        {
          username,
          confirmationCode: otpValue,
        }
      );

      if (response.status === 200) {
        // console.log("Verification successful");
        navigate("/signin");
      }
    } catch (e: any) {
      setError(
        e.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
      console.error("Verification error:", e.response?.data);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify Your Account</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          We've sent a 6-digit code to your email. Please check and enter it
          below.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label>Verification Code</Label>
          <div className="flex justify-center gap-2">
            {otp.map((_, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-xl p-0 focus-visible:ring-2 focus-visible:ring-primary"
                value={otp[index]}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                    (
                      e.currentTarget.previousSibling as HTMLInputElement
                    ).focus();
                  }
                }}
              />
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Verify OTP
        </Button>
      </div>
      <div className="text-center text-sm">
        Didn't receive code?{" "}
        <a
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Resend OTP
        </a>
      </div>
    </form>
  );
}
