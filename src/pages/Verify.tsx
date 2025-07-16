import { OtpVerifyForm } from "@/components/verify";
import backgroundImage from "../assets/placeholder.svg";
import LoginHeader from "@/components/auth-header";

const Verify = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <LoginHeader isVerify={false} />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <OtpVerifyForm />
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
              "Security is not an afterthought, it's the foundation."
            </blockquote>
            <p className="text-sm font-medium text-gray-300">
              – Protecting your digital identity is our priority
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
