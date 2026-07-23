import OrderListPage from "./OrderListPage";

export default function ProcessingOrders() {
  return (
    <OrderListPage
      title="Processing Orders"
      subtitle="Orders being prepared, ready, or picked up"
      status="PREPARED,READY,PICKED"
    />
  );
}
