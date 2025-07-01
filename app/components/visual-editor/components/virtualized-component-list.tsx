"use client";

import React, { useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { ComponentData, PageData } from "../core/types";
import { allComponentConfigs as componentConfigs } from "../config/all-components";
import ComponentWrapper from "./component-wrapper";
import DropZone from "../drag-drop/drop-zone";
import NestedDropZone from "../drag-drop/nested-drop-zone";
import ColumnsDropZone from "../drag-drop/columns-drop-zone";
import { Doc } from "@/convex/_generated/dataModel";

interface VirtualizedComponentListProps {
  pageData: PageData;
  business: Doc<"businesses">;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, props: Record<string, unknown>) => void;
  onRemoveComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
  onAddComponent: (
    type: string,
    index: number,
    parentId?: string,
    metadata?: Record<string, unknown>,
  ) => void;
  onDuplicateComponent?: (id: string) => void;
  isEditMode?: boolean;
  containerHeight: number;
  onDrop: (index: number, parentId?: string) => void;
}

interface ComponentItemData {
  components: ComponentData[];
  business: Doc<"businesses">;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, props: Record<string, unknown>) => void;
  onRemoveComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
  onAddComponent: (
    type: string,
    index: number,
    parentId?: string,
    metadata?: Record<string, unknown>,
  ) => void;
  onDuplicateComponent?: (id: string) => void;
  isEditMode: boolean;
  onDrop: (index: number, parentId?: string) => void;
}

const ITEM_HEIGHT = 120; // Estimated height per component
const MIN_COMPONENTS_FOR_VIRTUALIZATION = 20; // Only virtualize if more than 20 components

