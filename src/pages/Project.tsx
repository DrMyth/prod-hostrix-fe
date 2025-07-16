import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Rocket,
  Clock,
  Terminal,
  GitCommit,
  GitBranch,
  Trash,
  Server,
  ExternalLink,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/utils";
import DeploymentStatus from "@/components/DeploymentStatus";
// import ProjectHeader from "@/components/ProjectHeader";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  description: String;
  repositoryUrl: string;
  gitUrl: string;
  status: "deployed" | "pending" | "failed";
  deploymentType: "static" | "serverless" | "hybrid";
  lastDeployed: Date;
  environment: string;
  logs: string[];
  deployments: {
    id: string;
    commitId: string;
    commitMessage: string;
    updatedAt: Date;
    logs: {
      message: string;
      timestamp: Date;
    }[];
    status: "SUCCESS" | "FAILED" | "PENDING" | "IN_PROGRESS";
  }[];
  buildCommands: string;
  runCommands: string;
  installCommands: string;
}

async function getProject(projectId: string) {
  try {
    const response = await axiosInstance.post(
      `/api/v1/get-projects-by-id/${projectId}`
    );
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

interface Commit {
  sha: string;
  commit: {
    message: string;
  };
}

interface Commit {
  sha: string;
  commit: {
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  };
}

interface Branch {
  name: string;
}

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [buildCommands, setBuildCommands] = useState<string>("");
  const [runCommands, setRunCommands] = useState<string>("");
  const [installCommands, setInstallCommands] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["overview", "logs", "analytics", "settings"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // console.log(projectId);
        const fetchedProject = await getProject(projectId as string);
        // console.log(fetchedProject);

        if (!fetchedProject) {
          console.warn("Project not found. Redirecting...");
          navigate("/dashboard");
          return;
        }

        setProject(fetchedProject);
        // setBuildCommands(fetchedProject.buildCommands);
        // setRunCommands(fetchedProject.runCommands);
        // setInstallCommands(fetchedProject.installCommands);

        await fetchCommits(fetchedProject.repositoryUrl);
        await fetchBranches(fetchedProject.repositoryUrl);
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, navigate]);

  const fetchCommits = async (gitUrl: string) => {
    try {
      const repoPath = gitUrl.replace("https://github.com/", "");
      const response = await fetch(
        `https://api.github.com/repos/${repoPath}commits?per_page=5`
      );
      const data = await response.json();
      // console.log("Commit data: ", data);
      setCommits(data);
    } catch (error) {
      console.error("Failed to fetch commits:", error);
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    const newEnvVars = [...envVars];
    newEnvVars.splice(index, 1);
    setEnvVars(newEnvVars);
  };

  const updateEnvVar = (index: number, key: string, value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index] = { key, value };
    setEnvVars(newEnvVars);
  };

  const fetchBranches = async (gitUrl: string) => {
    try {
      const repoPath = gitUrl.replace("https://github.com/", "");
      const response = await fetch(
        `https://api.github.com/repos/${repoPath}branches`
      );
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleDeploy = (commitId: string) => {
    // console.log("Deploying commit:", commitId);
    const name = project?.name;
    const type = project?.deploymentType;
    navigate(`/deploy/${projectId}`, { state: { name, type, commitId } });
  };

  const handleDeleteProject = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!isConfirmed) return;

    try {
      await axiosInstance.post(`/api/v1/delete-projects-by-id/${projectId}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const updateDeployment = async () => {
    try {
      await axiosInstance.post(`/api/v1/update-projects-by-id/${projectId}`, {
        commitId: selectedBranch,
        buildCommands,
        runCommands,
        installCommands,
        envVars,
      });
      // console.log(response);
    } catch (error) {
      console.error("Error updating deployment:", error);
    }
  };

  // const getLatestDeploymentStatus = () => {
  //   if (!project || !project.deployments || project.deployments.length === 0) {
  //     return "Not Deployed";
  //   }

  //   const sortedDeployments = [...project.deployments].sort(
  //     (a, b) =>
  //       new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  //   );

  //   return sortedDeployments[0].status;
  // };

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="border-b border-border/20 shadow-sm" />

      <main className="p-4 sm:p-6 xl:max-w-[80%] mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {project.repositoryUrl}
            </p>
          </div>

          <Button
            className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-primary/30 hover:scale-101 transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="overview"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Info Card */}
            <Card className="overflow-hidden border-border/40">
              <CardHeader className="bg-muted/30 p-6">
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-primary" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </h3>
                      <p className="text-sm">
                        {project.description || "No description available."}
                      </p>
                    </div>

                    {/* Repository */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Repository
                      </h3>
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center text-primary hover:underline"
                      >
                        {project.repositoryUrl.replace(
                          "https://github.com/",
                          ""
                        )}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>

                    {/* Environment */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Environment
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
                          {project.environment || "Production"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Last Deployment */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Last Deployment
                      </h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {project.deployments && project.deployments.length > 0
                            ? new Date(
                                project.deployments.sort(
                                  (a, b) =>
                                    new Date(b.updatedAt).getTime() -
                                    new Date(a.updatedAt).getTime()
                                )[0].updatedAt
                              ).toLocaleString()
                            : "Never deployed"}
                        </span>
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Project Type
                      </h3>
                      <Badge variant="outline" className="capitalize">
                        {project.deploymentType}
                      </Badge>
                    </div>

                    {/* Deploy Button */}
                    <div className="pt-2">
                      <Button
                        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        onClick={() => handleDeploy("latest")}
                      >
                        <Rocket className="h-4 w-4" />
                        Deploy Latest Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commits and Deployments Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Commits Section */}
              <Card className="border-border/40">
                <CardHeader className="bg-muted/30 p-6">
                  <CardTitle className="flex items-center">
                    <GitCommit className="h-5 w-5 mr-2 text-primary" />
                    Latest Commits
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {commits.map((commit) => (
                      <div
                        key={commit.sha}
                        className="flex items-start justify-between p-4 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={commit.author.avatar_url}
                              alt={commit.author.login}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium line-clamp-2">
                              {commit.commit.message}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="font-mono">
                                {commit.sha.slice(0, 7)}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{commit.author.login}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0 mt-1"
                          onClick={() => handleDeploy(commit.sha)}
                        >
                          <Rocket className="h-3.5 w-3.5 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deployments Section */}
              <Card className="border-border/40">
                <CardHeader className="bg-muted/30 p-6">
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-primary" />
                    Deployment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {project.deployments
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.updatedAt).getTime() -
                          new Date(a.updatedAt).getTime()
                      )
                      .map((deployment) => (
                        <div
                          key={deployment.id}
                          className="p-4 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                              Deployment #{deployment.id.split("-")[1]}
                            </div>
                            <DeploymentStatus status={deployment.status} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <GitCommit className="h-3.5 w-3.5 mr-1" />
                              <span className="font-mono">
                                {deployment.id.slice(0, 7)}
                              </span>
                            </div>
                            <span>
                              {new Date(deployment.updatedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                            {deployment.commitMessage}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-border/40">
              <CardHeader className="bg-muted/30 p-6">
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2 text-primary" />
                  Deployment Logs
                </CardTitle>
                <CardDescription>
                  View the logs for the most recent deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-zinc-950 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                  {(() => {
                    const sortedDeployments =
                      project.deployments
                        ?.slice()
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime()
                        ) || [];

                    const latestDeployment = sortedDeployments[0];
                    // console.log("LD", latestDeployment);
                    const logs = latestDeployment?.logs || [];

                    return logs.length > 0 ? (
                      logs.map((log, index) => (
                        <div key={index} className="pb-1">
                          <span className="text-green-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="text-zinc-400"> - </span>
                          <span>{log.message}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-400">
                        No logs available for this project.
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-border/40">
              <CardHeader className="bg-muted/30 p-6">
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Project Settings
                </CardTitle>
                <CardDescription>
                  Configure project settings and deployment options
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Branch Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Deployment Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full p-2 rounded-md border border-border bg-transparent text-sm"
                  >
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Select which branch to use for automatic deployments
                  </p>
                </div>

                <Separator />

                {/* Build Commands */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Build Commands
                  </label>
                  <Input
                    value={buildCommands}
                    onChange={(e) => setBuildCommands(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="npm run build"
                  />
                  <p className="text-xs text-muted-foreground">
                    Commands to build your application
                  </p>
                </div>

                {/* Install Commands */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Install Commands
                  </label>
                  <Input
                    value={installCommands}
                    onChange={(e) => setInstallCommands(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="npm install"
                  />
                  <p className="text-xs text-muted-foreground">
                    Commands to install dependencies
                  </p>
                </div>

                {/* Run Commands */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Run Commands
                  </label>
                  <Input
                    value={runCommands}
                    onChange={(e) => setRunCommands(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="npm start"
                  />
                  <p className="text-xs text-muted-foreground">
                    Commands to start your application
                  </p>
                </div>

                <label className="text-sm font-medium text-muted-foreground">
                  Environment Variables
                </label>
                <div className="space-y-2">
                  {envVars.map((envVar, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Key"
                        value={envVar.key}
                        onChange={(e) =>
                          updateEnvVar(index, e.target.value, envVar.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        value={envVar.value}
                        type="password"
                        onChange={(e) =>
                          updateEnvVar(index, envVar.key, e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeEnvVar(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addEnvVar}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Environment Variable
                  </Button>
                </div>

                {/* Update Button */}
                <Button
                  className="w-full mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={updateDeployment}
                >
                  Save Settings
                </Button>

                <Separator className="my-6" />

                {/* Danger Zone */}
                <div className="space-y-4 rounded-lg border border-destructive/20 p-4 bg-destructive/5">
                  <div>
                    <h3 className="text-base font-medium text-destructive">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      These actions are irreversible and should be used with
                      caution.
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleDeleteProject}
                  >
                    <Trash className="h-4 w-4" />
                    Delete Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectPage;
