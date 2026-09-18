"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Clock3,
  Megaphone,
  X,
} from "lucide-react";

import type { Order } from "@/types/order";

import styles from "./OrderDetail.module.css";

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  onAction: (order: Order) => void;
}

const actionLabels = {
  pending: "Pasar a preparación",
  preparing: "Marcar como listo",
  ready: "Llamar a recoger",
  called: "Marcar como entregado",
  delivered: "Pedido entregado",
} as const;

export default function OrderDetail({
  order,
  onClose,
  onAction,
}: OrderDetailProps) {
  if (!order) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside className={styles.modal}>
        {/* Cerrar */}
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar detalles"
        >
          <X size={20} />
        </button>

        {/* Información del estudiante */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            {order.student.charAt(0)}
          </div>

          <div>
            <h2>{order.student}</h2>

            <p>
              ID: {order.studentId}
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Detalles del pedido */}
        <section className={styles.section}>
          <h3>Detalles del pedido</h3>

          <div className={styles.items}>
            {order.items.map((item) => (
              <div
                key={item.name}
                className={styles.item}
              >
                <span>
                  {item.quantity} × {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Observaciones */}
        {order.note && (
          <>
            <div className={styles.divider} />

            <section className={styles.section}>
              <div
                className={styles.sectionTitle}
              >
                <AlertTriangle size={17} />

                <h3>
                  Observaciones
                </h3>
              </div>

              <p className={styles.note}>
                {order.note}
              </p>
            </section>
          </>
        )}

        <div className={styles.divider} />

        {/* Tiempo */}
        <section className={styles.timeInfo}>
          <Clock3 size={18} />

          <div>
            <span>
              Tiempo de pedido
            </span>

            <strong>
              {order.time}
            </strong>
          </div>
        </section>

        {/* Acción */}
        <button
          className={styles.action}
          onClick={() => onAction(order)}
          disabled={
            order.status === "delivered"
          }
        >
          {/* Pendiente */}
          {order.status === "pending" && (
            <ChefHat size={18} />
          )}

          {/* En preparación */}
          {order.status === "preparing" && (
            <CheckCircle2 size={18} />
          )}

          {/* Listo */}
          {order.status === "ready" && (
            <Megaphone size={18} />
          )}

          {/* Estudiante avisado */}
          {order.status === "called" && (
            <CheckCircle2 size={18} />
          )}

          {/* Entregado */}
          {order.status === "delivered" && (
            <CheckCircle2 size={18} />
          )}

          <span>
            {actionLabels[order.status]}
          </span>
        </button>
      </aside>
    </div>
  );
}