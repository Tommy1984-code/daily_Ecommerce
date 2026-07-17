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
      const res = await getDiscounts(pageNum, 20);
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

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") fetch(1);
  }

  return (
    <>
      <PageMeta title="Discounts | Dashboard" description="Product discounts" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Discounts
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">NAV No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Discount %</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Loading discounts...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No discounts found</td>
                </TableRow>
              ) : (
                items.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{d.titleEn}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <code className="text-xs font-mono text-gray-500">{d.navItemNo}</code>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="text-error-500 font-semibold">{d.discountPct}%</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString()}
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
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          limit={limit}
          limits={[10, 20, 50, 100]}
        />
      )}
    </>
  );
}
