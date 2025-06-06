'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Message {
  _id: Id<"contactMessages">;
  businessId: Id<"businesses">;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "unread" | "read" | "responded";
  createdAt: number;
  updatedAt?: number;
}

interface MessageListProps {
  initialMessages: Message[];
}

export default function MessageList({ initialMessages }: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const markAsRead = useMutation(api.contactMessages.markAsRead);
  const markAsResponded = useMutation(api.contactMessages.markAsResponded);

  const handleMarkAsRead = async (messageId: Id<"contactMessages">) => {
    await markAsRead({ messageId });
    setMessages(messages.map(msg => 
      msg._id === messageId ? { ...msg, status: "read" as const } : msg
    ));
  };

  const handleMarkAsResponded = async (messageId: Id<"contactMessages">) => {
    await markAsResponded({ messageId });
    setMessages(messages.map(msg => 
      msg._id === messageId ? { ...msg, status: "responded" as const } : msg
    ));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No messages yet. Messages from your contact form will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        messages.map((message) => (
          <Card key={message._id} className={cn(
            "transition-colors",
            message.status === "unread" && "border-primary shadow-sm"
          )}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{message.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">
                      {message.email}
                    </a>
                    {message.phone && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <a href={`tel:${message.phone}`} className="text-sm text-primary hover:underline">
                          {message.phone}
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    message.status === "unread" 
                      ? "bg-blue-100 text-blue-800" 
                      : message.status === "read"
                      ? "bg-muted text-foreground"
                      : "bg-green-100 text-green-800"
                  )}>
                    {message.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap mb-4">{message.message}</p>
              <div className="flex gap-2">
                {message.status === "unread" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAsRead(message._id)}
                  >
                    Mark as Read
                  </Button>
                )}
                {message.status !== "responded" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkAsResponded(message._id)}
                  >
                    Mark as Responded
                  </Button>
                )}
                <Button
                  size="sm"
                  asChild
                >
                  <a href={`mailto:${message.email}?subject=Re: Contact Form Submission`}>
                    Reply via Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}