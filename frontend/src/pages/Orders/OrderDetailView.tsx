import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
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

interface OrderDetailViewProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
  actionLoading: boolean;
  setPopupMsg: (msg: string) => void;
}

export function OrderDetailView({ order, isOpen, onClose, onAction, actionLoading, setPopupMsg }: OrderDetailViewProps) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [deficiencyModalOpen, setDeficiencyModalOpen] = useState(false);
  const [defQtys, setDefQtys] = useState<Record<string, string>>({});
  const [defNotExist, setDefNotExist] = useState<Record<string, boolean>>({});

  if (!order) return null;

  const isNew = order.status === "NEW";
  const isDeficiency = order.status === "DEFICIENCY";
  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const isProcessing = ["PREPARED", "READY", "PICKED"].includes(order.status);
  const isDelivered = order.status === "DELIVERED";
  const isCanceled = order.status === "CANCELED";
  const isPickup = order.deliveryMethod === "PICKUP";

  const nextStep = (() => {
    if (isNew) return null;
    if (isDeficiency) return null;
    if (isPendingPayment) return "Confirm Payment";
    if (order.status === "PREPARED") return "Mark Ready";
    if (order.status === "READY" && isPickup) return "Mark Delivered";
    if (order.status === "READY") return "Mark Picked";
    if (order.status === "PICKED") return "Mark Delivered";
    return null;
  })();

  function handleFlagDeficiency() {
    const items = order.items.map((i) => ({
      itemId: i.id,
      quantityAvailable: defQtys[i.id] != null ? Number(defQtys[i.id]) : Number(i.quantityRequested),
    }));
    if (items.length === 0) {
      setPopupMsg("No items have insufficient quantity. Lower some available qty first.");
      return;
    }
    onAction("flag-deficiency", { items });
    setDeficiencyModalOpen(false);
    setDefQtys({});
  }

  function handleCancel() {
    if (!cancelReason.trim()) return;
    onAction("cancel", { reason: cancelReason });
    setCancelModalOpen(false);
    setCancelReason("");
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-6">
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Order #{order.orderNo}
            </h2>
            <Badge size="sm" variant="light" color={STATUS_COLORS[order.status] || "info"}>
              {order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03]">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Shop</p>
              <p className="font-medium text-sm">{order.shopName}</p>
              <p className="text-xs text-gray-500">Location: {order.shopCode}</p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03]">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Customer</p>
              <p className="font-medium text-sm">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-xs text-gray-500">{order.customerEmail}</p>}
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03]">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery</p>
              <p className="font-medium text-sm">{order.deliveryDate || "—"} {order.deliveryTimeWindow && `(${order.deliveryTimeWindow})`}</p>
              <p className="text-xs text-gray-500">{order.deliveryLocation || "—"}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/[0.03]">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Purchase Order</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p><span className="text-gray-500">Status:</span> <Badge size="sm" variant="light" color={STATUS_COLORS[order.status] || "info"}>{order.status}</Badge></p>
              <p><span className="text-gray-500">Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
              <p><span className="text-gray-500">Order No:</span> {order.orderNo}</p>
              <p><span className="text-gray-500">Delivery Method:</span> {order.deliveryMethod || "—"}</p>
              <p><span className="text-gray-500">Payment Method:</span> {order.paymentMethod || "—"}</p>
              {order.bankName && <p><span className="text-gray-500">Bank Name:</span> {order.bankName}</p>}
              {order.paymentReferenceNo && <p><span className="text-gray-500">Payment Ref:</span> {order.paymentReferenceNo}</p>}
              {order.shipToName && <p><span className="text-gray-500">Ship To:</span> {order.shipToName} ({order.shipToPhone})</p>}
              {order.orderNote && <p className="col-span-2"><span className="text-gray-500">Note:</span> {order.orderNote}</p>}
              {order.cancellationReason && <p className="col-span-2"><span className="text-gray-500">Cancel Reason:</span> {order.cancellationReason}</p>}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Items</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Code</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Description</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">UOM</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Requested</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Available</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Unit Price</th>
                  <th className="text-right py-2 px-2 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const isReduced = item.quantityAvailable != null && item.quantityAvailable < item.quantityRequested;
                  return (
                    <tr key={item.id} className={`border-b border-gray-100 dark:border-gray-800 ${isReduced ? 'bg-red-50 dark:bg-red-500/5' : ''}`}>
                      <td className="py-2 px-2 text-gray-800">{item.itemCode}</td>
                      <td className="py-2 px-2 text-gray-800">{item.itemDescription}</td>
                      <td className="py-2 px-2 text-gray-500">{item.uom || "—"}</td>
                      <td className="py-2 px-2 text-right text-gray-800">{item.quantityRequested}</td>
                      <td className="py-2 px-2 text-right">
                        {item.quantityAvailable != null ? (
                          <span className={isReduced ? 'text-red-600 font-semibold' : ''}>
                            {item.quantityAvailable}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                        {isReduced && (
                          <span className="text-xs text-red-500 ml-1">
                            (-{item.quantityRequested - item.quantityAvailable})
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-800">{item.unitPrice.toFixed(2)}</td>
                      <td className={`py-2 px-2 text-right ${isReduced ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>
                        {item.quantityAvailable != null
                          ? (item.quantityAvailable * item.unitPrice).toFixed(2)
                          : item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t-2 border-gray-300">
                  <td colSpan={5}></td>
                  <td className="py-2 px-2 text-right">Total</td>
                  <td className="py-2 px-2 text-right">{order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {isNew && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAction("confirm")}
                  disabled={actionLoading}
                >
                  Confirm Order
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDefQtys(
                      Object.fromEntries(order.items.map((i) => [i.id, i.quantityRequested.toString()]))
                    );
                    setDefNotExist({});
                    setDeficiencyModalOpen(true);
                  }}
                  disabled={actionLoading}
                >
                  Flag Deficiency
                </Button>
              </>
            )}

            {isDeficiency && (
              <>
                <Button size="sm" onClick={() => onAction("deficiency-accept")} disabled={actionLoading}>
                  Customer Accepted
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDefQtys(
                      Object.fromEntries(order.items.map((i) => [i.id, (i.quantityAvailable ?? i.quantityRequested).toString()]))
                    );
                    setDefNotExist({});
                    setDeficiencyModalOpen(true);
                  }}
                  disabled={actionLoading}
                >
                  Edit Deficiency
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAction("deficiency-resend")} disabled={actionLoading}>
                  Resend Notification
                </Button>
              </>
            )}

            {isPendingPayment && (
              <Button size="sm" onClick={() => onAction("confirm-payment")} disabled={actionLoading}>
                Confirm Payment
              </Button>
            )}

            {isProcessing && (
              <Button
                size="sm"
                onClick={() => onAction("advance")}
                disabled={actionLoading}
              >
                {nextStep}
              </Button>
            )}

            {!isDelivered && !isCanceled && (
              <Button size="sm" variant="outline" onClick={() => setCancelModalOpen(true)}>
                Cancel Order
              </Button>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Status History</p>
            <div className="space-y-2">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="flex items-center gap-3 text-sm p-2 rounded bg-gray-50 dark:bg-white/[0.03]">
                  <Badge size="sm" variant="light" color={STATUS_COLORS[h.fromStatus] || "info"}>{h.fromStatus}</Badge>
                  <span>→</span>
                  <Badge size="sm" variant="light" color={STATUS_COLORS[h.toStatus] || "info"}>{h.toStatus}</Badge>
                  <span className="text-gray-500 text-xs ml-auto">{new Date(h.changedAt).toLocaleString()}</span>
                  {h.reason && <span className="text-gray-400 text-xs">({h.reason})</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} className="max-w-md p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Cancel Order</h3>
        <p className="text-sm text-gray-500 mb-3">Are you sure you want to cancel this order? Please provide a reason.</p>
        <Input
          placeholder="Cancellation reason"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => { setCancelModalOpen(false); setCancelReason(""); }}>
            Back
          </Button>
          <Button size="sm" onClick={handleCancel} disabled={actionLoading || !cancelReason.trim()}>
            Confirm Cancel
          </Button>
        </div>
      </Modal>

      <Modal isOpen={deficiencyModalOpen} onClose={() => setDeficiencyModalOpen(false)} className="max-w-lg p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Flag Deficiency</h3>
        <p className="text-sm text-gray-500 mb-3">Set available quantity lower than requested for items that are deficient.</p>
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-1 text-gray-500 font-medium">Item</th>
              <th className="text-right py-2 px-1 text-gray-500 font-medium">Requested</th>
              <th className="text-right py-2 px-1 text-gray-500 font-medium">Available</th>
              <th className="text-center py-2 px-1 text-gray-500 font-medium">Not Exist</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => {
              const notExist = !!defNotExist[item.id];
              const wasFlagged = item.quantityAvailable != null && item.quantityAvailable < item.quantityRequested;
              const originalQty = item.quantityAvailable ?? item.quantityRequested;
              const currentVal = defQtys[item.id];
              const isChanged = wasFlagged || (currentVal !== undefined && Number(currentVal) !== Number(originalQty));
              return (
                <tr key={item.id} className={`border-b border-gray-100 dark:border-gray-800 ${isChanged ? 'bg-red-50 dark:bg-red-500/10' : ''}`}>
                  <td className="py-2 px-1 text-gray-800">
                    <span className="font-medium">{item.itemCode}</span>
                    <span className="text-gray-500 ml-1">— {item.itemDescription}</span>
                  </td>
                  <td className="py-2 px-1 text-right text-gray-800">{item.quantityRequested}</td>
                  <td className="py-2 px-1 text-right">
                    {notExist ? (
                      <span className="text-red-500 text-xs font-medium">Item not available</span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        className={`w-20 text-right border rounded px-2 py-1 text-sm ${isChanged ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-300'}`}
                        value={currentVal ?? originalQty.toString()}
                        onChange={(e) =>
                          setDefQtys((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                      />
                    )}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <input
                      type="checkbox"
                      className="accent-red-500 w-4 h-4 cursor-pointer"
                      checked={notExist}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setDefNotExist((prev) => ({ ...prev, [item.id]: checked }));
                        if (checked) {
                          setDefQtys((prev) => ({ ...prev, [item.id]: "0" }));
                        } else {
                          setDefQtys((prev) => ({ ...prev, [item.id]: originalQty.toString() }));
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => { setDeficiencyModalOpen(false); setDefQtys({}); setDefNotExist({}); }}>
            Back
          </Button>
          <Button size="sm" onClick={handleFlagDeficiency} disabled={actionLoading}>
            Flag Deficiency
          </Button>
        </div>
      </Modal>
    </>
  );
}
