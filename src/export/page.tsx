"use client";
import { useEffect, useState } from "react";

const ExportPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("export-transactions");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">خروجی JSON تراکنش‌ها</h2>
      <pre
        className="bg-light border rounded p-3 "
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ExportPage;
