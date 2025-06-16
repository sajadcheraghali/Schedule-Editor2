
import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./SortableItem";

// اینترفیس برای یک عملیات واحد در داخل تراکنش
interface TransactionOperation {
  id: string;
  label: string; // این label اکنون یک رشته JSON مانند "[\"W\",\"varName\",\"context\"]" خواهد بود
}

// اینترفیس برای کل ساختار داده تراکنش
interface TransactionData {
  name: string;
  operations: TransactionOperation[];
}

// پراپ‌های کامپوننت Transaction
interface TransactionProps {
  transaction: TransactionData;
  onAddOperation: (transactionName: string, label: string) => void;
  onDeleteOperation: (transactionName: string, operationId: string) => void;
  // onSortOperations در اینجا مورد نیاز نیست اگر مرتب‌سازی توسط یک DndContext در سطح بالاتر مدیریت شود
}

// کامپوننت اصلی Transaction
const Transaction = ({ transaction, onAddOperation, onDeleteOperation }: TransactionProps) => {
  // بررسی دفاعی: اگر پراپ transaction تعریف نشده باشد، null را برمی‌گرداند تا از بروز خطا جلوگیری شود.
  if (!transaction) {
    return null;
  }

  // متغیرهای حالت برای فیلدهای ورودی جدید (نوع عملیات، نام متغیر، زمینه)
  const [operationType, setOperationType] = useState<"W" | "R" | "C" | "A">("W"); // پیش‌فرض: Write
  const [variableName, setVariableName] = useState("");
  const [operationContext, setOperationContext] = useState("");

  // هوک useSortable برای قابل درگ کردن کل کارت تراکنش.
  // id، نام تراکنش است که امکان مرتب‌سازی تراکنش‌ها را فراهم می‌کند.
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: transaction.name });

  // اعمال استایل‌های transform و transition برای انیمیشن‌های روان درگ و دراپ
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // هندلر برای افزودن یک عملیات جدید
  const handleAddOperation = () => {
    // تنها در صورتی اضافه می‌شود که نام متغیر و زمینه عملیات خالی نباشند
    if (variableName.trim() && operationContext.trim()) {
      // ایجاد یک آرایه که نمایانگر payload عملیات برای بک‌اند است
      const backendPayload = [operationContext.trim(),operationType, variableName.trim()];
      // آرایه را به یک رشته برای ذخیره به عنوان یک برچسب واحد تبدیل می‌کنیم
      const labelForOperation = JSON.stringify(backendPayload);

      // فراخوانی تابع onAddOperation والد با نام تراکنش و برچسب جدید
      onAddOperation(transaction.name, labelForOperation);

      // بازنشانی فیلدهای ورودی پس از افزودن
      setVariableName("");
      setOperationContext("");
      setOperationType("W"); // بازنشانی نوع عملیات به حالت پیش‌فرض
    }
  };

  return (
    // کانتینر اصلی برای کارت تراکنش، که اکنون قابل درگ است
    <div
      ref={setNodeRef}
      style={{
        ...style, // اعمال استایل‌های D&D transform
        minWidth: "250px", // حداقل عرض برای کارت
        maxWidth: "300px", // حداکثر عرض برای کارت
        flexGrow: 1, // امکان رشد کارت در یک کانتینر فلکس را می‌دهد
      }}
      // کلاس‌های بوت‌استرپ برای استایل‌دهی کارت
      className="card p-3 m-2 shadow border border-light d-flex flex-column rounded-3"
    >
      {/* هدر تراکنش، که همچنین دسته درگ برای کل کارت است */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab" }} // کرسر سفارشی برای نشان دادن قابل درگ بودن
        className="card-header text-center mb-3 bg-info-subtle rounded-3 fw-semibold fs-5 shadow-sm py-2"
      >
        <h5 className="m-0 text-dark">{transaction.name}</h5>
      </div>

      {/* SortableContext برای عملیات‌های داخل این تراکنش */}
      <SortableContext items={transaction.operations.map(op => op.id)} strategy={verticalListSortingStrategy}>
        <ul
          className="list-group mb-3 overflow-auto flex-grow-1" // لیست گروه بوت‌استرپ، overflow-auto برای اسکرول
          style={{ maxHeight: "15rem" }} // حداکثر ارتفاع برای فعال کردن اسکرول برای عملیات‌های زیاد
        >
          {/* پیمایش در عملیات‌ها و رندر SortableItem برای هر کدام */}
          {transaction.operations.map((op) => (
            <SortableItem
              key={op.id}
              id={op.id}
              label={op.label}
            />
          ))}
        </ul>
      </SortableContext>

      {/* بخش ورودی برای افزودن عملیات جدید */}
      <div className="card-body p-3 bg-light rounded-3 border border-light mt-auto">
           {/* ورودی زمینه عملیات */}
        <div className="mb-3">
          <label htmlFor="operation-context" className="form-label small fw-medium text-dark">
            نام تراکنش:
          </label>
          <input
            id="operation-context"
            type="text"
            className="form-control form-control-sm"
            placeholder="نام تراکنش را وارد کنید"
            value={operationContext}
            onChange={(e) => setOperationContext(e.target.value)}
          />
        </div>

        {/* دراپ‌داون نوع عملیات */}
        <div className="mb-2">
          <label htmlFor="operation-type" className="form-label small fw-medium text-dark">
            نوع عملیات:
          </label>
          <select
            id="operation-type"
            className="form-select form-select-sm"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as "W" | "R" | "C")}
          >
            <option value="W">W (نوشتن)</option>
            <option value="R">R (خواندن)</option>
            <option value="C">C (تایید)</option>
            <option value="A">A (لغو)</option>
          </select>
        </div>

        {/* ورودی نام متغیر */}
        <div className="mb-2">
          <label htmlFor="variable-name" className="form-label small fw-medium text-dark">
            نام متغیر:
          </label>
          <input
            id="variable-name"
            type="text"
            className="form-control form-control-sm"
            placeholder="نام متغیر را وارد کنید"
            value={variableName}
            onChange={(e) => setVariableName(e.target.value)}
          />
        </div>

       

        {/* دکمه افزودن عملیات */}
        <button
          className="btn btn-primary w-100 btn-sm"
          onClick={handleAddOperation}
          // دکمه را در صورتی که فیلدهای مورد نیاز خالی باشند، غیرفعال می‌کند
          disabled={!variableName.trim() || !operationContext.trim()}
        >
          افزودن
        </button>
      </div>
    </div>
  );
};
export default Transaction;