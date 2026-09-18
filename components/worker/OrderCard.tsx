"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Megaphone,
  UserRound,
} from "lucide-react";

import type { Order } from "@/types/order";

import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: Order;
  onOpen: (order: Order) => void;
  onAction: (order: Order) => void;
}

const actionConfig = {
  pending: {
    label: "Pasar a preparación",
    icon: ChefHat,
  },

  preparing: {
    label: "Marcar como listo",
    icon: CheckCircle2,
  },

  ready: {
    label: "Llamar a recoger",
    icon: Megaphone,
  },

  called: {
    label: "Marcar como entregado",
    icon: CheckCircle2,
  },

  delivered: {
    label: "Entregado",
    icon: CheckCircle2,
  },
} as const;

export default function OrderCard({
  order,
  onOpen,
  onAction,
}: OrderCardProps) {
  const action = actionConfig[order.status];

  const ActionIcon = action.icon;

  return (
    <article
      className={`${styles.card} ${
        order.status === "delivered"
          ? styles.delivered
          : ""
      }`}
    >
      {/* Información principal del estudiante */}
      <button
        className={styles.mainInfo}
        onClick={() => onOpen(order)}
        aria-label={`Ver pedido de ${order.student}`}
      >
        <div className={styles.userIcon}>
          <UserRound
            size={18}
            strokeWidth={2.3}
          />
        </div>

        <div className={styles.student}>
          <strong>{order.student}</strong>

          <span>
            ID: {order.studentId}
          </span>
        </div>

        <div className={styles.time}>
          {order.time}
        </div>

        <ArrowRight
          size={21}
          strokeWidth={2.2}
          className={styles.arrow}
        />
      </button>

      {/* Estado del estudiante */}
      {order.status === "called" && (
        <div className={styles.calledStatus}>
          <span className={styles.calledDot} />

          <span>
            Estudiante avisado
          </span>
        </div>
      )}

      {/* Acción */}
      <button
        className={`${styles.actionButton} ${
          order.status === "delivered"
            ? styles.actionDisabled
            : ""
        }`}
        onClick={() => onAction(order)}
        disabled={order.status === "delivered"}
      >
        <ActionIcon
          size={18}
          strokeWidth={2.3}
        />

        <span>
          {action.label}
        </span>

        {order.status === "delivered" &&
          order.deliveredAt && (
            <span className={styles.deliveredTime}>
              · {order.deliveredAt}
            </span>
          )}
      </button>
    </article>
  );
}