"use client";

import {
  Clock3,
  ChefHat,
  ShoppingBag,
  Check,
  type LucideIcon,
} from "lucide-react";

import type { Order } from "@/types/order";
import OrderCard from "./OrderCard";
import styles from "./KanbanBoard.module.css";

interface KanbanBoardProps {
  orders: Order[];
  onOpenOrder: (order: Order) => void;
  onAction: (order: Order) => void;
}

interface Column {
  id: string;
  title: string;
  statuses: Order["status"][];
  icon: LucideIcon;
}

const columns: Column[] = [
  {
    id: "pending",
    title: "Pendientes",
    statuses: ["pending"],
    icon: Clock3,
  },
  {
    id: "preparing",
    title: "En preparación",
    statuses: ["preparing"],
    icon: ChefHat,
  },
  {
    id: "ready",
    title: "Listos para entregar",
    statuses: ["ready", "called"],
    icon: ShoppingBag,
  },
  {
    id: "delivered",
    title: "Entregados",
    statuses: ["delivered"],
    icon: Clock3,
  },
];

export default function KanbanBoard({
  orders,
  onOpenOrder,
  onAction,
}: KanbanBoardProps) {
  return (
    <section className={styles.board}>
      {columns.map((column) => {
        const columnOrders = orders.filter((order) =>
          column.statuses.includes(order.status)
        );

        const visibleOrders =
          column.id === "delivered"
            ? [...columnOrders]
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .slice(0, 5)
            : columnOrders;

        return (
          <article
            key={column.id}
            className={styles.column}
          >
            <header className={styles.columnHeader}>
              <div className={styles.columnHeading}>
                {column.id === "delivered" ? (
                  <span className={styles.deliveredIcon}>
                    <Check
                      size={25}
                      strokeWidth={3}
                    />
                  </span>
                ) : (
                  (() => {
                    const ColumnIcon = column.icon;

                    return (
                      <ColumnIcon
                        size={38}
                        strokeWidth={2.1}
                        className={styles.columnIcon}
                      />
                    );
                  })()
                )}

                <span className={styles.columnTitle}>
                  {column.title}
                </span>
              </div>

              <span className={styles.columnCount}>
                {visibleOrders.length}
              </span>
            </header>

            <div className={styles.columnContent}>
              {visibleOrders.length === 0 ? (
                <div className={styles.emptyColumn}>
                  No hay pedidos
                </div>
              ) : (
                visibleOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOpen={() => onOpenOrder(order)}
                    onAction={() => onAction(order)}
                  />
                ))
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}