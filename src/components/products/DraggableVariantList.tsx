// src/components/products/DraggableVariantList.tsx
"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaTimes } from "react-icons/fa";
import type { Item } from "@/types";
import Image from "next/image";

// Draggable item component
function DraggableVariantItem({
  item,
  index,
  onRemove,
}: {
  item: Item;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <FaGripVertical className="text-gray-400" />
      </div>

      {/* Order number */}
      <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
        {index + 1}
      </div>

      {/* Image */}
      <Image
        src={item.image || "/placeholder.png"}
        alt={item.name}
        width={500}
        height={500}
        className="w-12 h-12 rounded-lg object-cover"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {item.name}
        </p>
        <p className="text-xs text-gray-500">{item.code}</p>
      </div>

      {/* Type & Color */}
      {item.type && (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
          {item.type}
        </span>
      )}
      {item.color && (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
          {item.color}
        </span>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
}

// Parent draggable list
export function DraggableVariantList({
  variants,
  onReorder,
  onRemove,
}: {
  variants: Item[];
  onReorder: (newOrder: Item[]) => void;
  onRemove: (id: number) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = variants.findIndex((v) => v.id === active.id);
      const newIndex = variants.findIndex((v) => v.id === over.id);
      const newOrder = arrayMove(variants, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (variants.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="text-sm">Belum ada variant dipilih</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={variants.map((v) => v.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {variants.map((item, index) => (
            <DraggableVariantItem
              key={item.id}
              item={item}
              index={index}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
