import OrderListPage from "./OrderListPage";

export default function PendingPaymentOrders() {
  return (
    <OrderListPage
      title="Pending Payment"
      subtitle="Orders awaiting payment confirmation"
      status="PENDING_PAYMENT"
    />
  );
}
