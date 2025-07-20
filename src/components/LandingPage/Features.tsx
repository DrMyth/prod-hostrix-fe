import { motion } from "framer-motion";
import { Rocket, Server, GitBranch, Globe, Zap, Gauge } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const featuresList = [
  {
    icon: <Rocket size={24} />,
    title: "Blazing-Fast Static Sites",
    description:
      "Deploy static sites with global CDN caching for lightning-fast performance and exceptional user experience.",
    delay: 0.1,
  },
  {
    icon: <Zap size={24} />,
    title: "Edge Serverless Functions",
    description:
      "Run serverless functions at the edge for minimal latency and automatic scaling with zero infrastructure management.",
    delay: 0.2,
  },
  {
    icon: <Server size={24} />,
    title: "Reliable Persistent Servers",
    description:
      "Launch robust persistent servers for NextJS, WebSockets, and applications requiring continuous operation.",
    delay: 0.3,
  },
  {
    icon: <Globe size={24} />,
    title: "Global CDN Distribution",
    description:
      "Deliver your content instantly across a worldwide network of edge locations for ultra-fast global access.",
    delay: 0.4,
  },
  {
    icon: <GitBranch size={24} />,
    title: "Seamless CI/CD Integration",
    description:
      "Connect directly to your code repositories for automated builds and deployments with every push.",
    delay: 0.5,
  },
  {
    icon: <Gauge size={24} />,
    title: "Performance Optimization",
    description:
      "Automatic fine-tuning of your applications to deliver maximum speed and efficiency for your users.",
    delay: 0.6,
  },
];

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="feature-card p-6 rounded-xl bg-white shadow"
    >
      <div className="feature-icon text-blue-500 mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative mt-5">
      <div className="container mx-auto px-4 xl:max-w-5xl 2xl:max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Unleash Your Apps with{" "}
            <span className="text-gradient">Limitless</span> Deployment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            One powerful platform for all your deployment needs, from static
            sites to complex server applications
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
