import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { EyeIcon } from "../../icons";
import { DataTable, type Column } from "../../components/ui/shadcn/data-table";
import type { Order } from "../../services/orderService";

const STATUS_COLORS: Record<string, "success" | "primary" | "warning" | "info" | "danger"> = {
  NEW: "primary",
  DEFICIENCY: "warning",
  PENDING_PAYMENT: "info",
  PREPARED: "info",
  READY: "warning",
  PICKED: "primary",
  DELIVERED: "success",
  CANCELED: "danger",
};

interface OrdersTableProps {
  title: string;
  subtitle: string;
  orders: Order[];
  loading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onView: (order: Order) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function OrdersTable({
  title,
  subtitle,
  orders,
  loading,
  totalCount,
  page,
  pageSize,
  onView,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  const columns: Column<Order>[] = [
    {
      header: "Order No",
      accessor: "orderNo",
      sortable: true,
      cell: (order) => (
        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {order.orderNo}
        </span>
      ),
    },
    {
      header: "Order Date",
      accessor: "orderDate",
      sortable: true,
      cell: (order) => new Date(order.orderDate).toLocaleDateString(),
    },
    {
      header: "Shop",
      accessor: "shopName",
      sortable: true,
    },
    {
      header: "Delivery Date",
      accessor: "deliveryDate",
      cell: (order) => order.deliveryDate || "—",
    },
    {
      header: "Delivery Time",
      accessor: "deliveryTimeWindow",
      cell: (order) => order.deliveryTimeWindow || "—",
    },
    {
      header: "Customer Name",
      accessor: "customerName",
      sortable: true,
    },
    {
      header: "Phone Number",
      accessor: "customerPhone",
    },
    {
      header: "Payment Method",
      accessor: "paymentMethod",
      cell: (order) => (
        <Badge size="sm" variant="light" color="info">
          {order.paymentMethod || "—"}
        </Badge>
      ),
    },
    {
      header: "Delivery Type",
      accessor: "deliveryMethod",
      cell: (order) => (
        <Badge size="sm" variant="light" color="primary">
          {order.deliveryMethod || "—"}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      cell: (order) => (
        <Badge size="sm" variant="light" color={STATUS_COLORS[order.status] || "info"}>
          {order.status}
        </Badge>
      ),
    },
    {
      header: "Amount Due",
      accessor: "total",
      sortable: true,
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => order.total.toFixed(2),
    },
    {
      header: "Action",
      accessor: "id" as keyof Order,
      headerClassName: "text-center",
      className: "text-center",
      cell: (order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(order);
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="View order details"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageMeta title={`${title} | Dashboard`} description={subtitle} />
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        keyExtractor={(order) => order.id}
        emptyMessage="No orders found."
        hideSearch
        serverSide
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
