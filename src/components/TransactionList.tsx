// src/components/TransactionList.tsx

import React, { useState } from "react";
import Transaction from "./Transaction";

interface Props {
  transactions: {
    name: string;
    operations: {
      id: string;
      label: string;
    }[];
  }[];
  onAddOperation: (name: string, label: string) => void;
  onDeleteOperation: (name: string, id: string) => void;
  onAddTransaction: (name: string) => void; // 👈 اضافه کردن این پراپ
}

const TransactionList = ({
  transactions,
  onAddOperation,
  onDeleteOperation,
  onAddTransaction, // 👈 دریافت آن از props
}: Props) => {
  const [newTxName, setNewTxName] = useState("");

  const handleAddTransaction = () => {
    if (newTxName.trim()) {
      onAddTransaction(newTxName.trim());
      setNewTxName("");
    }
  };

  return (
    <div className="d-flex gap-3 flex-wrap justify-content-center">
      {/* Form for new transaction */}
      <div className="car p-3" style={{ minWidth: "250px", maxWidth: "300px" }}>
        <h5 className="text-center mb-3">Add New Schedule</h5>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter Schedule name"
            value={newTxName}
            onChange={(e) => setNewTxName(e.target.value)}
          />
          <button
            className="btn btn-success btn-sm"
            onClick={handleAddTransaction}
            disabled={!newTxName.trim()}
          >
            Add
          </button>
        </div>
      </div>

      {/* Existing Transactions */}
      {transactions.map((tx) => (
        <Transaction
          key={`transaction-${tx.name}`}
          transaction={tx}
          onAddOperation={onAddOperation}
          onDeleteOperation={onDeleteOperation}
        />
      ))}
    </div>
  );
};

export default TransactionList;