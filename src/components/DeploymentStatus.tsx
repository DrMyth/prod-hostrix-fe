import React from "react";

type DeploymentStatus = "SUCCESS" | "FAILED" | "IN_PROGRESS" | "QUEUED" | string;

interface DeploymentStatusProps {
  status: DeploymentStatus;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ status }) => {
  let bgColor = "bg-gray-500/20";
  let textColor = "text-gray-600";

  switch (status) {
    case "SUCCESS":
      bgColor = "bg-emerald-500/20";
      textColor = "text-emerald-600";
      break;
    case "IN_PROGRESS":
    case "QUEUED":
      bgColor = "bg-amber-500/20";
      textColor = "text-amber-600";
      break;
    case "FAILED":
      bgColor = "bg-red-500/20";
      textColor = "text-red-600";
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

export default DeploymentStatus;
