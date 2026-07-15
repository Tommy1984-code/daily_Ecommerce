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
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [catalogItems, setCatalogItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [adding, setAdding] = useState(false);

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getTopItems(pageNum, 20);
      setItems(res.data);
      setMeta(res.meta);
      setPage(pageNum);
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
      const res = await getItems({ limit: 200 });
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
      fetch(1);
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
      fetch(page);
    } catch (err) {
      console.error("Failed to delete top item", err);
    }
  }

  const catalogOptions = catalogItems.map((item) => ({
    value: item.navItemNo,
    label: `${item.navItemNo} — ${item.titleEn}`,
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Code</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Added Date</TableCell>
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
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-mono text-xs text-gray-500">{item.navItemNo}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.titleEn}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-error-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-error-600 transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {page} of {meta.totalPages} ({meta.total} total)</p>
          <div className="flex gap-2">
            <button disabled={!meta.hasPreviousPage} onClick={() => fetch(page - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">Previous</button>
            <button disabled={!meta.hasNextPage} onClick={() => fetch(page + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Add Top Product
          </h2>
          <Select
            placeholder="Select an item..."
            options={catalogOptions}
            onChange={setSelectedItem}
            defaultValue={selectedItem}
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={adding || !selectedItem}
              className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
