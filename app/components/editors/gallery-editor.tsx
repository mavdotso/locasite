"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { X } from "lucide-react";

interface GalleryEditorProps {
  business: {
    _id: Id<"businesses">;
    photos: string[];
  };
  onClose?: () => void;
}

export default function GalleryEditor({ business, onClose }: GalleryEditorProps) {
  const updateBusinessPhotos = useMutation(api.businesses.updatePhotos);
  const [photos, setPhotos] = useState<string[]>(business.photos);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateBusinessPhotos({
        id: business._id,
        photos,
      });
      setIsEditing(false);
      toast.success("Gallery updated", {
        description: "Your photo gallery has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving photos:", error);
      toast.error("Error", {
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const movePhoto = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === photos.length - 1)
    ) {
      return;
    }

    const newPhotos = [...photos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
    setPhotos(newPhotos);
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsEditing(true)}>Edit Photo Gallery</Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Edit Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Enter photo URL"
              className="flex-1"
            />
            <Button onClick={addPhoto}>Add Photo</Button>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={photo}
                  alt={`Gallery photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="top-2 right-2 absolute w-8 h-8"
                  onClick={() => removePhoto(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardFooter className="flex justify-between p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePhoto(index, "up")}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <span className="text-gray-500 text-sm">#{index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePhoto(index, "down")}
                  disabled={index === photos.length - 1}
                >
                  ↓
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setIsEditing(false);
          onClose?.();
        }}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}