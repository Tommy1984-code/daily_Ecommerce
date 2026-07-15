import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useAuth } from "../../context/AuthContext";
import {
  getDeliveryDates,
  getTimeRanges,
  getLandMarks,
  getShops,
  createLandMarkPrice,
  type DeliveryDate,
  type TimeRange,
  type LandMark,
  type Shop,
} from "../../services/productService";

export default function LandMarkPriceCreate() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [dates, setDates] = useState<DeliveryDate[]>([]);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
  const [landMarks, setLandMarks] = useState<LandMark[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);

  const [dateId, setDateId] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [landMarkCode, setLandMarkCode] = useState("");
  const [shopCode, setShopCode] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    Promise.all([
      getDeliveryDates(),
      getTimeRanges(),
      getLandMarks(),
      getShops(),
    ])
      .then(([d, t, l, s]) => {
        setDates(d);
        setTimeRanges(t);
        setLandMarks(l);
        setShops(s);
      })
      .catch((err) => console.error("Failed to load form data", err));
  }, [isAdmin, navigate]);

  const dateOptions = dates.map((d) => ({
    value: d.id,
    label: d.titleEn,
  }));

  const timeOptions = timeRanges.map((t) => ({
    value: t.timeRange,
    label: t.timeRange,
  }));

  const landMarkOptions = landMarks.map((l) => ({
    value: l.code,
    label: `${l.titleEn} (${l.code})`,
  }));

  const shopOptions = shops.map((s) => ({
    value: s.locationCode,
    label: `${s.titleEn} (${s.locationCode})`,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dateId || !timeRange || !landMarkCode || !shopCode || !price) return;
    setSubmitting(true);
    try {
      await createLandMarkPrice({
        dateId,
        timeRange,
        landMarkCode,
        shopCode,
        price: Number(price),
      });
      navigate("/product/land-mark-prices");
    } catch (err) {
      console.error("Failed to create land mark price", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta title="Create Land Mark Price | Dashboard" description="Create a new land mark price" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
            Create Land Mark Price
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add a new delivery price record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Date</label>
            <Select options={dateOptions} placeholder="Select date..." onChange={setDateId} defaultValue={dateId} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Range</label>
            <Select options={timeOptions} placeholder="Select time range..." onChange={setTimeRange} defaultValue={timeRange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Land Mark</label>
            <Select options={landMarkOptions} placeholder="Select land mark..." onChange={setLandMarkCode} defaultValue={landMarkCode} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop</label>
            <Select options={shopOptions} placeholder="Select shop..." onChange={setShopCode} defaultValue={shopCode} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (ETB)</label>
            <Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} step={0.01} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !dateId || !timeRange || !landMarkCode || !shopCode || !price}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/product/land-mark-prices")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
