import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  label: string; // رشته JSON مانند "["W","x","T1"]"
}

const SortableItem = ({ id, label }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "grab",
  };

  // تبدیل label به فرم ساده‌تر برای نمایش
  let readableLabel = label;
  try {
    const parsed = JSON.parse(label);
    if (Array.isArray(parsed)) {
      readableLabel = `[${parsed.join(", ")}]`;
    }
  } catch (e) {
    // اگر JSON.parse خطا دهد، همان مقدار خام را نشان می‌دهیم
    readableLabel = label;
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-group-item text-dark fw-medium"
    >
      <span>{readableLabel}</span>
    </li>
  );
};

export default SortableItem;
