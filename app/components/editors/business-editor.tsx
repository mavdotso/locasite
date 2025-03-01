"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";

interface BusinessEditorProps {
  business: {
    _id: Id<"businesses">;
    name: string;
    description?: string;
    address: string;
    phone?: string;
    website?: string;
    hours: string[];
  };
  onClose?: () => void;
}

export default function BusinessEditor({ business, onClose }: BusinessEditorProps) {
  const updateBusiness = useMutation(api.businesses.update);
  const [formData, setFormData] = useState({
    name: business.name,
    description: business.description || "",
    address: business.address,
    phone: business.phone || "",
    website: business.website || "",
    hours: business.hours,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateBusiness({
        id: business._id,
        business: formData,
      });
      setIsEditing(false);
      toast.success("Business updated", {
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving business:", error);
      toast.error("Error", {
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateHours = (index: number, value: string) => {
    setFormData((prev) => {
      const newHours = [...prev.hours];
      newHours[index] = value;
      return { ...prev, hours: newHours };
    });
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsEditing(true)}>Edit Business Information</Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Edit Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Business Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-sm">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[150px]"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-sm">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-sm">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-sm">Website</label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-sm">Business Hours</label>
            <div className="space-y-2">
              {formData.hours.map((hour, index) => (
                <Input
                  key={index}
                  value={hour}
                  onChange={(e) => updateHours(index, e.target.value)}
                  className="w-full"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, hours: [...formData.hours, ""] })}
              >
                Add Hours
              </Button>
            </div>
          </div>
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