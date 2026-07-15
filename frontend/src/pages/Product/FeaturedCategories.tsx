import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { useAuth } from "../../context/AuthContext";
import {
  getFeaturedCategories,
  updateFeaturedBanner,
  toggleFeaturedBrand,
  type FeaturedCategory,
} from "../../services/productService";

export default function FeaturedCategories() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerModal, setBannerModal] = useState(false);
  const [bannerCatId, setBannerCatId] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerSubmitting, setBannerSubmitting] = useState(false);

  async function fetch() {
    setLoading(true);
    try {
      const res = await getFeaturedCategories();
      setCategories(res);
    } catch (err) {
      console.error("Failed to fetch featured categories", err);
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

  async function handleBannerSubmit() {
    if (!bannerUrl) return;
    setBannerSubmitting(true);
    try {
      await updateFeaturedBanner(bannerCatId, bannerUrl);
      setBannerModal(false);
      setBannerUrl("");
      fetch();
    } catch (err) {
      console.error("Failed to update banner", err);
    } finally {
      setBannerSubmitting(false);
    }
  }

  function openBannerModal(catId: string, currentUrl: string) {
    setBannerCatId(catId);
    setBannerUrl(currentUrl);
    setBannerModal(true);
  }

  async function handleToggleBrand(catId: string, brandId: string, featured: boolean) {
    try {
      await toggleFeaturedBrand(catId, brandId, !featured);
      fetch();
    } catch (err) {
      console.error("Failed to toggle brand", err);
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
            Manage featured categories and their brand visibility
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading featured categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No featured categories found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                {cat.featuredImage ? (
                  <img
                    src={cat.featuredImage}
                    alt={cat.titleEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Banner
                  </div>
                )}
                <button
                  onClick={() => openBannerModal(cat.id, cat.featuredImage || "")}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-xs px-2 py-1 rounded-md shadow hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  Edit Banner
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">
                    {cat.titleEn}
                  </h3>
                  {cat.titleAm && (
                    <p className="text-xs text-gray-500">{cat.titleAm}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {cat.brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleToggleBrand(cat.id, brand.id, brand.featured)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        brand.featured
                          ? "bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400"
                          : "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {brand.titleEn}
                      {brand.featured ? " ★" : ""}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Badge size="sm" variant="light" color="info">
                    {cat.brandCount} brands
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={bannerModal}
        onClose={() => setBannerModal(false)}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Edit Banner Image URL
          </h2>
          <input
            type="text"
            placeholder="https://example.com/banner.jpg"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setBannerModal(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleBannerSubmit}
              disabled={bannerSubmitting || !bannerUrl}
              className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40"
            >
              {bannerSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
