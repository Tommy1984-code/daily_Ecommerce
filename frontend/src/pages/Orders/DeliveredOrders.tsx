import OrderListPage from "./OrderListPage";

export default function DeliveredOrders() {
  return (
    <OrderListPage
      title="Delivered Orders"
      subtitle="Completed deliveries"
      status="DELIVERED"
    />
  );
}
