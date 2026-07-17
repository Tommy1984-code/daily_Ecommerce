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
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";
import {
  getFeaturedCategories,
  toggleFeaturedBrand,
  toggleFeaturedCategory,
  updateFeaturedBanner,
  type FeaturedCategory,
} from "../../services/productService";

interface BrandCheckItem {
  id: string;
  code: string;
  titleEn: string;
  titleAm: string;
  checked: boolean;
}

export default function FeaturedCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
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

  const [detailCat, setDetailCat] = useState<FeaturedCategory | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const [editCat, setEditCat] = useState<FeaturedCategory | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editBrands, setEditBrands] = useState<BrandCheckItem[]>([]);
  const [editBanner, setEditBanner] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [removeModal, setRemoveModal] = useState(false);
  const [removeCat, setRemoveCat] = useState<FeaturedCategory | null>(null);
  const [removing, setRemoving] = useState(false);

  async function fetch(pageNum = 1) {
    setLoading(true);
    try {
      const res = await getFeaturedCategories(pageNum, limit, search || undefined);
      setCategories(res.data);
      setMeta(res.meta);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch featured categories", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [limit]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") fetch(1);
  }

  function openDetail(cat: FeaturedCategory) {
    setDetailCat(cat);
    setShowDetail(true);
  }

  async function openEdit(cat: FeaturedCategory) {
    setEditCat(cat);
    setEditBanner(cat.featuredImage || "");
    setEditBrands(
      cat.brands.map((b) => ({
        id: b.id,
        code: b.code,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        checked: b.featured,
      })),
    );
    setShowEdit(true);
    setEditSubmitting(false);
  }

  function handleEditToggle(brandId: string, featured: boolean) {
    setEditBrands((prev) =>
      prev.map((b) =>
        b.id === brandId ? { ...b, checked: !featured } : b,
      ),
    );
  }

  async function handleEditSave() {
    if (!editCat) return;
    setEditSubmitting(true);
    try {
      if (editBanner !== (editCat.featuredImage || "")) {
        await updateFeaturedBanner(editCat.id, editBanner);
      }
      await Promise.all(
        editBrands.map((b) => {
          const original = editCat.brands.find((ob) => ob.id === b.id);
          if (original && original.featured !== b.checked) {
            return toggleFeaturedBrand(editCat.id, b.id, b.checked);
          }
          return Promise.resolve();
        }),
      );
      setShowEdit(false);
      fetch();
    } catch (err) {
      console.error("Failed to save changes", err);
    } finally {
      setEditSubmitting(false);
    }
  }

  function openRemoveModal(cat: FeaturedCategory) {
    setRemoveCat(cat);
    setRemoveModal(true);
  }

  async function handleRemove() {
    if (!removeCat) return;
    setRemoving(true);
    try {
      await toggleFeaturedCategory(removeCat.id);
      setRemoveModal(false);
      setRemoveCat(null);
      fetch();
    } catch (err) {
      console.error("Failed to remove featured category", err);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <PageMeta title="Featured Categories | Dashboard" description="Featured product categories" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Featured Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage featured categories and their brands
          </p>
        </div>
        <button
          onClick={() => navigate("/product/featured-categories/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <input
          type="text"
          placeholder="Search featured categories..."
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
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Title</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Banner Image</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Loading featured categories...</td>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No featured categories found. Click "+ Add" to create one.</td>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">{cat.code}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div>
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{cat.titleEn}</span>
                        {cat.titleAm && (
                          <p className="text-xs text-gray-400">{cat.titleAm}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {cat.featuredImage ? (
                        <a href={cat.featuredImage} target="_blank" rel="noopener noreferrer">
                          <img
                            src={cat.featuredImage}
                            alt="banner"
                            className="h-10 w-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetail(cat)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                          title="Edit brands"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openRemoveModal(cat)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                          title="Remove from featured"
                        >
                          <TrashBinIcon className="w-4 h-4" />
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

      {meta && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          onPageChange={(p) => fetch(p)}
          onLimitChange={(l) => setLimit(l)}
          limit={limit}
        />
      )}

      {/* View Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        className="max-w-lg p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Featured Category Details
          </h2>
          {detailCat && (
            <>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium text-gray-800 dark:text-white/90">{detailCat.titleEn}</span>
                </p>
                <p>
                  <span className="text-gray-500">Product ID:</span>{" "}
                  <span className="font-mono text-gray-800 dark:text-white/90">{detailCat.code}</span>
                </p>
              </div>

              {detailCat.brands.length === 0 ? (
                <p className="text-sm text-gray-500">No brands in this category</p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left px-3 py-2 font-medium text-gray-500">Brand ID</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500">Brand Name</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-500">Featured</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {detailCat.brands.map((b) => (
                        <tr key={b.id}>
                          <td className="px-3 py-2 font-mono text-xs text-gray-500">{b.code}</td>
                          <td className="px-3 py-2 text-gray-800 dark:text-white/90">{b.titleEn}</td>
                          <td className="px-3 py-2 text-center">
                            {b.featured ? (
                              <svg className="w-5 h-5 text-success-500 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        className="max-w-4xl p-8"
      >
        {editCat && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit — {editCat.titleEn} / {editCat.titleAm}
            </h2>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Brands to Feature (Category 3)
              </h3>
              {editBrands.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  No brands available
                </p>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-white/[0.05] max-h-72 overflow-y-auto">
                  {editBrands.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={b.checked}
                        onChange={() => handleEditToggle(b.id, b.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-800 dark:text-white/90">
                        {b.titleEn} / {b.titleAm}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Banner Image URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="https://example.com/banner.jpg"
                value={editBanner}
                onChange={(e) => setEditBanner(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
              {editBanner && (
                <img
                  src={editBanner}
                  alt="banner preview"
                  className="mt-3 h-28 w-full max-w-sm object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05] justify-center">
              <Button onClick={handleEditSave} disabled={editSubmitting}>
                {editSubmitting ? "Saving..." : "Update"}
              </Button>
              <Button variant="outline" onClick={() => setShowEdit(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={removeModal}
        onClose={() => setRemoveModal(false)}
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
              Remove Featured Category
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to remove <strong>{removeCat?.titleEn}</strong> from featured
            categories? This will also un-feature all its brands.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setRemoveModal(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="px-4 py-2 text-sm rounded-lg bg-error-500 text-white hover:bg-error-600 disabled:opacity-40 inline-flex items-center gap-2"
            >
              {removing ? "Removing..." : "Yes, Remove"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
