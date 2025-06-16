// src/components/DragOverlayComponent.tsx

import React from "react";
import { DragOverlay } from "@dnd-kit/core";

interface Props {
  activeId: string | null;
  draggedItem: { label?: string; name?: string } | null;
  isTransaction?: boolean;
}

const DragOverlayComponent = ({ activeId, draggedItem, isTransaction }: Props) => {
  return (
    <DragOverlay
    dropAnimation={{
  duration: 200,
 
}}>
      {activeId ? (
        <div
          style={{
            cursor: "grabbing",
            backgroundColor: "#f0f0f0",
            padding: "8px",
            borderRadius: "4px",
            fontWeight: isTransaction ? "bold" : "normal",
             transform: "translate3d(0, 0, 0)", //  برای بهینه‌سازی GPU
            willChange: "transform", //  بهترین عملکرد روی موبایل
          }}
        >
          {isTransaction ? `Transaction: ${draggedItem?.name}` : draggedItem?.label}
        </div>
      ) : null}
    </DragOverlay>
  );
};

export default DragOverlayComponent;