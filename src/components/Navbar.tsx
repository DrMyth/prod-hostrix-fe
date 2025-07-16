import { User, LogOut, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/20">
      <div className="mx-auto xl:max-w-[80%] max-w-7xl px-6 sm:px-8">
        <div className="h-16 flex items-center justify-between rounded-b-3xl px-6">
          <a href="/dashboard" className="flex items-center gap-2 font-medium">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-primary-foreground">
              <img src={Logo} />
            </div>
            <div className="text-lg">Hostrix</div>
          </a>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/DrMyth/Hostrix"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="gap-2 rounded-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800 transition-all"
              >
                <Star className="h-4 w-4 fill-amber-500 stroke-amber-600" />
                <span>Star on GitHub</span>
              </Button>
            </a>

            <a
              href="mailto:deployments.hostrix@gmail.com?subject=Hostrix%20Feedback&body=Hi%20team%2C%0A%0AI%20have%20some%20feedback%20regarding%20Hostrix..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 hover:text-primary/90 transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Feedback</span>
              </Button>
            </a>

            <div className="relative ml-2">
              <Button
                variant="outline"
                className="h-9 w-9 p-0 rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <User className="h-5 w-5 text-primary" />
              </Button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-primary/20 shadow-lg rounded-xl overflow-hidden animate-in fade-in">
                  <div className="p-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10 rounded-lg transition-colors"
                      onClick={() => {
                        console.log("Sign Out");
                        localStorage.removeItem("token");
                        window.location.href = "/signin";
                      }}
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="text-red-500 font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
