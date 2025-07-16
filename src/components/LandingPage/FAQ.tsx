import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { motion } from "framer-motion";
  
  const faqs = [
    {
      question: "What types of applications can I deploy with Hostrix?",
      answer: "Hostrix supports three main deployment types: static sites with CDN caching, serverless functions running on edge, and persistent servers for applications like NextJS or WebSocket servers that require continuous operation."
    },
    {
      question: "How does Hostrix handle scaling for my applications?",
      answer: "Static sites scale automatically with our global CDN. Serverless functions scale to zero when not in use and instantly up when traffic increases. Persistent servers use auto-scaling ECS tasks with Application Load Balancers to distribute traffic based on demand."
    },
    {
      question: "Can I use my own custom domain with Hostrix?",
      answer: "Yes, you can easily use your own custom domain with any Hostrix deployment. We provide automatic SSL certificate issuance and renewal through Let's Encrypt, so your site will be secure from day one."
    },
    {
      question: "Is there continuous integration and deployment support?",
      answer: "Yes, Hostrix integrates with GitHub, GitLab, and Bitbucket to provide automated deployments every time you push to your repository. You can configure branch-specific deployments, preview deployments for pull requests, and rollbacks if needed."
    },
    {
      question: "What kind of analytics and monitoring does Hostrix provide?",
      answer: "Hostrix provides comprehensive analytics including visitor metrics, performance data, error tracking, and resource utilization statistics. You can view real-time logs, set up alerts, and integrate with third-party monitoring solutions."
    },
    {
      question: "How does pricing work for the different deployment types?",
      answer: "Static sites are priced based on bandwidth and request count. Serverless functions are charged based on execution time and memory usage. Persistent servers are billed according to compute resources used and running time. All plans include a generous free tier for development and small projects."
    }
  ];
  
  const FAQ = () => {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              Frequently Asked <span className="text-gradient">Questions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Everything you need to know about Hostrix's capabilities
            </motion.p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={`item-${index}`} className="border border-gray-200 mb-4 rounded-lg overflow-hidden bg-white">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 text-lg font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  };
  
  export default FAQ;