"use client";

import { Plus, User, Zap, Clock, Upload, Camera, X } from "lucide-react";
import type { SimulatedConversation, SimulatedMessage } from "@/types/simulation";
import { MessageEditorItem } from "./message-editor-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

interface SimulationEditorProps {
  simulation: SimulatedConversation;
  onUpdate: (simulation: SimulatedConversation) => void;
}

export function SimulationEditor({
  simulation,
  onUpdate,
}: SimulationEditorProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleUpdateParticipantName = (name: string) => {
    onUpdate({ ...simulation, participantName: name });
  };

  const handleUpdateParticipantAvatar = (avatar: string) => {
    onUpdate({ ...simulation, participantAvatar: avatar });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleUpdateParticipantAvatar(base64String);
      // Keep modal open so user can see the preview
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatarUrl = () => {
    if (avatarUrl.trim()) {
      handleUpdateParticipantAvatar(avatarUrl.trim());
    }
    setIsAvatarModalOpen(false);
    setAvatarUrl("");
  };

  const handleRemoveAvatar = () => {
    handleUpdateParticipantAvatar("");
    // Keep modal open so user can upload a different photo
  };

  // Sync avatar URL with simulation when modal opens
  useEffect(() => {
    if (isAvatarModalOpen) {
      setAvatarUrl(simulation.participantAvatar || "");
    }
  }, [isAvatarModalOpen, simulation.participantAvatar]);

  const handleAddMessage = (isOwnMessage: boolean) => {
    const newMessage: SimulatedMessage = {
      id: nanoid(),
      content: "",
      isOwnMessage,
      delayMs: 2000, // Default 2 second delay
    };

    onUpdate({
      ...simulation,
      messages: [...simulation.messages, newMessage],
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simulation.messages.length]);

  const handleUpdateMessage = (index: number, message: SimulatedMessage) => {
    const updatedMessages = [...simulation.messages];
    updatedMessages[index] = message;
    onUpdate({ ...simulation, messages: updatedMessages });
  };

  const handleDeleteMessage = (index: number) => {
    const updatedMessages = simulation.messages.filter((_, i) => i !== index);
    onUpdate({ ...simulation, messages: updatedMessages });
  };

  const handleMoveMessage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= simulation.messages.length) return;

    const updatedMessages = [...simulation.messages];
    [updatedMessages[index], updatedMessages[newIndex]] = [
      updatedMessages[newIndex],
      updatedMessages[index],
    ];

    onUpdate({ ...simulation, messages: updatedMessages });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Container for Settings + Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header - Conversation Settings */}
        <div className="border-b border-wa-border p-4 space-y-4">
        <h3 className="text-sm font-semibold text-wa-text-primary">
          Conversation Settings
        </h3>

        {/* Participant Name with Avatar */}
        <div className="flex items-start gap-3">
          {/* Avatar with hover edit overlay */}
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-wa-bg-secondary overflow-hidden flex-shrink-0 group cursor-pointer"
          >
            {simulation.participantAvatar ? (
              <img
                src={simulation.participantAvatar}
                alt={simulation.participantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-wa-text-secondary" />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <label className="text-xs text-wa-text-secondary block mb-1">
              Participant Name
            </label>
            <Input
              value={simulation.participantName}
              onChange={(e) => handleUpdateParticipantName(e.target.value)}
              placeholder="Enter name..."
              className="h-9"
            />
            <p className="text-xs text-wa-text-tertiary mt-1">
              Click avatar to change photo
            </p>
          </div>
        </div>

        {/* Typing Mode Toggle */}
        <div className="flex flex-col gap-2 mt-3">
          <label className="text-xs text-wa-text-secondary">Typing Mode:</label>
          <div className="flex gap-2">
            <button
              onClick={() =>
                onUpdate({ ...simulation, typingMode: "instant" })
              }
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors ${
                (simulation.typingMode || "instant") === "instant"
                  ? "bg-wa-icon-active text-white"
                  : "bg-wa-bg-hover text-wa-text-secondary hover:bg-wa-border"
              }`}
            >
              <Zap className="h-3 w-3" />
              Instant
            </button>
            <button
              onClick={() =>
                onUpdate({ ...simulation, typingMode: "realistic" })
              }
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors ${
                simulation.typingMode === "realistic"
                  ? "bg-wa-icon-active text-white"
                  : "bg-wa-bg-hover text-wa-text-secondary hover:bg-wa-border"
              }`}
            >
              <Clock className="h-3 w-3" />
              Realistic
            </button>
          </div>
          <p className="text-xs text-wa-text-tertiary">
            {(simulation.typingMode || "instant") === "instant"
              ? "Messages appear quickly without typing animation"
              : "Simulates realistic typing in the input box"}
          </p>
        </div>
        </div>

        {/* Messages List */}
        <div className="px-4 py-6">
          <div className="space-y-3">
            {simulation.messages.length === 0 ? (
              <div className="text-center py-12 text-wa-text-secondary">
                <p className="text-sm mb-4">
                  No messages yet. Add your first message to start building the
                  conversation.
                </p>
              </div>
            ) : (
              simulation.messages.map((message, index) => (
                <MessageEditorItem
                  key={message.id}
                  message={message}
                  onUpdate={(updated) => handleUpdateMessage(index, updated)}
                  onDelete={() => handleDeleteMessage(index)}
                  onMoveUp={() => handleMoveMessage(index, "up")}
                  onMoveDown={() => handleMoveMessage(index, "down")}
                  canMoveUp={index > 0}
                  canMoveDown={index < simulation.messages.length - 1}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Footer - Add Message Buttons */}
      <div className="border-t border-wa-border p-4 flex-shrink-0">
        <div className="flex gap-3">
          <Button
            onClick={() => handleAddMessage(true)}
            className="flex-1 bg-wa-bg-sender hover:bg-wa-bg-sender/80 text-wa-text-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your Message
          </Button>
          <Button
            onClick={() => handleAddMessage(false)}
            className="flex-1 bg-wa-bg-recipient hover:bg-wa-bg-recipient/80 text-wa-text-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Their Message
          </Button>
        </div>

        <p className="text-xs text-wa-text-secondary text-center mt-3">
          Messages will play in order with the specified delays
        </p>
      </div>

      {/* Avatar Upload Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-md bg-wa-bg-secondary border-wa-border">
          <DialogHeader>
            <DialogTitle className="text-wa-text-primary">Change Avatar</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full bg-wa-bg-main overflow-hidden">
                {simulation.participantAvatar ? (
                  <img
                    src={simulation.participantAvatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-wa-text-secondary" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-wa-icon-active hover:bg-wa-icon-active/80 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload from Computer
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-wa-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-wa-bg-secondary px-2 text-wa-text-tertiary">
                  Or
                </span>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm text-wa-text-secondary">
                Paste image URL
              </label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-wa-bg-main border-wa-border text-wa-text-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {simulation.participantAvatar && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  className="flex-1 border-wa-border text-red-500 hover:bg-red-500/10"
                >
                  Remove
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSaveAvatarUrl}
                disabled={!avatarUrl.trim() || avatarUrl === simulation.participantAvatar}
                className="flex-1 bg-wa-icon-active hover:bg-wa-icon-active/80 text-white disabled:opacity-50"
              >
                Save URL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
