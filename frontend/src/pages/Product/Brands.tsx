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
import { useAuth } from "../../context/AuthContext";
import {
  getAllBrands,
  updateBrandImage,
  deleteBrand,
  type Brand,
} from "../../services/productService";
import { Pagination } from "../../components/ui/Pagination";

export default function Brands() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Brand | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getAllBrands(pageNum, limit, search || undefined);
      setItems(res.data);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch brands", err);
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
  }, [isAdmin, navigate, limit]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") fetch(1);
  }

  function openEditModal(brand: Brand) {
    setEditingItem(brand);
    setImageUrl(brand.image || "");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!editingItem) return;
    setSaving(true);
    try {
      await updateBrandImage(editingItem.id, imageUrl);
      setItems((prev) =>
        prev.map((b) => (b.id === editingItem.id ? { ...b, image: imageUrl } : b))
      );
      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to update image", err);
      alert("Failed to update image");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(brand: Brand) {
    if (!confirm(`Are you sure you want to delete "${brand.titleEn} / ${brand.titleAm}"?`)) return;
    try {
      await deleteBrand(brand.id);
      setItems((prev) => prev.filter((b) => b.id !== brand.id));
    } catch (err) {
      console.error("Failed to delete brand", err);
      alert("Failed to delete brand");
    }
  }

  return (
    <>
      <PageMeta title="Category 3 | Dashboard" description="Brands" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Category 3 — Brands
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All brands with full category hierarchy
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-xs">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  No.
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category 1 Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category 2 Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category 3 Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Image
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Loading brands...
                  </td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No brands found
                  </td>
                </TableRow>
              ) : (
                items.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500">
                      {(page - 1) * limit + idx + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {b.categoryTitleEn} / {b.categoryTitleAm}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="text-gray-800 text-theme-sm dark:text-white/90">
                        {b.productGroupTitleEn} / {b.productGroupTitleAm}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {b.titleEn} / {b.titleAm}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {b.image ? (
                        <img src={b.image} alt={b.titleEn} className="w-12 h-8 object-cover rounded" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors"
                          title="Edit Image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={meta?.totalPages || 0}
        totalItems={meta?.total || 0}
        onPageChange={fetch}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        limit={limit}
        limits={[10, 20, 50, 100]}
      />

      {/* Edit Image Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Edit Brand Image
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category 1
                </label>
                <p className="text-gray-800 dark:text-white">
                  {editingItem.categoryTitleEn} / {editingItem.categoryTitleAm}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category 2
                </label>
                <p className="text-gray-800 dark:text-white">
                  {editingItem.productGroupTitleEn} / {editingItem.productGroupTitleAm}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category 3 Title
                </label>
                <p className="text-gray-800 dark:text-white">
                  {editingItem.titleEn} / {editingItem.titleAm}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {editingItem.image && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Image Preview
                  </label>
                  <img src={editingItem.image} alt={editingItem.titleEn} className="w-32 h-20 object-cover rounded border" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}