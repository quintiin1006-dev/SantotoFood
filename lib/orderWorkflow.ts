import {
  CheckCircle2,
  ChefHat,
  Megaphone,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
} from "@/types/order";

/*
 * ======================================================
 * MÁQUINA DE ESTADOS DEL PEDIDO
 * ======================================================
 *
 * pending
 *    ↓
 * preparing
 *    ↓
 * ready
 *    ↓
 * called
 *    ↓
 * delivered
 */

export const ORDER_FLOW: readonly OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "called",
  "delivered",
];

export const ACTION_LABELS: Record<
  OrderStatus,
  string
> = {
  pending: "Pasar a preparación",
  preparing: "Marcar como listo",
  ready: "Llamar a recoger",
  called: "Marcar como entregado",
  delivered: "Entregado",
};

export const ACTION_ICONS: Record<
  OrderStatus,
  typeof ChefHat
> = {
  pending: ChefHat,
  preparing: CheckCircle2,
  ready: Megaphone,
  called: CheckCircle2,
  delivered: CheckCircle2,
};

/*
 * ======================================================
 * TRANSICIONES
 * ======================================================
 */

export function getNextStatus(
  status: OrderStatus
): OrderStatus | null {
  const index = ORDER_FLOW.indexOf(status);

  if (
    index < 0 ||
    index >= ORDER_FLOW.length - 1
  ) {
    return null;
  }

  return ORDER_FLOW[index + 1];
}

export function canAdvanceOrder(
  order: Order
): boolean {
  return (
    getNextStatus(order.status) !== null
  );
}

/**
 * Estados que se agrupan visualmente en una
 * misma columna del kanban. La columna "ready"
 * también contiene los pedidos "called".
 */
export function getColumnStatuses(
  columnStatus: OrderStatus
): readonly OrderStatus[] {
  if (columnStatus === "ready") {
    return ["ready", "called"];
  }

  return [columnStatus];
}

/**
 * Devuelve una nueva orden con el estado
 * siguiente (no muta la original).
 */
export function advanceOrder(
  order: Order
): Order {
  const nextStatus = getNextStatus(
    order.status
  );

  if (!nextStatus) {
    return order;
  }

  const now = new Date().toISOString();

  return {
    ...order,

    status: nextStatus,

    calledAt:
      nextStatus === "called"
        ? now
        : order.calledAt,

    deliveredAt:
      nextStatus === "delivered"
        ? now
        : order.deliveredAt,
  };
}