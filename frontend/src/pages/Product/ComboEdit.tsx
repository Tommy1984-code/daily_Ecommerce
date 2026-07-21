import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import ItemCombo from "../../components/form/ItemCombo";
import { AngleLeftIcon, PlusIcon, BoxIcon, CheckCircleIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import {
  getItems,
  getComboById,
  updateCombo,
  type Item,
  type ComboHeader,
} from "../../services/productService";

interface EditLineForm {
  id?: string;
  itemId: string;
  itemDescription: string;
  quantity: number;
  uom: string;
}

export default function ComboEdit() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [combo, setCombo] = useState<ComboHeader | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [lines, setLines] = useState<EditLineForm[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    if (!id) {
      navigate("/product/combos");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const [comboData, itemsRes] = await Promise.all([
          getComboById(id),
          getItems({ limit: 100 }),
        ]);
        setCombo(comboData);
        setDescription(comboData.titleEn);
        setPrice(String(comboData.price));
        setActive(comboData.active);
        setLines(
          (comboData.lines || []).map((l) => ({
            id: l.id,
            itemId: l.itemId || "",
            itemDescription: l.itemDescription || "",
            quantity: l.quantity,
            uom: l.uom || "",
          }))
        );
        setItems(itemsRes.data);
      } catch (err) {
        console.error("Failed to load combo for edit", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin, navigate, id]);

  const itemOptions = items.map((item) => ({
    value: item.itemId,
    label: `${item.itemId} — ${item.titleEn}`,
  }));

  function getSelectedLineLabel(itemId: string) {
    const item = items.find((i) => i.itemId === itemId);
    return item ? { value: item.itemId, label: `${item.itemId} — ${item.titleEn}` } : null;
  }

  function addLine() {
    if (lines.length >= 10) return;
    setLines([...lines, { itemId: "", itemDescription: "", quantity: 1, uom: "" }]);
  }

  function removeLine(index: number) {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, field: keyof EditLineForm, value: string | number) {
    const updated = [...lines];
    (updated[index] as any)[field] = value;
    if (field === "itemId") {
      const item = items.find((i) => i.itemId === value);
      updated[index].itemDescription = item?.titleEn || "";
      updated[index].uom = item?.salesUom || "";
    }
    setLines(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !price) return;
    setSubmitting(true);
    try {
      await updateCombo(id, {
        price: Number(price),
        active,
        lines: lines.map((l) => ({
          id: l.id,
          itemId: l.itemId,
          itemDescription: l.itemDescription,
          quantity: l.quantity,
          uom: l.uom || undefined,
        })),
      });
      navigate("/product/combos");
    } catch (err) {
      console.error("Failed to update combo", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Edit Combo | Dashboard" description="Edit combo bundle" />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading combo data...</p>
          </div>
        </div>
      </>
    );
  }

  if (!combo) {
    return (
      <>
        <PageMeta title="Edit Combo | Dashboard" description="Edit combo bundle" />
        <div className="text-center py-32">
          <p className="text-gray-500">Combo not found</p>
          <button onClick={() => navigate("/product/combos")} className="mt-4 text-brand-600 hover:underline">
            Back to Combos
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Edit Combo | Dashboard" description="Edit combo bundle" />

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/product/combos")}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <AngleLeftIcon className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
              Edit Combo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {combo.itemId} — {combo.titleEn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Combo Description Section */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                    <BoxIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Combo Details</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Edit combo description and pricing</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter combo description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5 p-4 bg-brand-50/50 dark:bg-brand-500/5 rounded-xl border border-brand-100 dark:border-brand-500/20">
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Combo ID</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{combo.itemId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Price</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="text-lg font-bold text-brand-600 dark:text-brand-400 bg-transparent border-none text-right w-full focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={active}
                    onClick={() => setActive(!active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 ${
                      active
                        ? "bg-brand-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                        active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active {active ? " — Combo is visible to customers" : " — Combo is hidden"}
                  </span>
                </div>
              </div>
            </div>

            {/* Combo Items Section */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Combo Items
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Products in this bundle ({lines.length}/10)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mt-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex gap-3 items-end">
                        <div className="flex-[3]">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Select Item</label>
                          <ItemCombo
                            placeholder="Search item..."
                            options={itemOptions}
                            selected={getSelectedLineLabel(line.itemId)}
                            onSelect={(val) => updateLine(i, "itemId", val)}
                          />
                        </div>
                        <div className="w-28">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(i, "quantity", Number(e.target.value))}
                            min="1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(i)}
                          disabled={lines.length <= 1}
                          className="flex items-center justify-center w-9 h-9 mt-6 rounded-lg border border-gray-200 dark:border-gray-700 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {line.itemId && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                          {items.find((it) => it.itemId === line.itemId)?.titleEn || ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLine}
                  disabled={lines.length >= 10}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/20 disabled:opacity-40 transition-colors w-full justify-center"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Another Item
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] sticky top-6">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Combo ID</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">{combo.itemId}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-white/[0.05]" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Items in Bundle</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">{lines.length}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-white/[0.05]" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
                  <span className={`text-sm font-medium ${active ? 'text-green-600' : 'text-red-500'}`}>
                    {active ? "Yes" : "No"}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-white/[0.05]" />
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90">Price</span>
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                    ETB {Number(price || 0).toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting || !price}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/product/combos")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
