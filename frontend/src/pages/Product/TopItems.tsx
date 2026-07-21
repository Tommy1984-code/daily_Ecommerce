import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Select from "../../components/form/Select";
import { Modal } from "../../components/ui/modal";
import { useAuth } from "../../context/AuthContext";
import {
  getTopItems,
  addTopItem,
  deleteTopItem,
  getItems,
  type TopItemRecord,
  type Item,
} from "../../services/productService";

export default function TopItems() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<TopItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [catalogItems, setCatalogItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [adding, setAdding] = useState(false);

  async function fetch() {
    setLoading(true);
    try {
      const data = await getTopItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch top items", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    fetch();
  }, [isAdmin, navigate]);

  async function openAddModal() {
    setShowAdd(true);
    setSelectedItem("");
    try {
      const res = await getItems({ limit: 100 });
      setCatalogItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  }

  async function handleAdd() {
    if (!selectedItem) return;
    setAdding(true);
    try {
      await addTopItem(selectedItem);
      setShowAdd(false);
      fetch();
    } catch (err) {
      console.error("Failed to add top item", err);
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this item from top products?")) return;
    try {
      await deleteTopItem(id);
      fetch();
    } catch (err) {
      console.error("Failed to delete top item", err);
    }
  }

  const catalogOptions = catalogItems.map((item) => ({
    value: item.itemId,
    label: item.titleAm
      ? `${item.itemId} — ${item.titleEn} / ${item.titleAm}`
      : `${item.itemId} — ${item.titleEn}`,
  }));

  return (
    <>
      <PageMeta title="Top Products | Dashboard" description="Top product items" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Top Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Featured products displayed on the home page
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Add Top Product
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-12">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Code</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Loading top items...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No top products found</td>
                </TableRow>
              ) : (
                items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-gray-500 text-sm">{idx + 1}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-mono text-xs text-gray-500">{item.itemId}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.titleEn}</p>
                        {item.titleAm && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.titleAm}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                        title="Remove from top products"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        className="max-w-lg p-8"
      >
        <div className="space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Add Top Product
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Search and select an item to feature on the home page
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Item
            </label>
            <Select
              placeholder="Search by item code or title..."
              options={catalogOptions}
              onChange={setSelectedItem}
              defaultValue={selectedItem}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setShowAdd(false)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={adding || !selectedItem}
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? "Adding..." : "Add to Top Products"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
