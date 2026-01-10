"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import type { SimulatedConversation } from "@/types/simulation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (simulation: SimulatedConversation) => void;
}

export function CreateSimulationDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateSimulationDialogProps) {
  const [conversationName, setConversationName] = useState("");
  const [participantName, setParticipantName] = useState("");

  const handleCreate = () => {
    if (!conversationName.trim() || !participantName.trim()) {
      return;
    }

    const simulationId = nanoid();
    const chatId = `sim-${simulationId}`;

    const newSimulation: SimulatedConversation = {
      id: simulationId,
      chatId,
      name: conversationName.trim(),
      participantName: participantName.trim(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onCreate(newSimulation);

    // Reset form and close
    setConversationName("");
    setParticipantName("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setConversationName("");
    setParticipantName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Simulation</DialogTitle>
          <DialogDescription>
            Set up a new simulated conversation. You can add messages and
            configure timing after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="conversation-name"
              className="text-sm font-medium text-wa-text-primary"
            >
              Conversation Name
            </label>
            <Input
              id="conversation-name"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="e.g., Morning Chat"
              className="w-full"
            />
            <p className="text-xs text-wa-text-secondary">
              For your reference - not shown in the chat
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="participant-name"
              className="text-sm font-medium text-wa-text-primary"
            >
              Participant Name
            </label>
            <Input
              id="participant-name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full"
            />
            <p className="text-xs text-wa-text-secondary">
              The name of the person you're chatting with
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!conversationName.trim() || !participantName.trim()}
          >
            Create Simulation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
