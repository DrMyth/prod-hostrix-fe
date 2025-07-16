import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, LayoutTemplate, Cpu, Server } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
// import { axiosInstance } from "@/lib/utils";

type ProjectType = "static-site" | "serverless-backend" | "fullstack-app";

export default function NewProject() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [gitUrl, setGitUrl] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("static-site");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/projects`, {
        projectName,
        repositoryUrl: gitUrl,
        projectSlug,
        deploymentType: projectType,
        description: projectDescription,
      });
      // console.log(result);
    } catch (e) {
      // console.log("Error: ", e);
    }

    setIsSubmitting(false);
    navigate("/dashboard");
  };

  const handleProjectNameChange = (value: string) => {
    setProjectName(value);
    setProjectSlug(value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
  };

  const projectTypes = [
    {
      id: "static-site",
      title: "Static Sites",
      icon: LayoutTemplate,
      description:
        "Deploy static sites served via global CDN. Perfect for React, Vue, or plain HTML/CSS sites",
      features: [
        "Instant global deployments",
        "Edge caching for rapid performance",
        "Continuous integration",
      ],
      disabled: false,
    },
    {
      id: "serverless-backend",
      title: "Serverless Backend",
      icon: Cpu,
      description:
        "Deploy serverless functions and APIs. Scales automatically with zero server management.",
      features: ["On-demand execution", "Automatic scaling", "No cold starts"],
      disabled: false,
    },
    {
      id: "fullstack-app",
      title: "Fullstack App",
      icon: Server,
      description:
        "Deploy fullstack applications with persistent servers. Ideal for Next.js, WebSockets, or custom Node.js apps.",
      features: [
        "Persistent servers",
        "Auto-managed servers with high uptime",
        "Integrated security and load balancing",
      ],
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-sm border p-6 sm:p-8">
            <div className="space-y-1 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Create New Project
              </h1>
              <p className="text-muted-foreground">
                Configure your project settings and deployment options
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  placeholder="My Awesome Project"
                  value={projectName}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Project URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={projectSlug}
                    onChange={(e) => setProjectSlug(e.target.value)}
                    required
                    className="font-mono flex-1"
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    .hostrix.tech
                  </span>
                </div>
                {projectSlug && (
                  <p className="text-sm text-muted-foreground">
                    Preview: https://{projectSlug}.hostrix.tech
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Git Repository</Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://github.com/username/repository"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Project Type</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {projectTypes.map((type) => {
                    const isDisabled = type.disabled;

                    return (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() =>
                          !isDisabled && setProjectType(type.id as ProjectType)
                        }
                        className={`relative text-left rounded-lg border p-4 transition-all
                          ${
                            isDisabled
                              ? "cursor-not-allowed opacity-50"
                              : "hover:border-primary/30"
                          }
                          ${
                            projectType === type.id && !isDisabled
                              ? "border-primary/50 bg-primary/5"
                              : "hover:bg-muted/50"
                          }
                        `}
                        disabled={isDisabled}
                      >
                        {isDisabled && (
                          <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded">
                            Coming Soon
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <type.icon
                            className={`w-6 h-6 ${
                              projectType === type.id && !isDisabled
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <h3 className="font-medium">{type.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        <ul className="space-y-1">
                          {type.features.map((feature) => (
                            <li
                              key={feature}
                              className="text-xs text-muted-foreground flex items-center gap-2"
                            >
                              <span className="text-primary">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your project's purpose and functionality..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
