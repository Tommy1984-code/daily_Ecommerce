import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Input from "../../components/form/input/InputField";
import { useAuth } from "../../context/AuthContext";
import { getDiscounts, type DiscountRecord } from "../../services/productService";
import { Pagination } from "../../components/ui/Pagination";

export default function Discounts() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<DiscountRecord[]>([]);
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

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getDiscounts(pageNum, limit);
      const filtered = search
        ? res.data.filter((r) =>
            r.titleEn.toLowerCase().includes(search.toLowerCase())
          )
        : res.data;
      setItems(filtered);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch discounts", err);
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

  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetch(1), 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      fetch(1);
    }
  }

  return (
    <>
      <PageMeta title="Discounts | Dashboard" description="Product discounts" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            All Discount Price List
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Items with active discounts
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search by item title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-12">No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">UOM</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount %</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Loading discounts...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No discounts found</td>
                </TableRow>
              ) : (
                items.map((d, idx) => (
                  <TableRow key={d.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-gray-500 text-sm">{(page - 1) * limit + idx + 1}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{d.titleEn}</p>
                        {d.titleAm && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{d.titleAm}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{d.uom || "—"}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-error-50 dark:bg-error-500/10 px-2.5 py-1 text-xs font-semibold text-error-600 dark:text-error-400">
                        {d.discountPer}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                        title="Delete discount"
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

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          onPageChange={fetch}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); fetch(1); }}
        />
      )}
    </>
  );
}
