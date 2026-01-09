"use client";

import { Plus, User } from "lucide-react";
import type { SimulatedConversation, SimulatedMessage } from "@/types/simulation";
import { MessageEditorItem } from "./message-editor-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { nanoid } from "nanoid";

interface SimulationEditorProps {
  simulation: SimulatedConversation;
  onUpdate: (simulation: SimulatedConversation) => void;
}

export function SimulationEditor({
  simulation,
  onUpdate,
}: SimulationEditorProps) {
  const handleUpdateParticipantName = (name: string) => {
    onUpdate({ ...simulation, participantName: name });
  };

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
      {/* Header - Conversation Settings */}
      <div className="border-b border-wa-border p-4 space-y-4">
        <h3 className="text-sm font-semibold text-wa-text-primary">
          Conversation Settings
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-wa-bg-secondary">
            <User className="h-5 w-5 text-wa-text-secondary" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-wa-text-secondary block mb-1">
              Participant Name
            </label>
            <Input
              value={simulation.participantName}
              onChange={(e) => handleUpdateParticipantName(e.target.value)}
              placeholder="Enter name..."
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <ScrollArea className="flex-1 px-4 py-6">
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
        </div>
      </ScrollArea>

      {/* Footer - Add Message Buttons */}
      <div className="border-t border-wa-border p-4">
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
    </div>
  );
}
