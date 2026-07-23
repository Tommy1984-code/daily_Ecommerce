import { useOrderList } from "./useOrderList";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailView } from "./OrderDetailView";
import { DateFilter } from "../../components/ui/date-filter";
import { Input } from "../../components/ui/shadcn/input";
import { Search } from "lucide-react";
import Popup from "../../components/ui/popup/Popup";
interface OrderListPageProps {
  title: string;
  subtitle: string;
  status: string;
}

export default function OrderListPage({ title, subtitle, status }: OrderListPageProps) {
  const {
    orders, loading, totalCount, page, pageSize, search, dateFilter,
    selectedOrder, showDetail, actionLoading,
    popupMsg, popupType, setPopupMsg,
    setPage, handleSearchChange, handleDateFilterChange, handlePageSizeChange,
    handleView, handleCloseDetail, handleAction,
  } = useOrderList({ status });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search order no, customer..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <DateFilter value={dateFilter} onChange={handleDateFilterChange} />
      </div>

      <OrdersTable
        title={title}
        subtitle={subtitle}
        orders={orders}
        loading={loading}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onView={handleView}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
      <OrderDetailView
        order={selectedOrder}
        isOpen={showDetail}
        onClose={handleCloseDetail}
        onAction={handleAction}
        actionLoading={actionLoading}
        setPopupMsg={setPopupMsg}
      />
      <Popup
        isOpen={!!popupMsg}
        onClose={() => setPopupMsg("")}
        message={popupMsg}
        type={popupType}
      />
    </>
  );
}
