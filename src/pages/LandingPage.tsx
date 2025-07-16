// import Navbar from "@/components/Navbar";

import { useEffect } from "react";
import Hero from "@/components/LandingPage/Hero";
import Features from "@/components/LandingPage/Features";
import DeploymentTypes from "@/components/LandingPage/DeploymentTypes";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import { HostrixGlobe } from "@/components/LandingPage/HostrixGlobe";
import FAQ from "@/components/LandingPage/FAQ";
import CTA from "@/components/LandingPage/CTA";
import Footer from "@/components/LandingPage/Footer";
import Navbar from "@/components/LandingPage/Navbar";

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Navbar />

      <main>
        <Hero />

        <Features />

        <DeploymentTypes />

        <section className="pt-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Global <span className="text-gradient">Edge Network</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Deploy your applications on our worldwide infrastructure for
                blazing-fast performance.
              </p>
            </div>

            {/* Adding extra space or a wrapper with relative positioning for the globe */}
            <div className="relative xl:mt-45 mt-10">
              <HostrixGlobe />
            </div>
          </div>
        </section>

        <HowItWorks />

        <FAQ />

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
