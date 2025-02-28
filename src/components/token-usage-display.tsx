
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

interface TokenUsageProps {
  used: number;
  limit: number;
  isApproachingLimit: boolean;
  percentUsed: number;
}

export function TokenUsageDisplay({ used, limit, isApproachingLimit, percentUsed }: TokenUsageProps) {
  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm mb-1">
        <span>Token Usage</span>
        <span className={isApproachingLimit ? "text-amber-500 font-medium" : ""}>
          {used} / {limit} ({percentUsed}%)
        </span>
      </div>
      <Progress 
        value={percentUsed} 
        className={isApproachingLimit ? "bg-amber-100" : ""}
      />
      {isApproachingLimit && (
        <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>You're approaching your monthly token limit</span>
        </div>
      )}
    </div>
  );
}
