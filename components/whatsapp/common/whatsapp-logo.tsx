"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-wa-icon-active">
        <MessageCircle className="h-6 w-6 text-white" fill="white" />
      </div>
      <h1 className="text-base font-medium text-wa-text-primary">WhatsApp</h1>
    </div>
  );
}
