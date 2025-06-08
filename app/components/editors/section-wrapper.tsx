"use client";

import { useState, useContext } from "react";
import { EditModeContext } from "@/components/providers/edit-mode-provider";
import { Button } from "@/components/ui/button";
import { AddSectionModal } from "@/components/editors/add-section-modal";
import { 
  Settings, 
  Trash2, 
  Palette,
  Type,
  Image as ImageIcon,
  Plus,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionType: string;
  sectionId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  className?: string;
}

export function SectionWrapper({
  children,
  sectionType,
  sectionId: _sectionId,
  onEdit,
  onDelete,
  onDuplicate,
  className
}: SectionWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const editMode = useContext(EditModeContext);
  const { isEditMode } = editMode || {};

  const handleAddSection = (newSectionType: string) => {
    // This would be handled by a parent component
    console.log("Adding section:", newSectionType);
    // In a real implementation, this would call a callback to add the section
  };

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isHovered && "ring-2 ring-blue-400 ring-opacity-50",
        isSelected && "ring-2 ring-blue-600",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(!isSelected);
      }}
    >
      {/* Section Label */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-8 left-0 z-50 bg-blue-600 text-white px-2 py-1 text-xs rounded-t-md font-medium">
          {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section
        </div>
      )}

      {/* Edit Controls */}
      {(isHovered || isSelected) && (
        <div className="absolute top-2 right-2 z-50 flex gap-1 bg-white rounded-lg shadow-lg border p-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            title="Edit Section"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Open typography panel
            }}
            title="Typography"
          >
            <Type className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Open background panel
            }}
            title="Background"
          >
            <Palette className="h-4 w-4" />
          </Button>
          
          {sectionType === 'gallery' && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                // Open gallery manager
              }}
              title="Manage Images"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.();
            }}
            title="Duplicate Section"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Delete Section"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add Section Button */}
      {(isHovered || isSelected) && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            size="sm"
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            title="Add Section Below"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Section
          </Button>
        </div>
      )}

      {/* Section Content */}
      <div className="relative">
        {children}
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSection={handleAddSection}
      />
    </div>
  );
}