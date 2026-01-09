"use client";

import { formatTimestamp } from "@/lib/date-utils";

interface TimestampProps {
  date: Date;
  className?: string;
}

export function Timestamp({ date, className }: TimestampProps) {
  return <span className={className}>{formatTimestamp(date)}</span>;
}
