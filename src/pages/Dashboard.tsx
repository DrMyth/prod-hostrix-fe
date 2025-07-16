import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Plus,
  Search,
  Settings,
  Rocket,
  ArrowUp,
  ArrowDown,
  CalendarClock,
  ArrowUpDown,
  Text,
  Copy,
} from "lucide-react";
import AIAssistant from "@/components/AIAssistant";
import Navbar from "@/components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { axiosInstance, isAuthenticated } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  projectSlug: string;
  deploymentStatus:
    | "SUCCESS"
    | "FAILED"
    | "QUEUED"
    | "NOT_STARTED"
    | "IN_PROGRESS";
  deploymentType: "static" | "serverless" | "hybrid";
  lastDeployedAt: Date;
  environment: string;
}

async function getProjects() {
  try {
    const response = await axiosInstance.get("/api/v1/get-projects");
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState<
    "all" | "static" | "serverless" | "hybrid"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<"lastDeployed" | "name" | "status">(
    "lastDeployed"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      const data = await getProjects();
      // console.log(data);
      setProjects(data);
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const matchesType =
        selectedType === "all" ||
        project.deploymentType.toLowerCase() === selectedType;
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectSlug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "lastDeployed") {
        const dateA = a.lastDeployedAt
          ? new Date(a.lastDeployedAt).getTime()
          : 0;
        const dateB = b.lastDeployedAt
          ? new Date(b.lastDeployedAt).getTime()
          : 0;
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }

      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      const statusOrder = [
        "SUCCESS",
        "IN_PROGRESS",
        "QUEUED",
        "NOT_STARTED",
        "FAILED",
      ];
      return sortOrder === "asc"
        ? statusOrder.indexOf(a.deploymentStatus) -
            statusOrder.indexOf(b.deploymentStatus)
        : statusOrder.indexOf(b.deploymentStatus) -
            statusOrder.indexOf(a.deploymentStatus);
    });

  if (!isAuthenticated()) {
    // console.log("Trying to access dashboard without authentication. Redirecting to signin page.");
    return <Navigate to="/signin" />;
  }

  useEffect(() => {
    async function fetchProjects() {
      // Check cache first
      const cachedProjects = localStorage.getItem("cachedProjects");
      const cachedTime = localStorage.getItem("cachedProjectsTime");

      // Use cached data if younger than 5 minutes
      if (cachedProjects && cachedTime) {
        const age = Date.now() - parseInt(cachedTime);
        if (age < 5 * 60 * 1000) {
          // 5 minutes
          setProjects(JSON.parse(cachedProjects));
        }
      }

      // Always fetch fresh data in background
      try {
        const response = await axiosInstance.get("/api/v1/get-projects");
        const data = response.data.projects;

        // Update state with fresh data
        setProjects(data);

        // Update cache
        localStorage.setItem("cachedProjects", JSON.stringify(data));
        localStorage.setItem("cachedProjectsTime", Date.now().toString());
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Optionally show error notification but keep cached data
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="border-b border-border/20 shadow-sm" />

      <main className="mx-auto p-4 sm:p-6 xl:max-w-[80%]">
        <AIAssistant />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Project Overview
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredProjects.length} active deployments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:max-w-[300px]">
              <Input
                placeholder="Search projects..."
                className="w-full pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-transparent hover:text-inherit focus-visible:ring-0 cursor-pointer"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger className="w-[180px] h-9 rounded-lg border-border/50 hover:border-primary/30 focus:ring-0">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {sortBy === "lastDeployed" && "Last Deployed"}
                      {sortBy === "name" && "Project Name"}
                      {sortBy === "status" && "Status"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border/50">
                  <SelectGroup>
                    <SelectItem
                      value="lastDeployed"
                      className="hover:bg-muted/50 focus:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Last Deployed
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="name"
                      className="hover:bg-muted/50 focus:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Text className="h-4 w-4" />
                        Project Name
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="status"
                      className="hover:bg-muted/50 focus:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Status
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg border-border/50 hover:border-primary/30 hover:bg-transparent"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            <Tabs
              defaultValue="all"
              value={selectedType}
              onValueChange={(value: string) => {
                // console.log("changed", value);
                setSelectedType(
                  value as "all" | "static" | "serverless" | "hybrid"
                );
              }}
            >
              <TabsList className="flex">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="static">Static</TabsTrigger>
                <TabsTrigger value="serverless">Serverless</TabsTrigger>
                <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-primary/30 hover:scale-101 transition-all"
              onClick={() => navigate("/project/new")}
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-sm flex gap-1">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `http://${project.projectSlug}.hostrix.tech`
                        )
                      }
                      className="text-gray-500 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      <Copy size={14} />
                    </button>
                    <a
                      href={`http://${project.projectSlug}.hostrix.tech`}
                      target="_blank"
                      className="max-w-[200px] inline-block overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      https://{project.projectSlug}.hostrix.tech
                    </a>
                  </CardDescription>
                </div>
                <div
                  className={`right-5 absolute px-4 mt-3 py-1 rounded-full text-xs font-medium ${
                    project.deploymentStatus === "SUCCESS"
                      ? "bg-green-500/20 text-green-600"
                      : project.deploymentStatus === "FAILED"
                      ? "bg-red-500/20 text-red-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {project.deploymentStatus === "SUCCESS"
                    ? "Deployed"
                    : project.deploymentStatus === "IN_PROGRESS"
                    ? "Pending"
                    : project.deploymentStatus === "QUEUED"
                    ? "Queued"
                    : project.deploymentStatus === "NOT_STARTED"
                    ? "Not Started"
                    : project.deploymentStatus === "FAILED"
                    ? "Failed"
                    : "Unknown Status"}

                  {/* {project.status? project.status.toUpperCase() + project.status.slice(1): "Not deployed"} */}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Deployed</span>
                  <span className="font-medium">
                    {project.lastDeployedAt
                      ? new Date(project.lastDeployedAt).toLocaleString()
                      : "Not Deployed"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Environment</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      project.environment
                        ? "bg-green-100 text-green-800"
                        : "bg-muted"
                    }`}
                  >
                    {project.environment || "Production"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deployment Type</span>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {project.deploymentType.toLowerCase()}
                  </span>
                </div>
              </CardContent>

              <div className="border-t ml-5 mr-5"></div>
              <CardFooter className="mt-auto">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      navigate(`/project/${project.id}#logs`);
                    }}
                  >
                    <Activity className="h-4 w-4" />
                    Logs
                  </Button>
                  <Button
                    size="sm"
                    className={`gap-2 text-white ${
                      project.deploymentStatus === "SUCCESS"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                    }`}
                    onClick={() => {
                      // navigate(`/project/${project.id}`);
                      if (project.deploymentStatus === "SUCCESS") {
                        navigate(`/project/${project.id}`);
                      } else {
                        const name = project.name;
                        const type = project.deploymentType;
                        // console.log(project);
                        navigate(`/deploy/${project.id}`, {
                          state: { name, type },
                        });
                      }
                    }}
                  >
                    {project.deploymentStatus === "SUCCESS" ? (
                      <>
                        <Settings className="h-4 w-4" />
                        Manage
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        Deploy
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
