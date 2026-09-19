import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Warehouse,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  X,
  Info,
  Search,
  Leaf,
  Droplets,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  MoreVertical,
  Pencil,
  Trash2,
  Loader,
} from "lucide-react";
import {
  getUnitMembers,
  getStockItems,
  addStockItem,
  editStockItem,
  deleteStockItem,
  addCollection,
  getCollections,
  editCollection,
  deleteCollection,
  addDistribution,
  getDistributions,
  editDistribution,
  deleteDistribution,
} from "../../../services/api";
import useAuthStore from "../../../store/authStore";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return (
      d.toLocaleDateString("hi-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return dateStr
    .replace(
      /\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i,
      "",
    )
    .trim();
};

const UNIT_OPTIONS = ["Bags", "Kg", "Quintal", "Ton", "Litre", "Pieces"];

const stockCardColors = [
  {
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    gradient: "from-green-50 to-green-100",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  {
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    gradient: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    gradient: "from-cyan-50 to-cyan-100",
    border: "border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700",
  },
  {
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    gradient: "from-rose-50 to-rose-100",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
];

// ─── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ toast, onDone }) => {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${
        toast.type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
      style={{ animation: "slideIn .3s ease" }}
    >
      {toast.type === "success" ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      {toast.msg}
    </div>
  );
};

// ─── Add Stock Modal ───────────────────────────────────────────────────────────
const AddStockModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("Kg");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !qty || !rate) return;
    onAdd({
      name: name.trim(),
      unit,
      qty: parseInt(qty),
      rate: parseFloat(rate),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100">
              <Package size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Add New Stock Item
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Potash (25kg)"
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition bg-white"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Initial Qty
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Rate (₹ per unit)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Add to Stock
        </button>
      </div>
    </div>
  );
};

// ─── Edit Stock Modal ──────────────────────────────────────────────────────────
const EditStockModal = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [qty, setQty] = useState(String(item.qty));
  const [rate, setRate] = useState(String(item.rate));

  const handleSave = () => {
    if (!name.trim() || !qty || !rate) return;
    onSave({
      ...item,
      name: name.trim(),
      unit,
      qty: parseInt(qty),
      rate: parseFloat(rate),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100">
              <Pencil size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Stock Item
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-blue-400 outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-blue-400 outline-none transition bg-white"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Initial Qty
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-blue-400 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Rate (₹ per unit)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-blue-400 outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal (generic) ───────────────────────────────────────────
const DeleteConfirmModal = ({ label, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-red-100">
          <Trash2 size={20} className="text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Delete?</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        <span className="font-semibold text-slate-800">"{label}"</span> ko
        permanently delete kar diya jayega.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-slate-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Stock Card 3-dot Menu ─────────────────────────────────────────────────────
const StockCardMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="p-1 rounded-lg hover:bg-white/70 transition opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={16} className="text-slate-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-30 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[130px] py-1 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Record 3-dot Menu (Collection / Distribution) ────────────────────────────
const RecordMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="p-1.5 rounded-lg hover:bg-white/70 transition"
      >
        <MoreVertical size={15} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 bottom-8 z-50 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[130px] py-1 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Edit Collection Modal ─────────────────────────────────────────────────────
const EditCollectionModal = ({ record, onClose, onSave }) => {
  const [qty, setQty] = useState(String(record.qty));
  const [price, setPrice] = useState(String(record.price));
  const [note, setNote] = useState(record.note || "");

  const handleSave = () => {
    if (!qty) return;
    onSave({
      collectionId: record.id,
      qty: parseFloat(qty),
      price: parseFloat(price) || 0,
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100">
              <Pencil size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Collection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="mb-4 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Item</p>
          <p className="text-sm font-semibold text-slate-800">
            {record.itemName}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Member:{" "}
            <span className="font-medium text-slate-700">
              {record.memberName}
            </span>
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Quantity
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-green-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-green-400 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Remark..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-green-400 outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─── Edit Distribution Modal ───────────────────────────────────────────────────
const EditDistributionModal = ({ record, selectedUnit, onClose, onSave }) => {
  const [qty, setQty] = useState(String(record.qty));
  const [price, setPrice] = useState(String(record.price));
  const [note, setNote] = useState(record.note || "");

  const handleSave = () => {
    if (!qty) return;
    onSave({
      distributionId: record.id,
      stockId: record.itemId,
      groupId: selectedUnit.groupId,
      unitCode: selectedUnit.unitCode,
      qty: parseFloat(qty),
      price: parseFloat(price) || 0,
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100">
              <Pencil size={20} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Distribution
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="mb-4 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">Item</p>
          <p className="text-sm font-semibold text-slate-800">
            {record.itemName}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Member:{" "}
            <span className="font-medium text-slate-700">
              {record.memberName}
            </span>
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Quantity
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-orange-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-orange-400 outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Remark..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-orange-400 outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ─── Collection / Distribution Form Modal ─────────────────────────────────────
const FormModal = ({
  type,
  stock,
  members,
  getStockQty,
  onSubmit,
  onClose,
  setToast,
}) => {
  const isCollect = type === "collect";
  const [formItem, setFormItem] = useState("");
  const [formQty, setFormQty] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formMember, setFormMember] = useState("");
  const [formNote, setFormNote] = useState("");

  const selectedItem = stock.find((s) => String(s.id) === String(formItem));
  const currentStock = selectedItem ? getStockQty(selectedItem.id) : 0;
  const enteredQty = parseInt(formQty) || 0;

  useEffect(() => {
    if (selectedItem) setFormUnit(selectedItem.unit);
  }, [selectedItem]);

  const handleSubmit = () => {
    if (!formItem || !formQty || !formMember || enteredQty <= 0) {
      if (setToast)
        setToast({ type: "error", msg: "Sabhi fields sahi bharen" });
      return;
    }
    onSubmit({
      itemId: selectedItem.id,
      qty: enteredQty,
      memberId: formMember,
      price: parseFloat(formPrice) || 0,
      unit: formUnit || selectedItem?.unit || "",
      note: formNote,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${isCollect ? "bg-green-100" : "bg-orange-100"}`}
            >
              {isCollect ? (
                <ArrowDownToLine size={20} className="text-green-600" />
              ) : (
                <ArrowUpFromLine size={20} className="text-orange-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isCollect ? "New Collection" : "New Distribution"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Member
            </label>
            <select
              value={formMember}
              onChange={(e) => setFormMember(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition bg-white text-slate-800"
            >
              <option value="">— Select Member —</option>
              {members.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name} ({m.village})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Item
            </label>
            <select
              value={formItem}
              onChange={(e) => setFormItem(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition bg-white text-slate-800"
            >
              <option value="">— Select Item —</option>
              {stock.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name} (Stock: {getStockQty(s.id)} {s.unit})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Quantity
              </label>
              <input
                type="number"
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                Unit
              </label>
              <select
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition bg-white"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Price (₹ Total)
            </label>
            <div className="relative">
              <IndianRupee
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
              />
            </div>
            {selectedItem && enteredQty > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Default rate: ₹{selectedItem.rate}/{selectedItem.unit} ×{" "}
                {enteredQty} = ₹
                {(selectedItem.rate * enteredQty).toLocaleString()}
              </p>
            )}
          </div>
          {!isCollect && selectedItem && enteredQty > 0 && (
            <div
              className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border ${
                enteredQty > currentStock
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <Info size={14} />
              {enteredQty > currentStock
                ? `❌ Stock mein sirf ${currentStock} ${selectedItem.unit} — ${enteredQty - currentStock} zyada`
                : `Stock: ${currentStock} → ${currentStock - enteredQty} ${selectedItem.unit} (−${enteredQty})`}
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Note (optional)
            </label>
            <input
              type="text"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              placeholder="Remark..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full mt-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-[0.98] ${
            isCollect
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-orange-500 to-amber-600"
          }`}
        >
          {isCollect ? "Collect Item" : "Distribute Item"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN INVENTORY COMPONENT ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const Inventory = () => {
  const { selectedUnit } = useAuthStore();

  const [subTab, setSubTab] = useState("collection");
  const [stock, setStock] = useState([]);
  const [collections, setCollections] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [showAddStock, setShowAddStock] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchRecord, setSearchRecord] = useState("");
  const [membersData, setMembersData] = useState([]);

  // Stock edit/delete
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Collection edit/delete
  const [editCollectionRecord, setEditCollectionRecord] = useState(null);
  const [deleteCollectionRecord, setDeleteCollectionRecord] = useState(null);

  // Distribution edit/delete
  const [editDistributionRecord, setEditDistributionRecord] = useState(null);
  const [deleteDistributionRecord, setDeleteDistributionRecord] =
    useState(null);

  // ─── Fetch All Data ──────────────────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    if (!selectedUnit?.groupId || !selectedUnit?.unitCode) return;
    setLoading(true);
    try {
      const [stockData, collectionsData, distributionsData] = await Promise.all(
        [
          getStockItems(selectedUnit.groupId, selectedUnit.unitCode),
          getCollections(selectedUnit.groupId, selectedUnit.unitCode),
          getDistributions(selectedUnit.groupId, selectedUnit.unitCode),
        ],
      );
      setStock(stockData);
      setCollections(collectionsData);
      setDistributions(distributionsData);
    } catch (err) {
      setToast({ type: "error", msg: "Data load karne mein error aaya" });
    } finally {
      setLoading(false);
    }
  }, [selectedUnit]);

  // ─── Fetch Members ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedUnit?.groupId) return;
      try {
        const data = await getUnitMembers(
          selectedUnit.groupId,
          selectedUnit.unitId,
        );
        setMembersData(
          data.map((m) => ({
            id: String(m.memberProfileId),
            name: `${m.memberFirstName} ${m.memberLastName}`,
            village: m.village || "Unknown",
          })),
        );
      } catch (err) {
        console.error("Members load failed:", err);
      }
    };
    fetchMembers();
    fetchAllData();
  }, [selectedUnit, fetchAllData]);

  // ─── Stock Qty Calculator ────────────────────────────────────────────────────
  const getStockQty = useCallback(
    (itemId) => {
      const item = stock.find((s) => s.id === itemId);
      if (!item) return 0;
      const collected = collections
        .filter((c) => c.itemId === itemId)
        .reduce((s, c) => s + c.qty, 0);
      const distributed = distributions
        .filter((d) => d.itemId === itemId)
        .reduce((s, d) => s + d.qty, 0);
      return item.qty + collected - distributed;
    },
    [stock, collections, distributions],
  );

  // ─── Stock Handlers ──────────────────────────────────────────────────────────
  const handleAddStock = async (newItem) => {
    const ok = await addStockItem(
      selectedUnit.groupId,
      selectedUnit.unitCode,
      newItem.name,
      newItem.unit,
      newItem.qty,
      newItem.rate,
    );
    if (ok) {
      setToast({ type: "success", msg: `✅ ${newItem.name} added to stock` });
      fetchAllData();
    } else setToast({ type: "error", msg: "Stock item add nahi hua" });
  };

  const handleEditSave = async (updatedItem) => {
    const ok = await editStockItem(
      updatedItem.id,
      updatedItem.name,
      updatedItem.unit,
      updatedItem.qty,
      updatedItem.rate,
    );
    if (ok) {
      setToast({ type: "success", msg: `✅ ${updatedItem.name} updated` });
      fetchAllData();
    } else setToast({ type: "error", msg: "Stock item update nahi hua" });
  };

  const handleDeleteConfirm = async (itemId) => {
    const item = stock.find((s) => s.id === itemId);
    const ok = await deleteStockItem(itemId);
    if (ok) {
      setToast({ type: "success", msg: `🗑️ ${item?.name} deleted` });
      fetchAllData();
    } else setToast({ type: "error", msg: "Delete nahi hua, dobara try karo" });
  };

  // ─── Collect ─────────────────────────────────────────────────────────────────
  const handleCollect = async ({
    itemId,
    qty,
    memberId,
    price,
    unit,
    note,
  }) => {
    const item = stock.find((s) => s.id === itemId);
    const member = membersData.find((m) => String(m.id) === String(memberId));
    if (!item || !member) {
      setToast({ type: "error", msg: "Item or Member not found" });
      return;
    }
    const res = await addCollection({
      groupId: selectedUnit.groupId,
      unitCode: selectedUnit.unitCode,
      stockId: item.id,
      profileId: member.id,
      productName: item.name,
      qty,
      unit,
      price,
      note,
    });
    if (res.success) {
      setToast({
        type: "success",
        msg: `✅ ${qty} ${unit} ${item.name} collected from ${member.name}`,
      });
      fetchAllData();
      setShowForm(null);
    } else setToast({ type: "error", msg: "Collection add nahi hua" });
  };

  // ─── Edit Collection ─────────────────────────────────────────────────────────
  const handleEditCollection = async ({ collectionId, qty, price, note }) => {
    const ok = await editCollection(collectionId, qty, price, note);
    if (ok) {
      setToast({ type: "success", msg: "✅ Collection updated" });
      fetchAllData();
    } else setToast({ type: "error", msg: "Collection update nahi hua" });
  };

  // ─── Delete Collection ───────────────────────────────────────────────────────
  const handleDeleteCollection = async (collectionId) => {
    const ok = await deleteCollection(collectionId);
    if (ok) {
      setToast({ type: "success", msg: "🗑️ Collection deleted" });
      fetchAllData();
    } else setToast({ type: "error", msg: "Delete nahi hua" });
  };

  // ─── Distribute ──────────────────────────────────────────────────────────────
  const handleDistribute = async ({
    itemId,
    qty,
    memberId,
    price,
    unit,
    note,
  }) => {
    const available = getStockQty(itemId);
    if (qty > available) {
      setToast({
        type: "error",
        msg: `❌ Stock mein sirf ${available} available hai`,
      });
      return;
    }
    const item = stock.find((s) => s.id === itemId);
    const member = membersData.find((m) => String(m.id) === String(memberId));
    if (!item || !member) {
      setToast({ type: "error", msg: "Item or Member not found" });
      return;
    }
    const res = await addDistribution({
      groupId: selectedUnit.groupId,
      unitCode: selectedUnit.unitCode,
      stockId: item.id,
      profileId: member.id,
      productName: item.name,
      qty,
      unit,
      price,
      note,
    });
    if (res.success) {
      setToast({
        type: "success",
        msg: `📦 ${qty} ${unit} ${item.name} → ${member.name}`,
      });
      fetchAllData();
      setShowForm(null);
    } else setToast({ type: "error", msg: "Distribution add nahi hua" });
  };

  // ─── Edit Distribution ───────────────────────────────────────────────────────
  const handleEditDistribution = async (payload) => {
    const ok = await editDistribution(payload);
    if (ok) {
      setToast({ type: "success", msg: "✅ Distribution updated" });
      fetchAllData();
    } else setToast({ type: "error", msg: "Distribution update nahi hua" });
  };

  // ─── Delete Distribution ─────────────────────────────────────────────────────
  const handleDeleteDistribution = async (distributionId) => {
    const ok = await deleteDistribution(distributionId);
    if (ok) {
      setToast({ type: "success", msg: "🗑️ Distribution deleted" });
      fetchAllData();
    } else setToast({ type: "error", msg: "Delete nahi hua" });
  };

  // ─── Summary ─────────────────────────────────────────────────────────────────
  const totalCollectedValue = collections.reduce(
    (s, c) => s + (c.price || 0),
    0,
  );
  const totalDistributedValue = distributions.reduce(
    (s, d) => s + (d.price || 0),
    0,
  );
  const netBalance = totalDistributedValue - totalCollectedValue;

  const filteredCollections = collections.filter(
    (c) =>
      c.itemName.toLowerCase().includes(searchRecord.toLowerCase()) ||
      c.memberName.toLowerCase().includes(searchRecord.toLowerCase()),
  );
  const filteredDistributions = distributions.filter(
    (d) =>
      d.itemName.toLowerCase().includes(searchRecord.toLowerCase()) ||
      d.memberName.toLowerCase().includes(searchRecord.toLowerCase()),
  );

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-55">
        <Loader size={36} className="text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-semibold">
          Loading inventory data...
        </p>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Toast toast={toast} onDone={() => setToast(null)} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Total Items
            </h3>
            <Package size={24} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {stock.length}
          </p>
          <p className="text-xs font-medium text-slate-600">
            Products in inventory
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Collection</h3>
            <ArrowDownToLine size={24} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-700 mb-2">
            −₹{totalCollectedValue.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-red-500">
            {collections.length} entries
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Distribution
            </h3>
            <ArrowUpFromLine size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700 mb-2">
            +₹{totalDistributedValue.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-green-600">
            {distributions.length} entries
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Net Balance
            </h3>
            <IndianRupee size={24} className="text-purple-600" />
          </div>
          <p
            className={`text-3xl font-bold mb-2 ${netBalance >= 0 ? "text-green-700" : "text-red-600"}`}
          >
            {netBalance >= 0 ? "+" : ""}₹{netBalance.toLocaleString()}
          </p>
          <p className="text-xs font-medium text-purple-600">
            Distribution − Collection
          </p>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package size={22} className="text-emerald-600" /> FPO Current Stock
          </h2>
          <button
            onClick={() => setShowAddStock(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
        {stock.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border-2 border-dashed border-emerald-200">
            <Warehouse size={48} className="mx-auto text-emerald-300 mb-4" />
            <p className="text-slate-600 font-semibold">Koi stock item nahi</p>
            <p className="text-slate-400 text-sm mt-1">Pehla item add karen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stock.map((item, idx) => {
              const currentQty = getStockQty(item.id);
              const low = currentQty < item.qty * 0.2;
              const colors = stockCardColors[idx % stockCardColors.length];
              return (
                <div
                  key={item.id}
                  className={`group bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl p-5 hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge}`}
                      >
                        {item.unit}
                      </span>
                      <StockCardMenu
                        onEdit={() => setEditItem(item)}
                        onDelete={() => setDeleteItem(item)}
                      />
                    </div>
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${low ? "text-red-600" : "text-slate-900"}`}
                  >
                    {currentQty}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      ₹{item.rate}/{item.unit}
                    </p>
                    {low && (
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle size={12} /> Low
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Collection / Distribution Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setSubTab("collection")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
              subTab === "collection"
                ? "text-green-700 bg-green-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Leaf size={18} /> Collection
            {subTab === "collection" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
            )}
          </button>
          <button
            onClick={() => setSubTab("distribution")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
              subTab === "distribution"
                ? "text-orange-700 bg-orange-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Droplets size={18} /> Distribution
            {subTab === "distribution" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500" />
            )}
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchRecord}
                onChange={(e) => setSearchRecord(e.target.value)}
                placeholder={`Search ${subTab} records...`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border-2 border-gray-200 focus:border-emerald-400 outline-none transition"
              />
            </div>
            <button
              onClick={() =>
                setShowForm(subTab === "collection" ? "collect" : "distribute")
              }
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] ${
                subTab === "collection"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-orange-500 to-amber-600"
              }`}
            >
              <Plus size={16} />
              {subTab === "collection" ? "Add Collection" : "Add Distribution"}
            </button>
          </div>

          {/* Collection Records */}
          {subTab === "collection" &&
            (filteredCollections.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-dashed border-green-200">
                <ArrowDownToLine
                  size={48}
                  className="mx-auto text-green-300 mb-4"
                />
                <p className="text-slate-600 font-semibold">
                  Koi collection record nahi
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Members se items collect karen
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...filteredCollections].reverse().map((c) => (
                  <div
                    key={c.id}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                        <ArrowDownToLine size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{c.itemName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          From:{" "}
                          <span className="font-medium text-slate-700">
                            {c.memberName}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(c.date)}
                          {c.note ? ` • ${c.note}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                          +{c.qty} {c.unit}
                        </span>
                        {c.price > 0 && (
                          <p className="text-xs text-red-500 mt-1 font-semibold">
                            −₹{c.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <RecordMenu
                        onEdit={() => setEditCollectionRecord(c)}
                        onDelete={() => setDeleteCollectionRecord(c)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* Distribution Records */}
          {subTab === "distribution" &&
            (filteredDistributions.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-200">
                <ArrowUpFromLine
                  size={48}
                  className="mx-auto text-orange-300 mb-4"
                />
                <p className="text-slate-600 font-semibold">
                  Koi distribution record nahi
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Members ko items distribute karen
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...filteredDistributions].reverse().map((d) => (
                  <div
                    key={d.id}
                    className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5 hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                        <ArrowUpFromLine
                          size={20}
                          className="text-orange-600"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{d.itemName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          To:{" "}
                          <span className="font-medium text-slate-700">
                            {d.memberName}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(d.date)}
                          {d.note ? ` • ${d.note}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          −{d.qty} {d.unit}
                        </span>
                        {d.price > 0 && (
                          <p className="text-xs text-green-600 mt-1 font-semibold">
                            +₹{d.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <RecordMenu
                        onEdit={() => setEditDistributionRecord(d)}
                        onDelete={() => setDeleteDistributionRecord(d)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Stock */}
      {showAddStock && (
        <AddStockModal
          onClose={() => setShowAddStock(false)}
          onAdd={handleAddStock}
        />
      )}
      {editItem && (
        <EditStockModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteItem && (
        <DeleteConfirmModal
          label={deleteItem.name}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => handleDeleteConfirm(deleteItem.id)}
        />
      )}

      {/* Add form */}
      {showForm && (
        <FormModal
          type={showForm}
          stock={stock}
          members={membersData}
          getStockQty={getStockQty}
          onSubmit={showForm === "collect" ? handleCollect : handleDistribute}
          onClose={() => setShowForm(null)}
          setToast={setToast}
        />
      )}

      {/* Collection edit/delete */}
      {editCollectionRecord && (
        <EditCollectionModal
          record={editCollectionRecord}
          onClose={() => setEditCollectionRecord(null)}
          onSave={handleEditCollection}
        />
      )}
      {deleteCollectionRecord && (
        <DeleteConfirmModal
          label={`${deleteCollectionRecord.itemName} — ${deleteCollectionRecord.memberName}`}
          onClose={() => setDeleteCollectionRecord(null)}
          onConfirm={() => handleDeleteCollection(deleteCollectionRecord.id)}
        />
      )}

      {/* Distribution edit/delete */}
      {editDistributionRecord && (
        <EditDistributionModal
          record={editDistributionRecord}
          selectedUnit={selectedUnit}
          onClose={() => setEditDistributionRecord(null)}
          onSave={handleEditDistribution}
        />
      )}
      {deleteDistributionRecord && (
        <DeleteConfirmModal
          label={`${deleteDistributionRecord.itemName} — ${deleteDistributionRecord.memberName}`}
          onClose={() => setDeleteDistributionRecord(null)}
          onConfirm={() =>
            handleDeleteDistribution(deleteDistributionRecord.id)
          }
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Inventory;
