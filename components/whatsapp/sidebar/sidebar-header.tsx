"use client";

import { MoreVertical, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppLogo } from "../common/whatsapp-logo";

interface SidebarHeaderProps {
  onCreateSimulation?: () => void;
}

export function SidebarHeader({ onCreateSimulation }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-wa-bg-main">
      <WhatsAppLogo />
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
          onClick={onCreateSimulation}
          title="New Simulation"
        >
          <SquarePlus className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-wa-bg-secondary border-wa-border text-wa-text-primary"
          >
            <DropdownMenuItem>New group</DropdownMenuItem>
            <DropdownMenuItem>Starred messages</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
