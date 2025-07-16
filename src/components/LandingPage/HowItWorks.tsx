import { motion } from "framer-motion";
import { Github, Code, Rocket, BarChart } from "lucide-react";

const steps = [
  {
    icon: <Github className="h-8 w-8" />,
    title: "Connect Your Repository",
    description:
      "Link your GitHub, GitLab, or Bitbucket repository to Hostrix with just a few clicks.",
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Configure Your Project",
    description:
      "Select your project type, configure build settings, and choose your deployment strategy.",
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Deploy Instantly",
    description:
      "Push your code and let Hostrix handle the build, optimization, and deployment process.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Manage & Scale",
    description:
      "Easily manage your deployments and scale infrastructure based on traffic and demand.",
  },
];

const HowItWorks = () => {
  return (
    <section className="pt-10 pb-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-blue-600 font-medium text-sm uppercase tracking-wider"
          >
            Simple Deployment Process
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mt-2 mb-4"
          >
            How Hostrix <span className="text-gradient">Works</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            From code to production in minutes, not days
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[26px] top-0 bottom-0 w-1 bg-blue-100 hidden md:block"></div>

            {/* Steps */}
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 relative"
              >
                <div className="flex-shrink-0 w-14 h-14 p-3 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 z-10">
                  {step.icon}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