const ComponentItem = React.memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: ComponentItemData;
  }) => {
    const {
      components,
      business,
      selectedComponentId,
      onSelectComponent,
      onUpdateComponent,
      onRemoveComponent,
      onMoveComponent,
      onAddComponent,
      onDuplicateComponent,
      isEditMode,
      onDrop,
    } = data;

    const component = components[index];
    const config = component ? componentConfigs[component.type] : null;

    const renderComponent = useCallback(
      (comp: ComponentData): React.ReactNode => {
        if (!config) return null;
        const componentProps = {
          ...comp.props,
          business,
        };

        let children: React.ReactNode = null;
        if (
          config.acceptsChildren &&
          comp.children &&
          comp.children.length > 0
        ) {
          if (comp.type === "ColumnsBlock") {
            const columnCount = parseInt((comp.props.columns as string) || "2");
            const columnContents: React.ReactNode[][] = Array(columnCount)
              .fill(null)
              .map(() => []);

            comp.children.forEach((child, childIndex) => {
              let columnIndex = child.metadata?.columnIndex as
                | number
                | undefined;

              if (columnIndex === undefined || columnIndex >= columnCount) {
                columnIndex = childIndex % columnCount;
              }

              const safeColumnIndex = Math.min(
                Math.max(0, columnIndex),
                columnCount - 1,
              );

              const childNode = (
                <ComponentWrapper
                  key={child.id}
                  component={child}
                  isSelected={selectedComponentId === child.id}
                  isEditMode={isEditMode}
                  onSelect={() => onSelectComponent(child.id)}
                  onRemove={() => onRemoveComponent(child.id)}
                  onMove={() => {}}
                  onDuplicate={
                    onDuplicateComponent
                      ? () => onDuplicateComponent(child.id)
                      : undefined
                  }
                  canMoveUp={childIndex > 0}
                  canMoveDown={childIndex < (comp.children?.length || 0) - 1}
                  isNested={true}
                >
                  {renderComponent(child)}
                </ComponentWrapper>
              );

              columnContents[safeColumnIndex].push(childNode);
            });

            children = columnContents.map((colChildren, colIndex) => (
              <div key={colIndex} className="column-content">
                {colChildren}
              </div>
            ));
          } else {
            children = comp.children.map((child, childIndex) => (
              <ComponentWrapper
                key={child.id}
                component={child}
                isSelected={selectedComponentId === child.id}
                isEditMode={isEditMode}
                onSelect={() => onSelectComponent(child.id)}
                onRemove={() => onRemoveComponent(child.id)}
                onMove={() => {}}
                onDuplicate={
                  onDuplicateComponent
                    ? () => onDuplicateComponent(child.id)
                    : undefined
                }
                canMoveUp={childIndex > 0}
                canMoveDown={childIndex < (comp.children?.length || 0) - 1}
                isNested={true}
              >
                {renderComponent(child)}
              </ComponentWrapper>
            ));
          }
        }

        const handleUpdate = (newProps: Record<string, unknown>) => {
          onUpdateComponent(comp.id, newProps);
        };

        return config.render(
          componentProps,
          isEditMode,
          business,
          children,
          handleUpdate,
        );
      },
      [
        business,
        isEditMode,
        onSelectComponent,
        onUpdateComponent,
        config,
        onRemoveComponent,
        onDuplicateComponent,
        selectedComponentId,
      ],
    );

    if (!component) return null;

    return (
      <div style={style}>
        {/* Drop zone before component */}
        {isEditMode && (
          <DropZone id={`drop-zone-${index}`} index={index} onDrop={onDrop} />
        )}

        {/* Component */}
        {config?.acceptsChildren ? (
          (() => {
            const DropZoneComponent =
              component.type === "ColumnsBlock"
                ? ColumnsDropZone
                : NestedDropZone;
            return (
              <DropZoneComponent
                component={component}
                business={business}
                selectedComponentId={selectedComponentId}
                onSelectComponent={onSelectComponent}
                onUpdateComponent={onUpdateComponent}
                onRemoveComponent={onRemoveComponent}
                onAddComponent={onAddComponent}
                onDuplicateComponent={onDuplicateComponent}
                isEditMode={isEditMode}
                onMove={(direction) => {
                  const newIndex = direction === "up" ? index - 1 : index + 1;
                  if (newIndex >= 0 && newIndex < components.length) {
                    onMoveComponent(index, newIndex);
                  }
                }}
                canMoveUp={index > 0}
                canMoveDown={index < components.length - 1}
              />
            );
          })()
        ) : (
          <ComponentWrapper
            component={component}
            isSelected={selectedComponentId === component.id}
            isEditMode={isEditMode}
            onSelect={() => onSelectComponent(component.id)}
            onRemove={() => onRemoveComponent(component.id)}
            onMove={(direction) => {
              const newIndex = direction === "up" ? index - 1 : index + 1;
              if (newIndex >= 0 && newIndex < components.length) {
                onMoveComponent(index, newIndex);
              }
            }}
            onDuplicate={
              onDuplicateComponent
                ? () => onDuplicateComponent(component.id)
                : undefined
            }
            canMoveUp={index > 0}
            canMoveDown={index < components.length - 1}
          >
            {renderComponent(component)}
          </ComponentWrapper>
        )}

        {/* Drop zone after last component */}
        {isEditMode && index === components.length - 1 && (
          <DropZone
            id={`drop-zone-${index + 1}`}
            index={index + 1}
            onDrop={onDrop}
          />
        )}
      </div>
    );
  },
);

ComponentItem.displayName = "ComponentItem";

export default function VirtualizedComponentList({
  pageData,
  business,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onRemoveComponent,
  onMoveComponent,
  onAddComponent,
  onDuplicateComponent,
  isEditMode = true,
  containerHeight,
  onDrop,
}: VirtualizedComponentListProps) {
  const shouldVirtualize =
    pageData.components.length > MIN_COMPONENTS_FOR_VIRTUALIZATION;

  const itemData = useMemo(
    () => ({
      components: pageData.components,
      business,
      selectedComponentId,
      onSelectComponent,
      onUpdateComponent,
      onRemoveComponent,
      onMoveComponent,
      onAddComponent,
      onDuplicateComponent,
      isEditMode,
      onDrop,
    }),
    [
      pageData.components,
      business,
      selectedComponentId,
      onSelectComponent,
      onUpdateComponent,
      onRemoveComponent,
      onMoveComponent,
      onAddComponent,
      onDuplicateComponent,
      isEditMode,
      onDrop,
    ],
  );

  if (!shouldVirtualize) {
    // Return null to indicate non-virtualized rendering should be used
    return null;
  }

  return (
    <List
      height={containerHeight}
      width="100%"
      itemCount={pageData.components.length}
      itemSize={ITEM_HEIGHT}
      itemData={itemData}
      overscanCount={5} // Render 5 extra items outside viewport for smooth scrolling
    >
      {ComponentItem}
    </List>
  );
}
