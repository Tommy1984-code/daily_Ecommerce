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
  getLandMarkPrices,
  deleteLandMarkPrice,
  type LandMarkPriceRecord,
} from "../../services/productService";
import { Pagination } from "../../components/ui/Pagination";

export default function LandMarkPrices() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<LandMarkPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getLandMarkPrices(pageNum, limit);
      setItems(res.data);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch land mark prices", err);
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this land mark price record?")) return;
    try {
      await deleteLandMarkPrice(id);
      fetch(page);
    } catch (err) {
      console.error("Failed to delete land mark price", err);
    }
  }

  return (
    <>
      <PageMeta title="Land Mark Prices | Dashboard" description="Land mark delivery prices" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Land Mark Prices
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Delivery pricing by land mark, shop, and date
          </p>
        </div>
        <button
          onClick={() => navigate("/product/land-mark-prices/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Time Range</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Land Mark</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Latitude</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Longitude</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Shop</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Loading land mark prices...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">No land mark prices found</td>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.dateTitleEn}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.timeRange}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.landMarkTitleEn}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">{item.landMarkLatitude ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">{item.landMarkLongitude ?? "—"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{item.shopTitleEn}</TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">ETB {item.price.toFixed(2)}</TableCell>
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
        <Pagination
          currentPage={page}
          totalPages={meta?.totalPages || 0}
          totalItems={meta?.total || 0}
          onPageChange={fetch}
          limit={limit}
          onLimitChange={(l: number) => { setLimit(l); setPage(1); }}
        />
      )}
    </>
  );
}
