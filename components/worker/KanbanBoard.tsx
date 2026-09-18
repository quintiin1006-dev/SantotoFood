"use client";

import {
  Check,
  ChefHat,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import { getColumnStatuses } from "@/lib/orderWorkflow";

import type {
  Order,
  OrderStatus,
} from "@/types/order";

import OrderCard from "./OrderCard";

import styles from "./KanbanBoard.module.css";

interface KanbanBoardProps {
  orders: Order[];

  onOpenOrder: (order: Order) => void;

  onAction: (order: Order) => void;
}

interface Column {
  status: OrderStatus;
  title: string;
  icon: typeof Clock3;
}

const columns: Column[] = [
  {
    status: "pending",
    title: "Pendientes",
    icon: Clock3,
  },

  {
    status: "preparing",
    title: "En preparación",
    icon: ChefHat,
  },

  {
    status: "ready",
    title: "Listos para entregar",
    icon: ShoppingBag,
  },

  {
    status: "delivered",
    title: "Entregados",
    icon: Check,
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
        const Icon = column.icon;

        const columnOrders = orders.filter(
          (order) => {
            const statuses =
              getColumnStatuses(
                column.status
              );

            return (
              statuses.includes(
                order.status
              )
            );
          }
        );

        return (
          <section
            key={column.status}
            className={`${styles.column} ${
              styles[
                `column-${column.status}`
              ]
            }`}
          >
            <header
              className={styles.columnHeader}
            >
              <div
                className={styles.columnTitle}
              >
                <div
                  className={styles.columnIcon}
                >
                  <Icon
                    size={25}
                    strokeWidth={2.1}
                  />
                </div>

                <h2>
                  {column.title}
                </h2>
              </div>

              <span className={styles.count}>
                {columnOrders.length}
              </span>
            </header>

            <div className={styles.orders}>
              {columnOrders.length > 0 ? (
                columnOrders.map(
                  (order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onOpen={onOpenOrder}
                      onAction={onAction}
                    />
                  )
                )
              ) : (
                <div className={styles.empty}>
                  No hay pedidos
                </div>
              )}
            </div>
          </section>
        );
      })}
    </section>
  );
}