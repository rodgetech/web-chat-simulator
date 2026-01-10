"use client";

import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { SimulatedMessage } from "@/types/simulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";

interface MessageEditorItemProps {
  message: SimulatedMessage;
  onUpdate: (message: SimulatedMessage) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function MessageEditorItem({
  message,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: MessageEditorItemProps) {
  const [isEditing, setIsEditing] = useState(message.content === "");
  const [editedContent, setEditedContent] = useState(message.content);
  const [editedDelay, setEditedDelay] = useState(
    Math.round(message.delayMs / 1000)
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate({
      ...message,
      content: editedContent,
      delayMs: editedDelay * 1000,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setEditedDelay(Math.round(message.delayMs / 1000));
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-2 p-3 bg-wa-bg-secondary rounded-lg border border-wa-border hover:border-wa-border-hover transition-colors">
      {/* Reorder buttons */}
      <div className="flex flex-col gap-1 pt-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveUp}
          disabled={!canMoveUp}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveDown}
          disabled={!canMoveDown}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-2">
        {/* Header with sender and delay */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              message.isOwnMessage
                ? "text-wa-text-secondary"
                : "text-wa-text-primary"
            }`}
          >
            {message.isOwnMessage ? "You" : "Them"}
          </span>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-wa-text-secondary">Delay:</span>
              <Input
                type="number"
                min="0"
                value={editedDelay}
                onChange={(e) => setEditedDelay(Number(e.target.value))}
                className="w-20 h-7 text-sm"
              />
              <span className="text-xs text-wa-text-secondary">seconds</span>
            </div>
          ) : (
            <span className="text-xs text-wa-text-secondary">
              Wait {Math.round(message.delayMs / 1000)}s then send
            </span>
          )}
        </div>

        {/* Message content */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[60px] resize-none"
              placeholder="Enter message content..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`p-2 rounded-md ${
              message.isOwnMessage
                ? "bg-wa-bg-sender text-wa-text-primary"
                : "bg-wa-bg-recipient text-wa-text-primary"
            } max-w-[80%] cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={() => setIsEditing(true)}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div className="flex gap-1 pt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
