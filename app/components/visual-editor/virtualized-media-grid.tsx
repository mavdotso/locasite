"use client";

import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { Badge } from "@/app/components/ui/badge";
import { ImageIcon, File } from "lucide-react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface MediaFile {
  _id: Id<"mediaLibrary">;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  folder?: string;
  alt?: string;
  tags: string[];
  usageCount: number;
  dimensions?: { width: number; height: number };
  createdAt: number;
}

interface VirtualizedMediaGridProps {
  files: MediaFile[];
  selectedFiles: string[];
  onFileSelect: (file: MediaFile) => void;
  containerWidth: number;
  containerHeight: number;
}

interface GridItemData {
  files: MediaFile[];
  selectedFiles: string[];
  onFileSelect: (file: MediaFile) => void;
  columnCount: number;
}

const ITEM_WIDTH = 180;
const ITEM_HEIGHT = 200;
const MIN_FILES_FOR_VIRTUALIZATION = 50;

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const renderFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const GridItem = React.memo(
  ({
    columnIndex,
    rowIndex,
    style,
    data,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data: GridItemData;
  }) => {
    const { files, selectedFiles, onFileSelect, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    const file = files[index];

    if (!file) {
      return <div style={style} />;
    }

    const isSelected = selectedFiles.includes(file._id);

    return (
      <div style={style}>
        <div
          className={`relative group cursor-pointer border rounded-lg overflow-hidden hover:border-primary transition-colors m-2 ${
            isSelected ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => onFileSelect(file)}
        >
          {file.fileType.startsWith("image/") ? (
            <Image
              src={file.url}
              alt={file.alt || file.fileName}
              width={160}
              height={120}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-muted">
              {renderFileIcon(file.fileType)}
            </div>
          )}

          <div className="p-2">
            <p className="text-xs font-medium truncate">{file.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.fileSize)}
            </p>
          </div>

          {file.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {file.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

GridItem.displayName = "GridItem";

export default function VirtualizedMediaGrid({
  files,
  selectedFiles,
  onFileSelect,
  containerWidth,
  containerHeight,
}: VirtualizedMediaGridProps) {
  const shouldVirtualize = files.length > MIN_FILES_FOR_VIRTUALIZATION;

  const columnCount = Math.floor(containerWidth / ITEM_WIDTH);
  const rowCount = Math.ceil(files.length / columnCount);

  const itemData = useMemo(
    () => ({
      files,
      selectedFiles,
      onFileSelect,
      columnCount,
    }),
    [files, selectedFiles, onFileSelect, columnCount],
  );

  if (!shouldVirtualize) {
    // Return null to indicate non-virtualized rendering should be used
    return null;
  }

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={ITEM_WIDTH}
      height={containerHeight}
      rowCount={rowCount}
      rowHeight={ITEM_HEIGHT}
      width={containerWidth}
      itemData={itemData}
      overscanRowCount={2}
      overscanColumnCount={2}
    >
      {GridItem}
    </Grid>
  );
}
