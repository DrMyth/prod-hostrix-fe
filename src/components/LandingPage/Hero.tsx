import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { CustomBadge } from "../ui/CustomBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-36 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob" />
        <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <CustomBadge text="Introducing Hostrix ⚡" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Deploy <span className="text-gradient">Anything</span>.<br />
            Scale <span className="text-gradient">Everything</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            From lightning-fast static sites with global CDN to edge serverless
            functions and rock-solid persistent servers. Ship faster, perform
            better, scale with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Watch Demo</DialogTitle>
                  <DialogDescription>
                    See how Hostrix can transform your deployment workflow
                  </DialogDescription>
                </DialogHeader>
                <div className="aspect-video mt-4">
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
                    <p className="text-gray-500">Demo video coming soon</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 relative z-10"
        >
          <div className="relative mx-auto max-w-5xl xl:max-w-5xl 2xl:max-w-7xl">
            <div className="absolute inset-0 -m-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"></div>
            <img
              src="/Dashboard.png"
              alt="Hostrix Dashboard"
              className="relative rounded-xl border border-gray-200 shadow-lg w-full mt-2 pt-4 bg-white"
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
