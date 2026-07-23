import OrderListPage from "./OrderListPage";

export default function NewOrders() {
  return (
    <OrderListPage
      title="New Orders"
      subtitle="Orders awaiting confirmation"
      status="NEW"
    />
  );
}
