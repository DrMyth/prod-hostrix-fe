import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, Plus, Trash } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { axiosInstance } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import confetti from "canvas-confetti";

interface LogEvent {
  event_id: string;
  timestamp: string;
  DEPLOYMENT_ID: string;
  log: string;
  metadata?: string;
  level: string;
  PROJECT_ID?: string;
}

export default function DeployConfig() {
  const location = useLocation();
  // console.log(location);
  const projectName = location.state?.name || "Unnamed Project";
  const deploymentType = location.state?.type.toLowerCase() || "IDK";
  const commitId = location.state?.commitId;
  // console.log("D", deploymentType);
  const navigate = useNavigate();

  const { projectId } = useParams();

  // console.log("Project ID:", projectId);

  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);
  const [buildCommand, setBuildCommand] = useState("");
  const [runCommand, setRunCommand] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [notifyOnDeploy, setNotifyOnDeploy] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiTrigger = () => {
    const duration = 10 * 1000;
    const end = Date.now() + duration;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
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

  const deploymentComplete = logs.some(
    (log) =>
      log.log.toLowerCase().includes("uploading done") ||
      log.log.toLowerCase().includes("build completed successfully") ||
      log.log.toLowerCase().includes("upload process completed")
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchLogs = async () => {
      if (!deploymentId) return;

      try {
        const response = await axiosInstance.get<{ logs: LogEvent[] }>(
          `/api/v1/logs/${deploymentId}`
        );
        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    // Only poll if the drawer is open, deploymentId exists, and deployment is not complete.
    if (isDrawerOpen && deploymentId && !deploymentComplete) {
      fetchLogs();
      intervalId = setInterval(fetchLogs, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (!isDrawerOpen) setLogs([]);
    };
  }, [isDrawerOpen, deploymentId, deploymentComplete]);

  useEffect(() => {
    if (deploymentComplete && !showConfetti) {
      setShowConfetti(true);
      confettiTrigger();

      setTimeout(() => {
        setIsDrawerOpen(false);
        navigate("/dashboard");
      }, 10000);
    }
  }, [logs, deploymentComplete, showConfetti, navigate]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);

    // console.log(envVars);
    // console.log(buildCommand);
    // console.log(runCommand);
    // console.log(installCommand);
    // console.log(notifyOnDeploy);

    // console.log(projectId);

    try {
      const deployment = await axiosInstance.post(
        `/api/v1/deployments/${deploymentType}`,
        {
          projectId,
          commitId,
          envVars,
          buildCommand,
          runCommand,
          installCommand,
          notifyOnDeploy,
          notificationEmail,
        }
      );

      // console.log(deployment);
      const deploymentId = deployment.data.data.deploymentId;
      setDeploymentId(deploymentId);
      // console.log("Deployment ID: from handling", deploymentId);
      setIsDrawerOpen(true);
    } catch (e) {
      console.error("Deployment failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="rounded-xl shadow-sm border p-6 sm:p-8">
            <CardHeader className="pb-4 space-y-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                  Deploy {projectName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-3">
                  <span className="font-medium">Current Commit:</span>
                  <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm text-primary/90">
                    {commitId}
                  </code>
                </div>
              </div>

              <p className="text-muted-foreground leading-6">
                Configure your deployment settings below. This will create a new
                deployment for the specified commit version.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeploy} className="space-y-8">
                <div className="space-y-4">
                  <Label>Environment Variables</Label>
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
                </div>

                <div className="space-y-4">
                  <Label>Build Command</Label>
                  <Input
                    placeholder="npm run build"
                    value={buildCommand}
                    onChange={(e) => setBuildCommand(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Run Command</Label>
                  <Input
                    placeholder="npm run dev"
                    value={runCommand}
                    onChange={(e) => setRunCommand(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Install Command</Label>
                  <Input
                    placeholder="npm install"
                    value={installCommand}
                    onChange={(e) => setInstallCommand(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Notification Settings</Label>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={notifyOnDeploy}
                      onCheckedChange={(checked) => setNotifyOnDeploy(checked)}
                    />
                    <span>Notify me on deployment completion</span>
                  </div>
                  {notifyOnDeploy && (
                    <Input
                      placeholder="Enter your email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                    />
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Deployment Configuration
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Build Command
                      </label>
                      <code className="block w-full p-2 bg-gray-50 rounded-md border border-gray-200 text-sm font-mono">
                        {buildCommand || "npm run build"}
                      </code>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Run Command
                      </label>
                      <code className="block w-full p-2 bg-gray-50 rounded-md border border-gray-200 text-sm font-mono">
                        {runCommand || "npm run dev"}
                      </code>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Install Command
                      </label>
                      <code className="block w-full p-2 bg-gray-50 rounded-md border border-gray-200 text-sm font-mono">
                        {installCommand || "npm install"}
                      </code>
                    </div>
                  </div>

                  {envVars.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Environment Variables
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {envVars.map((env, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-50 rounded-md p-2"
                          >
                            <span className="text-sm font-medium text-gray-600 mr-2">
                              {env.key}
                            </span>
                            <span className="text-sm text-gray-400 ml-auto">
                              •••••••
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {notifyOnDeploy && notificationEmail && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm">
                        <MailIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Notifications sent to:
                        </span>
                        <span className="ml-2 font-medium text-gray-900">
                          {notificationEmail}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    disabled={isDeploying}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isDeploying}
                  >
                    {isDeploying ? "Deploying..." : "Deploy"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[85vh] max-h-screen flex flex-col">
          <div className="mx-auto w-full max-w-4xl p-6 flex-1 flex flex-col overflow-hidden">
            <DrawerHeader className="-translate-x-2">
              <DrawerTitle className="text-2xl">Deployment Logs</DrawerTitle>
              <DrawerDescription>
                Real-time logs for {projectName} deployment
              </DrawerDescription>
            </DrawerHeader>

            <div className="bg-zinc-950 p-4 rounded-lg mt-1 flex-1 overflow-hidden">
              <ScrollArea className="h-full font-mono text-sm overflow-y-auto">
                <div className="space-y-2 text-zinc-100 pr-4 overflow-hidden">
                  {logs.map((log) => (
                    <div
                      key={log.event_id}
                      className="pb-2 border-b border-zinc-800/50"
                    >
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-green-400">
                          <time className="font-medium tabular-nums">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </time>
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-[0.7rem] tracking-wide text-zinc-400">
                          #{log.event_id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-200">{log.log}</div>
                    </div>
                  ))}

                  {logs.length === 0 && (
                    <div className="text-zinc-400 py-4 text-center">
                      No deployment logs available
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed footer
      <div className="pt-4 bg-zinc-950 sticky bottom-0 z-10">
        <DrawerFooter className="bg-zinc-950 rounded-b-lg border-t border-zinc-800">
          <div className="flex justify-end gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="text-zinc-100 border-zinc-700">
                Close
              </Button>
            </DrawerClose>
            <Button
              variant="secondary"
              onClick={() => setLogs([])}
              disabled={!logs.length}
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            >
              Clear Logs
            </Button>
          </div>
        </DrawerFooter>
      </div> */}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
