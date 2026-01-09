"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wa-text-tertiary" />
      <Input
        type="text"
        placeholder="Search or start a new chat"
        className="pl-10 bg-wa-bg-secondary border-none text-wa-text-primary placeholder:text-wa-text-tertiary h-10 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
