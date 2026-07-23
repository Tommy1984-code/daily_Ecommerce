import api from "./api";

export type OrderStatus =
  | "NEW"
  | "DEFICIENCY"
  | "PENDING_PAYMENT"
  | "PREPARED"
  | "READY"
  | "PICKED"
  | "DELIVERED"
  | "CANCELED";

export interface OrderItem {
  id: string;
  itemCode: string;
  itemDescription: string;
  uom?: string;
  quantityRequested: number;
  quantityAvailable?: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusHistory {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy?: string;
  reason?: string;
  changedAt: string;
}

export interface Order {
  id: string;
  orderNo: string;
  shopCode: string;
  shopName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  deliveryTimeWindow?: string;
  deliveryMethod?: "PICKUP" | "DELIVERY";
  deliveryLocation?: string;
  paymentMethod?: "BANK_TRANSFER" | "TELEBIRR" | "CASH";
  bankName?: string;
  paymentReferenceNo?: string;
  paymentDescription?: string;
  shipToName?: string;
  shipToEmail?: string;
  shipToPhone?: string;
  shipToCity?: string;
  orderNote?: string;
  subtotal: number;
  total: number;
  deficiencyResponseDeadline?: string;
  paymentDeadline?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  riderId?: string;
  riderName?: string;
  deliveredAt?: string;
  canceledAt?: string;
  canceledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: StatusHistory[];
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderListParams {
  status?: string;
  shopCode?: string;
  search?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface FlagDeficiencyItem {
  itemId: string;
  quantityAvailable: number;
}

export async function getOrders(params: OrderListParams): Promise<OrderListResponse> {
  const res = await api.get("/v1/orders", { params });
  return res.data;
}

export async function getOrder(id: string): Promise<Order> {
  const res = await api.get(`/v1/orders/${id}`);
  return res.data;
}

export async function confirmOrder(id: string): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/confirm`);
  return res.data;
}

export async function flagDeficiency(id: string, items: FlagDeficiencyItem[]): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/flag-deficiency`, { items });
  return res.data;
}

export async function resendDeficiencyNotification(id: string): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/deficiency/resend-notification`);
  return res.data;
}

export async function respondDeficiency(id: string, action: "accept" | "cancel"): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/deficiency/respond`, null, {
    params: { action },
  });
  return res.data;
}

export async function confirmPayment(
  id: string,
  data?: { paymentReferenceNo?: string; paymentDescription?: string },
): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/confirm-payment`, data || {});
  return res.data;
}

export async function advanceStatus(id: string): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/advance-status`, {});
  return res.data;
}

export async function cancelOrder(id: string, reason: string): Promise<Order> {
  const res = await api.post(`/v1/orders/${id}/cancel`, { reason });
  return res.data;
}

export async function getStatusHistory(id: string): Promise<StatusHistory[]> {
  const res = await api.get(`/v1/orders/${id}/status-history`);
  return res.data;
}
