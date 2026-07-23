import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import type { Order, OrderListParams } from "../../services/orderService";
import * as orderService from "../../services/orderService";
import { getTodayFilter, type DateFilterValue } from "../../components/ui/date-filter";

interface UseOrderListOptions {
  status: string;
}

export function useOrderList({ status }: UseOrderListOptions) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>(getTodayFilter());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "warning" | "info">("error");

  const fetchTimer = useRef<ReturnType<typeof setTimeout>>();
  const isFirstFetch = useRef(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const dateTo = dateFilter.dateTo
        ? dateFilter.dateTo + 'T23:59:59.999Z'
        : undefined;
      const params: OrderListParams = {
        status,
        page,
        limit: pageSize,
        dateFrom: dateFilter.dateFrom,
        dateTo,
      };
      if (search.trim()) params.search = search.trim();
      const res = await orderService.getOrders(params);
      setOrders(res.data);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, [status, page, pageSize, search, dateFilter]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
      return;
    }
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      fetchOrders();
    }
  }, [isAdmin, navigate, fetchOrders]);

  useEffect(() => {
    if (isFirstFetch.current) return;
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(fetchOrders, 400);
    return () => {
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
    };
  }, [fetchOrders]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDateFilterChange = useCallback((filter: DateFilterValue) => {
    setDateFilter(filter);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  function handleView(order: Order) {
    setSelectedOrder(order);
    setShowDetail(true);
  }

  function handleCloseDetail() {
    setShowDetail(false);
    setSelectedOrder(null);
  }

  async function handleAction(action: string, data?: any) {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      let result: Order | undefined;
      switch (action) {
        case "confirm":
          result = await orderService.confirmOrder(selectedOrder.id);
          break;
        case "flag-deficiency":
          result = await orderService.flagDeficiency(selectedOrder.id, data.items);
          break;
        case "deficiency-accept":
          result = await orderService.respondDeficiency(selectedOrder.id, "accept");
          break;
        case "deficiency-resend":
          result = await orderService.resendDeficiencyNotification(selectedOrder.id);
          break;
        case "confirm-payment":
          result = await orderService.confirmPayment(selectedOrder.id);
          break;
        case "advance":
          result = await orderService.advanceStatus(selectedOrder.id);
          break;
        case "cancel":
          result = await orderService.cancelOrder(selectedOrder.id, data.reason);
          break;
      }
      if (result) {
        setSelectedOrder(result);
        fetchOrders();
        setPopupMsg(`Order ${action.replace("-", " ")} successful`);
        setPopupType("success");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Action failed";
      setPopupMsg(msg);
      setPopupType("error");
    } finally {
      setActionLoading(false);
    }
  }

  return {
    orders,
    loading,
    totalCount,
    totalPages,
    page,
    pageSize,
    search,
    dateFilter,
    selectedOrder,
    showDetail,
    actionLoading,
    popupMsg,
    popupType,
    setPopupMsg,
    setPage,
    handleSearchChange,
    handleDateFilterChange,
    handlePageSizeChange,
    handleView,
    handleCloseDetail,
    handleAction,
  };
}
