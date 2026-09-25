"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  advanceOrder,
  getOrders,
} from "@/features/orders/api/orderApi";
import type { Order } from "@/types/order";

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  actionError: string | null;
  isPriorityError: boolean;
  handleOrderAction: (
    order: Order
  ) => Promise<Order | null>;
  clearActionError: () => void;
}

interface ApiError extends Error {
  status?: number;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const [isPriorityError, setIsPriorityError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setError(null);
        const loadedOrders = await getOrders();

        if (!cancelled) {
          setOrders(loadedOrders);
        }
      } catch {
        if (!cancelled) {
          setError(
            "No se pudieron cargar los pedidos."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearActionError = useCallback(() => {
    setActionError(null);
    setIsPriorityError(false);
  }, []);

  const handleOrderAction = useCallback(
    async (order: Order) => {
      clearActionError();

      if (order.status === "delivered") {
        return null;
      }

      try {
        const updatedOrder =
          await advanceOrder(order);

        setOrders((currentOrders) =>
          currentOrders.map((currentOrder) =>
            currentOrder.id === updatedOrder.id
              ? updatedOrder
              : currentOrder
          )
        );

        return updatedOrder;
      } catch (error) {
        const apiError = error as ApiError;

        if (apiError.status === 409) {
          setIsPriorityError(true);
          setActionError(
            "Primero prepara el pedido anterior para continuar."
          );
        } else if (error instanceof Error) {
          setActionError(error.message);
        } else {
          setActionError(
            "No se pudo actualizar el pedido."
          );
        }

        return null;
      }
    },
    [clearActionError]
  );

  return {
    orders,
    loading,
    error,
    actionError,
    isPriorityError,
    handleOrderAction,
    clearActionError,
  };
}
