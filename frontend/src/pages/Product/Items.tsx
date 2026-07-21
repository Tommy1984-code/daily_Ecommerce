import { useEffect, useState, useRef } from "react";
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
import Button from "../../components/ui/button/Button";
import { Pagination } from "../../components/ui/Pagination";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import {
  getItems,
  getCategories,
  getCategoryGroups,
  getGroupBrands,
  updateItem,
  deleteItem,
  type Item,
  type Category,
  type ProductGroup,
  type Brand,
} from "../../services/productService";

export default function Items() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
  const [groupId, setGroupId] = useState(searchParams.get("productId") || "");
  const [brandId, setBrandId] = useState(searchParams.get("brandId") || "");

  const [editItem, setEditItem] = useState<Item | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editImage, setEditImage] = useState("");
  const [editSpecEn, setEditSpecEn] = useState("");
  const [editSpecAm, setEditSpecAm] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [deleteItemTarget, setDeleteItemTarget] = useState<Item | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function fetchCategories() {
    try {
      const res = await getCategories(1, 100);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }

  async function fetchGroups(catId: string) {
    if (!catId) { setGroups([]); return; }
    try {
      const res = await getCategoryGroups(catId, 1, 100);
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  }

  async function fetchBrands(gId: string) {
    if (!gId) { setBrands([]); return; }
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
        limit,
        q: search || undefined,
        categoryId: categoryId || undefined,
        productId: groupId || undefined,
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
    if (!isAdmin) { navigate("/", { replace: true }); return; }
    fetchCategories();
  }, [isAdmin, navigate]);

  const searchTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { fetchGroups(categoryId); }, [categoryId]);
  useEffect(() => { fetchBrands(groupId); }, [groupId]);
  useEffect(() => { fetchItems(1); }, [categoryId, groupId, brandId]);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchItems(1), 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      fetchItems(1);
    }
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

  function openEdit(item: Item) {
    setEditItem(item);
    setEditImage(item.image || "");
    setEditSpecEn(item.specificationsEn || "");
    setEditSpecAm(item.specificationsAm || "");
    setShowEdit(true);
  }

  async function handleSaveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    try {
      await updateItem(editItem.itemId, {
        image: editImage || undefined,
        specificationsEn: editSpecEn || undefined,
        specificationsAm: editSpecAm || undefined,
      });
      setShowEdit(false);
      setEditItem(null);
      fetchItems(page);
    } catch (err) {
      console.error("Failed to update item", err);
    } finally {
      setEditSaving(false);
    }
  }

  function openDelete(item: Item) {
    setDeleteItemTarget(item);
    setShowDelete(true);
  }

  async function handleDelete() {
    if (!deleteItemTarget) return;
    setDeleting(true);
    try {
      await deleteItem(deleteItemTarget.itemId);
      setShowDelete(false);
      setDeleteItemTarget(null);
      fetchItems(page);
    } catch (err) {
      console.error("Failed to delete item", err);
    } finally {
      setDeleting(false);
    }
  }

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.titleEn })),
  ];
  const groupOptions = [
    { value: "", label: "All Product Groups" },
    ...groups.map((g) => ({ value: g.id, label: g.titleEn })),
  ];
  const brandOptions = [
    { value: "", label: "All Brands" },
    ...brands.map((b) => ({ value: b.id, label: b.titleEn })),
  ];

  return (
    <>
      <PageMeta title="Items | Dashboard" description="Product items" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Items</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and manage all products from NAV
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="min-w-[180px] flex-1">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className="min-w-[160px]">
          <Select
            placeholder=""
            options={categoryOptions}
            onChange={handleCategoryChange}
            defaultValue={categoryId}
          />
        </div>
        <div className="min-w-[160px]">
          <Select
            placeholder=""
            key={categoryId}
            options={groupOptions}
            onChange={handleGroupChange}
            defaultValue={groupId}
          />
        </div>
        <div className="min-w-[160px]">
          <Select
            placeholder=""
            key={groupId}
            options={brandOptions}
            onChange={setBrandId}
            defaultValue={brandId}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Id</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product Group Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Brand Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title (EN)</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item Title (AMH)</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">UOM</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={10} className="px-5 py-8 text-center text-gray-500">Loading items...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={10} className="px-5 py-8 text-center text-gray-500">No items found</td>
                </TableRow>
              ) : (
                items.map((item) => {
                  const activePrice = item.prices && item.prices.length > 0 ? item.prices[0] : null;
                  return (
                    <TableRow key={item.itemId}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-mono text-xs text-gray-500">{item.itemId}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                        {item.categoryTitleEn}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                        {item.productGroupTitleEn}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                        <Badge size="sm" variant="light" color="info">{item.brandTitleEn}</Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.titleEn}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                        {item.titleAm || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm">
                        {activePrice ? (
                          <span className="font-medium text-gray-800 dark:text-white/90">ETB {activePrice.price.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-sm text-gray-500 dark:text-gray-400">
                        {activePrice?.uom || item.salesUom || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="h-10 w-10 object-cover rounded border border-gray-200 dark:border-gray-700"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                            title="Edit item"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(item)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                            title="Delete item"
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {meta && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          onPageChange={fetchItems}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); fetchItems(1); }}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        className="max-w-3xl p-8"
      >
        {editItem && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit — {editItem.titleEn}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Item Image URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="https://example.com/item.jpg"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
              {editImage && (
                <img
                  src={editImage}
                  alt="preview"
                  className="mt-3 h-28 w-full max-w-sm object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Specification English
              </label>
              <textarea
                rows={4}
                placeholder="Item specification in English..."
                value={editSpecEn}
                onChange={(e) => setEditSpecEn(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Specification Amharic
              </label>
              <textarea
                rows={4}
                placeholder="የእቃው ዝርዝር መግለጫ በአማርኛ..."
                value={editSpecAm}
                onChange={(e) => setEditSpecAm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 resize-y"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05] justify-center">
              <Button onClick={handleSaveEdit} disabled={editSaving}>
                {editSaving ? "Saving..." : "Update"}
              </Button>
              <Button variant="outline" onClick={() => setShowEdit(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-error-50 dark:bg-error-500/15">
              <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16.001A8 8 0 0012 20zm1-5h-2v2h2v-2zm0-8h-2v6h2V7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Delete Item
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{deleteItemTarget?.titleEn}</strong>?
            This will also remove all its prices and stock data.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal>


    </>
  );
}
