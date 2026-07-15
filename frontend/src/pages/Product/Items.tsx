import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { useAuth } from "../../context/AuthContext";
import {
  getItems,
  getItemByNavNo,
  getCategories,
  getCategoryGroups,
  getGroupBrands,
  type Item,
  type Category,
  type ProductGroup,
  type Brand,
} from "../../services/productService";

export default function Items() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [groupId, setGroupId] = useState(searchParams.get("productGroupId") || "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") || "");

  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  async function fetchCategories() {
    try {
      const res = await getCategories(1, 100);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }

  async function fetchGroups(catId: string) {
    if (!catId) {
      setGroups([]);
      return;
    }
    try {
      const res = await getCategoryGroups(catId, 1, 100);
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  }

  async function fetchBrands(gId: string) {
    if (!gId) {
      setBrands([]);
      return;
    }
    try {
      const res = await getGroupBrands(gId, 1, 100);
      setBrands(res.data);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  }

  async function fetchItems(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getItems({
        page: pageNum,
        limit: 20,
        q: search || undefined,
        categoryId: categoryId || undefined,
        productGroupId: groupId || undefined,
        brandId: brandId || undefined,
      });
      setItems(res.data);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch items", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    fetchCategories();
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchGroups(categoryId);
  }, [categoryId]);

  useEffect(() => {
    fetchBrands(groupId);
  }, [groupId]);

  useEffect(() => {
    fetchItems(1);
  }, [categoryId, groupId, brandId]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") fetchItems(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setGroupId("");
    setBrandId("");
  }

  function handleGroupChange(value: string) {
    setGroupId(value);
    setBrandId("");
  }

  async function openDetail(navItemNo: string) {
    try {
      const item = await getItemByNavNo(navItemNo);
      setDetailItem(item);
      setShowDetail(true);
    } catch (err) {
      console.error("Failed to fetch item detail", err);
    }
  }

  const brandOptions = brands.map((b) => ({
    value: b.id,
    label: b.titleEn,
  }));
  const groupOptions = groups.map((g) => ({
    value: g.id,
    label: g.titleEn,
  }));
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.titleEn,
  }));

  const price = items.length > 0 ? items[0] : null;

  return (
    <>
      <PageMeta title="Items | Dashboard" description="Product items" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Items
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and search all products from NAV
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <Select
          placeholder="All Categories"
          options={categoryOptions}
          onChange={handleCategoryChange}
          defaultValue={categoryId}
        />
        <Select
          placeholder="All Product Groups"
          options={groupOptions}
          onChange={handleGroupChange}
          defaultValue={groupId}
        />
        <Select
          placeholder="All Brands"
          options={brandOptions}
          onChange={setBrandId}
          defaultValue={brandId}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  NAV No.
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  English Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Category
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Brand
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  UOM
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
                    Loading items...
                  </td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No items found
                  </td>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.navItemNo}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-mono text-xs text-gray-500">
                        {item.navItemNo}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.titleEn}
                      </span>
                      {item.titleAm && (
                        <span className="block text-xs text-gray-400">
                          {item.titleAm}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                      {item.categoryTitleEn}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                      <Badge size="sm" variant="light" color="info">
                        {item.brandTitleEn}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                      {item.uom || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        onClick={() => openDetail(item.navItemNo)}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                      >
                        View
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
          <p className="text-sm text-gray-500">
            Page {page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={!meta.hasPreviousPage}
              onClick={() => fetchItems(page - 1)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={!meta.hasNextPage}
              onClick={() => fetchItems(page + 1)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        className="max-w-2xl p-6"
      >
        {detailItem && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {detailItem.titleEn}
            </h2>
            {detailItem.titleAm && (
              <p className="text-sm text-gray-500">{detailItem.titleAm}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">NAV No:</span>
                <p className="font-mono font-medium">{detailItem.navItemNo}</p>
              </div>
              <div>
                <span className="text-gray-500">UOM:</span>
                <p className="font-medium">{detailItem.uom || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium">{detailItem.categoryTitleEn}</p>
              </div>
              <div>
                <span className="text-gray-500">Product Group:</span>
                <p className="font-medium">{detailItem.productGroupTitleEn}</p>
              </div>
              <div>
                <span className="text-gray-500">Brand:</span>
                <p className="font-medium">{detailItem.brandTitleEn}</p>
              </div>
            </div>

            {(detailItem.specificationsEn || detailItem.specificationsAm) && (
              <div>
                <span className="text-sm text-gray-500">Specification:</span>
                <p className="text-sm mt-1">{detailItem.specificationsEn || detailItem.specificationsAm}</p>
              </div>
            )}

            {detailItem.prices && detailItem.prices.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                  Prices
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-1 text-gray-500 font-medium">Branch</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Price</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItem.prices.map((p, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1">{p.branchId}</td>
                        <td className="py-1 font-medium">ETB {p.price.toFixed(2)}</td>
                        <td className="py-1">
                          {p.discountPct ? `${p.discountPct}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detailItem.stockSnapshots && detailItem.stockSnapshots.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">
                  Stock (unverified NAV snapshot)
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-1 text-gray-500 font-medium">Branch</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItem.stockSnapshots.map((s, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1">{s.branchId}</td>
                        <td className="py-1">{s.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-amber-500 italic">
              {detailItem.stalenessNote}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
