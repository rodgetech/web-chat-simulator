"use client";

import { MessageSquare, Radio, Users, Settings } from "lucide-react";
import { NavButton } from "./nav-button";

export type NavTab = "chats" | "status" | "communities" | "settings";

interface NavSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems = [
  { id: "chats" as NavTab, icon: MessageSquare, label: "Chats" },
  { id: "status" as NavTab, icon: Radio, label: "Status" },
  { id: "communities" as NavTab, icon: Users, label: "Communities" },
];

export function NavSidebar({ activeTab, onTabChange }: NavSidebarProps) {
  return (
    <nav className="w-[70px] h-full bg-wa-bg-secondary border-r border-wa-border flex flex-col justify-between flex-shrink-0">
      <div className="flex flex-col">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <NavButton
          icon={Settings}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => onTabChange("settings")}
        />
      </div>
    </nav>
  );
}
