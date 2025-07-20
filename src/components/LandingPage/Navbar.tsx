import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useNavigate();

  return (
    <header className="fixed m-2 rounded-full shadow mx-4 sm:mx-8 md:mx-25 xl:mx-60 px-3 border top-2 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {/* <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
              H
            </div> */}
            <img
              src="/logo-black.png" // Update with your actual logo path
              alt="Hostrix Logo"
              className="h-10 w-10 rounded-md object-contain"
            ></img>
            <span className="text-xl font-semibold">Hostrix</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            {/* <a href="#" className="text-gray-600 hover:text-blue-600">
              Pricing
            </a> */}
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600"
            >
              How it Works
            </a>
            <a href="#footer" className="text-gray-600 hover:text-blue-600">
              Blog
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => {
                // console.log("Navigating to /signin");
                router("/signin");
              }}
            >
              Login
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // console.log("Navigating to /signup");
                router("/signup");
              }}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white"
        >
          <div className="px-4 py-4 space-y-4 border-b border-gray-200">
            <a href="#" className="block text-gray-600 hover:text-blue-600">
              Features
            </a>
            {/* <a href="#" className="block text-gray-600 hover:text-blue-600">
              Pricing
            </a> */}
            <a href="#" className="block text-gray-600 hover:text-blue-600">
              Documentation
            </a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">
              Blog
            </a>
          </div>
          <div className="px-4 py-4 space-y-4">
            <Button
              variant="ghost"
              className="w-full text-left text-gray-600 hover:text-blue-600"
              onClick={() => {
                // console.log("Navigating to /signin");
                router("/signin");
              }}
            >
              Login
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // console.log("Navigating to /signin");
                router("/signup");
              }}
            >
              Sign Up
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
