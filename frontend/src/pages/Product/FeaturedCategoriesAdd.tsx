import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import SearchableSelect from "../../components/form/SearchableSelect";
import { AngleLeftIcon } from "../../icons";
import {
  getAllGroups,
  getGroupBrands,
  createFeaturedCategory,
  type ProductGroup,
  type Brand,
} from "../../services/productService";

interface BrandCheckItem {
  id: string;
  code: string;
  titleEn: string;
  titleAm: string;
  checked: boolean;
}

export default function FeaturedCategoriesAdd() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [brands, setBrands] = useState<BrandCheckItem[]>([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    setLoadingGroups(true);
    setFetchError("");
    getAllGroups(1, 100)
      .then((res) => {
        setGroups(res.data);
        setGroupOptions(
          res.data.map((g: ProductGroup) => ({
            value: g.id,
            label: `${g.titleEn} / ${g.titleAm}`,
          })),
        );
      })
      .catch((err) => {
        console.error("Failed to load product groups", err);
        setFetchError(err?.response?.data?.message || err.message || "Failed to load categories");
      })
      .finally(() => setLoadingGroups(false));
  }, []);

  async function handleGroupChange(groupId: string) {
    setSelectedGroupId(groupId);
    if (!groupId) {
      setBrands([]);
      return;
    }
    try {
      const res = await getGroupBrands(groupId, 1, 100);
      setBrands(
        res.data.map((b: Brand) => ({
          id: b.id,
          code: b.code,
          titleEn: b.titleEn,
          titleAm: b.titleAm,
          checked: false,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  }

  function toggleBrand(brandId: string) {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId ? { ...b, checked: !b.checked } : b,
      ),
    );
  }

  async function handleSubmit() {
    if (!selectedGroupId) return;
    setSubmitting(true);
    try {
      const brandIds = brands.filter((b) => b.checked).map((b) => b.id);
      await createFeaturedCategory({
        productGroupId: selectedGroupId,
        featuredImage: bannerUrl || undefined,
        brandIds,
      });
      navigate("/product/featured-categories");
    } catch (err) {
      console.error("Failed to create featured category", err);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <>
      <PageMeta title="Add Featured Category | Dashboard" description="Add a new featured category" />

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/product/featured-categories")}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <AngleLeftIcon className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Add Featured Category
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select a product group (Category 2) and choose brands to feature
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-6 space-y-6">
          {fetchError && (
            <div className="rounded-lg bg-error-50 dark:bg-error-500/15 border border-error-200 dark:border-error-500/30 p-4 text-sm text-error-600 dark:text-error-400">
              {fetchError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category (Category 2)
            </label>
            {loadingGroups ? (
              <div className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center px-4 text-sm text-gray-400">
                Loading categories...
              </div>
            ) : groupOptions.length === 0 ? (
              <div className="h-11 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center px-4 text-sm text-gray-400">
                No categories available
              </div>
            ) : (
              <SearchableSelect
                placeholder="Search & select a category..."
                options={groupOptions}
                onChange={handleGroupChange}
                defaultValue={selectedGroupId}
              />
            )}
          </div>

          {selectedGroupId && (
            <>
              {brands.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Sub Categories to Feature (Category 3)
                  </h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {brands.map((b) => (
                      <label
                        key={b.id}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={b.checked}
                          onChange={() => toggleBrand(b.id)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-800 dark:text-white/90">
                          {b.titleEn} / {b.titleAm}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Banner Image URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/banner.jpg"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {selectedGroup && bannerUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={bannerUrl}
                    alt="banner preview"
                    className="h-32 w-full max-w-md object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                <button
                  onClick={() => navigate("/product/featured-categories")}
                  className="px-5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
                >
                  {submitting ? "Saving..." : "Save Featured Category"}
                </button>
              </div>
            </>
          )}

          {selectedGroupId && brands.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">
              No brands found for this category
            </p>
          )}
        </div>
      </div>
    </>
  );
}
