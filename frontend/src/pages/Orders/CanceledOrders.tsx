import OrderListPage from "./OrderListPage";

export default function CanceledOrders() {
  return (
    <OrderListPage
      title="Canceled Orders"
      subtitle="Orders that have been canceled"
      status="CANCELED"
      extraColumns={["status", "amount"]}
    />
  );
}
