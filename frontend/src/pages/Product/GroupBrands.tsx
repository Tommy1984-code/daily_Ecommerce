import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
import { getGroupBrands, type Brand } from "../../services/productService";
import { Pagination } from "../../components/ui/Pagination";

export default function GroupBrands() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { groupId } = useParams();
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

  async function fetch(pageNum = 1) {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await getGroupBrands(groupId, pageNum, 20, search || undefined);
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
  }, [isAdmin, navigate, groupId]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") fetch(1);
  }

  function getCategoryIdFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoryId");
  }

  return (
    <>
      <PageMeta title="Brands | Dashboard" description="Category 3 brands" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to={
                getCategoryIdFromUrl()
                  ? `/product/categories/${getCategoryIdFromUrl()}/groups`
                  : "/product/categories"
              }
              className="text-sm text-brand-500 hover:text-brand-600"
            >
              &larr; Back to Groups
            </Link>
          </div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90 mt-1">
            Brands
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Category 3 — brands under the selected product group
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search brands..."
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  English Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Amharic Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Items
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    Loading brands...
                  </td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    No brands found for this product group
                  </td>
                </TableRow>
              ) : (
                items.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {b.titleEn}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {b.titleAm}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                        {b.itemCount} items
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Link
                        to={`/product/items?brandId=${b.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                      >
                        View Items
                      </Link>
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
          onLimitChange={(l: number) => { setLimit(l); setPage(1); }}
        />
      )}
    </>
  );
}
