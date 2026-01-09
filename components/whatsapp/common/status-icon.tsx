"use client";

import { MessageStatus } from "@/types/message";
import { Check, CheckCheck } from "lucide-react";

interface StatusIconProps {
  status: MessageStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  if (status === "read") {
    return <CheckCheck className="h-4 w-4 text-[#53bdeb]" />;
  } else if (status === "delivered") {
    return <CheckCheck className="h-4 w-4 text-wa-text-secondary" />;
  } else {
    return <Check className="h-4 w-4 text-wa-text-secondary" />;
  }
}
