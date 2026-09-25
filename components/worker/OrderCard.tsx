"use client";

import {
  ArrowRight,
  UserRound,
} from "lucide-react";

import {
  ACTION_ICONS,
  ACTION_LABELS,
} from "@/lib/orderWorkflow";

import {
  formatClockTime,
  formatRelativeTime,
} from "@/lib/orderTime";

import type { Order } from "@/types/order";

import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: Order;
  onOpen: (order: Order) => void;
  onAction: (order: Order) => void;
}

export default function OrderCard({
  order,
  onOpen,
  onAction,
}: OrderCardProps) {
  const ActionIcon =
    ACTION_ICONS[order.status];

  const actionLabel =
    ACTION_LABELS[order.status];

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
        type="button"
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
          <strong>
            {order.student}
          </strong>

          <span>
            ID: {order.studentId}
          </span>
        </div>

        <div className={styles.time}>
          {formatRelativeTime(
            order.createdAt
          )}
        </div>

        <ArrowRight
          size={21}
          strokeWidth={2.2}
          className={styles.arrow}
        />
      </button>

      {/* Estado del estudiante */}
      {order.status === "called" && (
        <div
          className={
            styles.calledStatus
          }
        >
          <span
            className={
              styles.calledDot
            }
          />

          <span>
            Estudiante avisado
          </span>
        </div>
      )}

      {/* Acción */}
      <button
        type="button"
        className={`${styles.actionButton} ${
          order.status === "delivered"
            ? styles.actionDisabled
            : ""
        }`}
        onClick={() =>
          onAction(order)
        }
        disabled={
          order.status ===
          "delivered"
        }
        aria-label={
          order.status ===
          "delivered"
            ? "Pedido entregado"
            : actionLabel
        }
      >
        <ActionIcon
          size={18}
          strokeWidth={2.3}
        />

        <span>
          {actionLabel}
        </span>

        {order.status ===
          "delivered" &&
          order.deliveredAt && (
            <span
              className={
                styles.deliveredTime
              }
            >
              ·{" "}
              {formatClockTime(
                order.deliveredAt
              )}
            </span>
          )}
      </button>
    </article>
  );
}