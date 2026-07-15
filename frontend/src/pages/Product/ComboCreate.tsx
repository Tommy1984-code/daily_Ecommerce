import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useAuth } from "../../context/AuthContext";
import {
  getItems,
  createCombo,
  type Item,
} from "../../services/productService";

interface ComboLineForm {
  navItemNo: string;
  itemDescription: string;
  quantity: number;
}

export default function ComboCreate() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [navItemNo, setNavItemNo] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [lines, setLines] = useState<ComboLineForm[]>([
    { navItemNo: "", itemDescription: "", quantity: 1 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    getItems({ limit: 200 })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to fetch items", err));
  }, [isAdmin, navigate]);

  const itemOptions = items.map((item) => ({
    value: item.navItemNo,
    label: `${item.navItemNo} — ${item.titleEn}`,
  }));

  function addLine() {
    if (lines.length >= 10) return;
    setLines([...lines, { navItemNo: "", itemDescription: "", quantity: 1 }]);
  }

  function removeLine(index: number) {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, field: keyof ComboLineForm, value: string | number) {
    const updated = [...lines];
    (updated[index] as any)[field] = value;
    setLines(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navItemNo || !price) return;
    setSubmitting(true);
    try {
      await createCombo({
        navItemNo,
        price: Number(price),
        active,
        lines: lines.map((l) => ({
          navItemNo: l.navItemNo,
          itemDescription: l.itemDescription,
          quantity: l.quantity,
        })),
      });
      navigate("/product/combos");
    } catch (err) {
      console.error("Failed to create combo", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta title="Create Combo | Dashboard" description="Create a new combo" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Create Combo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create a new combo bundle
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Combo Header</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Combo Item</label>
            <Select
              placeholder="Select combo item..."
              options={itemOptions}
              onChange={setNavItemNo}
              defaultValue={navItemNo}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (ETB)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step={0.01}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            Active
          </label>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Combo Lines ({lines.length}/10)
            </h2>
            <button
              type="button"
              onClick={addLine}
              disabled={lines.length >= 10}
              className="text-sm text-brand-500 hover:text-brand-600 disabled:opacity-40"
            >
              + Add Line
            </button>
          </div>

          {lines.map((line, i) => (
            <div key={i} className="flex gap-3 items-end border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Item</label>
                <Select
                  placeholder="Select item..."
                  options={itemOptions}
                  onChange={(val) => updateLine(i, "navItemNo", val)}
                  defaultValue={line.navItemNo}
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
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
                className="mb-1 text-sm text-error-500 hover:text-error-600 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !navItemNo || !price}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create Combo"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/product/combos")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
