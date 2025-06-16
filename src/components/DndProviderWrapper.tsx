"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import { useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";

import DragOverlayComponent from "./DragOverlayComponent";
import TransactionList from "./TransactionList";
import TrashBin from "./TrashBin";

export interface Operation {
  id: string;
  label: string;
}

export interface TransactionType {
  name: string;
  operations: Operation[];
}

export const initialTransactions: TransactionType[] = [
  {
    name: "Schedule-1",
    operations: [
      { id: "T25-write-Q", label: JSON.stringify(["T1","R","x"]) },
      { id: "T25-read-Q", label: JSON.stringify(["T2","W","a"]) },
    ],
  },
];

const DndProviderWrapper = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>(initialTransactions);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ label?: string; name?: string } | null>(null);
  const [draggedType, setDraggedType] = useState<"operation" | "transaction" | null>(null);

const navigate = useNavigate();

  const findItem = (id: string) => {
    for (const tx of transactions) {
      const item = tx.operations.find((op) => op.id === id);
      if (item) return { item, tx, isTx: false };
    }

    const tx = transactions.find((tx) => tx.name === id);
    if (tx) return { tx, isTx: true };

    return { item: null, tx: null, isTx: false };
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const { item, tx, isTx } = findItem(active.id);

    if (isTx) {
      setDraggedItem({ name: active.id });
      setDraggedType("transaction");
    } else if (item && tx) {
      setDraggedItem(item);
      setDraggedType("operation");
    }

    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || !activeId) return;

    if (over.id === "trash-bin") {
      const { isTx } = findItem(active.id);

      if (isTx) {
        if (window.confirm(`Are you sure you want to delete transaction "${active.id}"?`)) {
          setTransactions((prev) => prev.filter((tx) => tx.name !== active.id));
        }
      } else {
        setTransactions((prev) =>
          prev.map((tx) => ({
            ...tx,
            operations: tx.operations.filter((op) => op.id !== active.id),
          }))
        );
      }

      setActiveId(null);
      setDraggedItem(null);
      setDraggedType(null);
      return;
    }

    const oldTx = transactions.find((tx) =>
      tx.operations.some((op) => op.id === active.id)
    );

    const newTx = transactions.find((tx) =>
      tx.operations.some((op) => op.id === over.id)
    );

    if (oldTx && newTx && oldTx.name === newTx.name) {
      const ops = oldTx.operations;
      const oldIndex = ops.findIndex((op) => op.id === active.id);
      const newIndex = ops.findIndex((op) => op.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const movedOps = arrayMove(ops, oldIndex, newIndex);
        setTransactions((prev) =>
          prev.map((tx) => (tx.name === oldTx.name ? { ...tx, operations: movedOps } : tx))
        );
      }
    }

    setActiveId(null);
    setDraggedItem(null);
    setDraggedType(null);
  };

  const handleAddOperation = (transactionName: string, label: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.name !== transactionName) return tx;
        const newOp: Operation = {
          id: `${tx.name}-op-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
          label,
        };
        return {
          ...tx,
          operations: [...tx.operations, newOp],
        };
      })
    );
  };

  const handleDeleteOperation = (transactionName: string, id: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.name !== transactionName) return tx;
        return {
          ...tx,
          operations: tx.operations.filter((op) => op.id !== id),
        };
      })
    );
  };

  const addTransaction = (name: string) => {
    setTransactions((prev) => [...prev, { name, operations: [] }]);
  };

  const handleExport = () => {
    localStorage.setItem("export-transactions", JSON.stringify(transactions));
    navigate("/export");
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <TrashBin />
        <TransactionList
          transactions={transactions}
          onAddOperation={handleAddOperation}
          onDeleteOperation={handleDeleteOperation}
          onAddTransaction={addTransaction}
        />
        <DragOverlayComponent
          activeId={activeId}
          draggedItem={draggedItem}
          isTransaction={draggedType === "transaction"}
        />
      </DndContext>

      {/* ✅ دکمه نمایش JSON */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-success" onClick={handleExport}>
          نمایش JSON تراکنش‌ها
        </button>
      </div>
    </>
  );
};

export default DndProviderWrapper;
