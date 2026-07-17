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
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { Pagination } from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";
import {
  getCombos,
  getComboById,
  deleteCombo,
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

  const [detailLines, setDetailLines] = useState<ComboLine[]>([]);
  const [detailTitle, setDetailTitle] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

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
      setDetailTitle(combo.titleEn);
      setDetailLines(combo.lines || []);
    } catch (err) {
      console.error("Failed to fetch combo detail", err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this combo?")) return;
    try {
      await deleteCombo(id);
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
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Combos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Combo product bundles
          </p>
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lines</TableCell>
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
                items.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{combo.titleEn}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{combo.description || "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">ETB {combo.price.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge variant={combo.active ? "light" : "light"} color={combo.active ? "success" : "error"}>
                        {combo.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">{combo.lineCount}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(combo.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(combo.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-error-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-error-600 transition-colors"
                        >
                          Delete
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

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        className="max-w-2xl p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Combo Lines — {detailTitle}
          </h2>
          {detailLoading ? (
            <p className="text-sm text-gray-500">Loading lines...</p>
          ) : detailLines.length === 0 ? (
            <p className="text-sm text-gray-500">No lines in this combo</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-500 font-medium">Item</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Qty</th>
                  <th className="text-left py-2 text-gray-500 font-medium">UOM</th>
                </tr>
              </thead>
              <tbody>
                {detailLines.map((line) => (
                  <tr key={line.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 font-medium text-gray-800 dark:text-white/90">{line.titleEn}</td>
                    <td className="py-2 text-gray-500">{line.itemDescription || "—"}</td>
                    <td className="py-2">{line.quantity}</td>
                    <td className="py-2 text-gray-500">{line.salesUom || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </>
  );
}
