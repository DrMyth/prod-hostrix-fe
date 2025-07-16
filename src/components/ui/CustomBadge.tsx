
import { motion } from "framer-motion";

interface CustomBadgeProps {
  text: string;
}

export const CustomBadge = ({ text }: CustomBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-6"
    >
      <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
        {text}
      </div>
    </motion.div>
  );
};