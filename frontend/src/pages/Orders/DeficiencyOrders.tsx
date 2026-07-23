import OrderListPage from "./OrderListPage";

export default function DeficiencyOrders() {
  return (
    <OrderListPage
      title="Deficiency Orders"
      subtitle="Orders with insufficient stock awaiting customer response"
      status="DEFICIENCY"
    />
  );
}
