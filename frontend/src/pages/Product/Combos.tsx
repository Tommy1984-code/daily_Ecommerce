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
import { Modal } from "../../components/ui/modal";
import { Pagination } from "../../components/ui/Pagination";
import Button from "../../components/ui/button/Button";
import { useAuth } from "../../context/AuthContext";
import {
  getCombos,
  getComboById,
  deleteCombo,
  updateCombo,
  type ComboHeader,
  type ComboLine,
} from "../../services/productService";

export default function Combos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ComboHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const [detailCombo, setDetailCombo] = useState<ComboHeader | null>(null);
  const [detailLines, setDetailLines] = useState<ComboLine[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ComboHeader | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getCombos(pageNum, limit);
      setItems(res.data);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch combos", err);
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

  async function openDetail(id: string) {
    setDetailLoading(true);
    setShowDetail(true);
    try {
      const combo = await getComboById(id);
      setDetailCombo(combo);
      setDetailLines(combo.lines || []);
    } catch (err) {
      console.error("Failed to fetch combo detail", err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function toggleActive(combo: ComboHeader) {
    try {
      await updateCombo(combo.id, { active: !combo.active });
      fetch(page);
    } catch (err) {
      console.error("Failed to toggle active", err);
    }
  }

  function confirmDelete(combo: ComboHeader) {
    setDeleteTarget(combo);
    setShowDelete(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCombo(deleteTarget.id);
      setShowDelete(false);
      setDeleteTarget(null);
      fetch(page);
    } catch (err) {
      console.error("Failed to delete combo", err);
    }
  }

  return (
    <>
      <PageMeta title="Combos | Dashboard" description="Product combos" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Combos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Combo product bundles</p>
        </div>
        <button
          onClick={() => navigate("/product/combos/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Add Combo
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Id</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Active</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Loading combos...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No combos found</td>
                </TableRow>
              ) : (
                items.map((combo, idx) => (
                  <TableRow key={combo.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{(page - 1) * limit + idx + 1}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{combo.itemId}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">{combo.titleEn}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">ETB {combo.price.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <input
                        type="checkbox"
                        checked={combo.active}
                        onChange={() => toggleActive(combo)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(combo.id)}
                          className="p-1.5 text-gray-500 hover:text-brand-600 transition-colors"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate(`/product/combos/${combo.id}/edit`)}
                          className="p-1.5 text-gray-500 hover:text-brand-600 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(combo)}
                          className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta?.totalPages || 0}
          totalItems={meta?.total || 0}
          onPageChange={fetch}
          limit={limit}
          onLimitChange={(l: number) => { setLimit(l); setPage(1); }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setDeleteTarget(null); }}
        className="max-w-md p-6"
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Delete Combo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong>{deleteTarget?.titleEn}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setShowDelete(false); setDeleteTarget(null); }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        className="max-w-3xl p-0"
      >
        {detailLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : detailCombo ? (
          <div>
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Combo Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Items in this combo bundle</p>
                </div>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Item ID</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1 block">{detailCombo.itemId}</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Description</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-1 block">{detailCombo.titleEn}</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Price</span>
                  <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1 block">ETB {detailCombo.price.toFixed(2)}</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Active</span>
                  <span className={`text-sm font-semibold mt-1 block ${detailCombo.active ? 'text-green-600' : 'text-red-500'}`}>
                    {detailCombo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Items in Combo ({detailLines.length})</h3>
                </div>
                {detailLines.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">No items in this combo</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Id</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {detailLines.map((line, idx) => (
                          <tr key={line.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-medium text-gray-800 dark:text-white/90">{line.itemId || "—"}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{line.itemDescription || "—"}</td>
                            <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white/90">{line.quantity}</td>
                            <td className="py-3 px-4 text-gray-500">{line.uom || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-500">Combo not found</p>
          </div>
        )}
      </Modal>


    </>
  );
}
