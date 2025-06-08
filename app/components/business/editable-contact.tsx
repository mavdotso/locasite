"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface EditableContactProps {
  title?: string;
  subtitle?: string;
  onTitleChange?: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  isEditing?: boolean;
  className?: string;
}

export default function EditableContact({ 
  title = "Contact Us", 
  subtitle = "Get in touch with us",
  onTitleChange,
  onSubtitleChange,
  isEditing = false,
  className 
}: EditableContactProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = (e: React.MouseEvent, onChange?: (value: string) => void) => {
    if (!isEditing || !onChange) return;
    
    const element = e.target as HTMLElement;
    element.contentEditable = 'true';
    element.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleBlur = (e: React.FocusEvent, onChange?: (value: string) => void, originalValue?: string) => {
    const element = e.target as HTMLElement;
    element.contentEditable = 'false';
    const newValue = element.innerText;
    if (onChange && newValue !== originalValue) {
      onChange(newValue);
    }
  };

  return (
    <section 
      className={cn("py-16 bg-muted/30", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className={cn(
              "text-3xl font-bold mb-4 transition-all",
              isEditing && isHovered && "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1 cursor-text"
            )}
            onClick={(e) => handleEdit(e, onTitleChange)}
            onBlur={(e) => handleBlur(e, onTitleChange, title)}
            suppressContentEditableWarning={true}
          >
            {title}
          </h2>
          
          <p 
            className={cn(
              "text-lg text-muted-foreground transition-all",
              isEditing && isHovered && "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1 cursor-text"
            )}
            onClick={(e) => handleEdit(e, onSubtitleChange)}
            onBlur={(e) => handleBlur(e, onSubtitleChange, subtitle)}
            suppressContentEditableWarning={true}
          >
            {subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="your@email.com" className="mt-1" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone (optional)</label>
                <Input type="tel" placeholder="Your phone number" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Tell us about your inquiry..." 
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <Button className="w-full">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}