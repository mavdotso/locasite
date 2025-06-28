"use client";

import { useState } from "react";
import { ComponentVariation } from "./types";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Palette } from "lucide-react";

interface VariationSelectorProps {
  variations: ComponentVariation[];
  currentVariationId?: string;
  onSelect: (variation: ComponentVariation) => void;
  trigger?: React.ReactNode;
}

export function VariationSelector({
  variations,
  currentVariationId,
  onSelect,
  trigger
}: VariationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentVariationId || variations[0]?.id);

  const handleSelect = () => {
    const variation = variations.find(v => v.id === selectedId);
    if (variation) {
      onSelect(variation);
      setOpen(false);
    }
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Palette className="h-4 w-4" />
          Style Variations
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a Style Variation</DialogTitle>
            <DialogDescription>
              Select from different design styles for this component
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            <RadioGroup
              value={selectedId}
              onValueChange={setSelectedId}
              className="space-y-4"
            >
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className="relative rounded-lg border p-4 hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedId(variation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem
                      value={variation.id}
                      id={variation.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={variation.id}
                        className="text-base font-medium cursor-pointer"
                      >
                        {variation.name}
                      </Label>
                      {variation.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {variation.description}
                        </p>
                      )}
                      
                      {/* Preview */}
                      {variation.preview ? (
                        <div className="mt-3 rounded-md overflow-hidden border">
                          <img
                            src={variation.preview}
                            alt={variation.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mt-3 rounded-md bg-muted h-32 flex items-center justify-center text-muted-foreground">
                          <span className="text-sm">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect}>
              Apply Style
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}