import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-white border-t border-gray-100 xl:max-w-5xl 2xl:max-w-7xl mx-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0"
        >
          {/* Left: Logo + Name + Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/logo-black.png" // Update with your actual logo path
                alt="Hostrix Logo"
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="text-lg font-medium text-gray-900">Hostrix</span>
            </div>
            <motion.p
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              className="text-sm pl-3 text-gray-500 max-w-xs text-center md:text-left"
            >
              Next-gen hosting crafted for developers who ship fast and build
              smart.
            </motion.p>
          </div>

          {/* Right: Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://github.com/DrMyth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <Github size={18} />
            </a>
            <a
              href="https://x.com/varunmaramreddy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/varunmaramreddy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </motion.div>

        {/* Optional separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

        {/* Bottom: Copyright */}
        <p className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Hostrix. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
