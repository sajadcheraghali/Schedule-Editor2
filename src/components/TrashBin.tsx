// src/components/TrashBin.tsx

import React from "react";
import { useDroppable } from "@dnd-kit/core";

const TrashBin = () => {
  const { setNodeRef } = useDroppable({
    id: "trash-bin",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        border: "2px dashed red",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "#ffe6e6",
        zIndex: 1000,
        transition: "transform 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      🗑️
    </div>
  );
};

export default TrashBin;