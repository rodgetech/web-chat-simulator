import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SimulationBadge() {
  return (
    <Badge
      variant="outline"
      className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/10 text-blue-400 border-blue-500/30 font-medium"
    >
      <Play className="h-2.5 w-2.5 mr-0.5 fill-current" />
      SIM
    </Badge>
  );
}
