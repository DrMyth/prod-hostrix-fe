import { motion } from "framer-motion";
import { Rocket, Zap, Server } from "lucide-react";

const deploymentTypes = [
  {
    icon: <Rocket size={32} />,
    title: "Static Sites",
    gradient: "from-blue-500 to-cyan-400",
    description: "Lightning-fast static sites with global CDN caching",
    features: [
      "Instant global deployments",
      "Automatic SSL certificates",
      "Edge caching for blazing speed",
      "Continuous integration",
    ],
  },
  {
    icon: <Zap size={32} />,
    title: "Serverless Functions",
    gradient: "from-purple-500 to-pink-500",
    description: "Deploy functions on the edge, execute on demand",
    features: [
      "Zero cold starts",
      "Pay only for what you use",
      "Automatic scaling",
      "Edge network execution",
    ],
  },
  {
    icon: <Server size={32} />,
    title: "Persistent Servers",
    gradient: "from-green-500 to-emerald-400",
    description: "Fully managed persistent servers for your applications",
    features: [
      "NextJS compatibility",
      "Auto-scaling ECS tasks",
      "CloudFront + WAF Integration",
      "Load balanced traffic",
    ],
  },
];

const DeploymentCard = ({
  icon,
  title,
  gradient,
  description,
  features,
  index,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl p-8 bg-white shadow-lg border border-gray-100 h-full`}
    >
      <div
        className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-10`}
      ></div>

      <div
        className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-6`}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-3">
        {features.map((feature: string, idx: number) => (
          <li key={idx} className="flex items-center text-gray-700">
            <svg
              className="h-5 w-5 mr-2 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const DeploymentTypes = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden px-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
        <div className="absolute bottom-0 -left-[300px] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-blue-600 font-medium text-sm uppercase tracking-wider"
          >
            Flexible Deployment Options
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mt-2 mb-4"
          >
            The Right Infrastructure for Every Project
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choose the perfect hosting solution for your specific needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deploymentTypes.map((type, index) => (
            <DeploymentCard key={index} {...type} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeploymentTypes;
