"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  AlertTriangle,
  Clock3,
  X,
} from "lucide-react";

import {
  ACTION_ICONS,
  ACTION_LABELS,
} from "@/lib/orderWorkflow";

import { formatRelativeTime } from "@/lib/orderTime";

import type { Order } from "@/types/order";

import styles from "./OrderDetail.module.css";

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  onAction: (order: Order) => void;
}

const FOCUSABLE_SELECTOR = [
  "button",
  "[href]",
  "input",
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function OrderDetail({
  order,
  onClose,
  onAction,
}: OrderDetailProps) {
  const modalRef =
    useRef<HTMLDivElement>(null);

  const closeRef =
    useRef<HTMLButtonElement>(null);

  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!order) {
      return;
    }

    const previouslyFocused =
      document.activeElement as HTMLElement | null;

    closeRef.current?.focus();

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onCloseRef.current();

        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modal =
        modalRef.current;

      if (!modal) {
        return;
      }

      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR
        )
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];

      const last =
        focusable[focusable.length - 1];

      const active =
        document.activeElement;

      if (
        event.shiftKey &&
        active === first
      ) {
        event.preventDefault();

        last.focus();
      } else if (
        !event.shiftKey &&
        active === last
      ) {
        event.preventDefault();

        first.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";

      previouslyFocused?.focus();
    };
  }, [order]);

  if (!order) {
    return null;
  }

  const ActionIcon =
    ACTION_ICONS[order.status];

  return (
    <div
      ref={modalRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside className={styles.modal}>
        {/* Cerrar */}
        <button
          ref={closeRef}
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
            <h2 id="order-detail-title">
              {order.student}
            </h2>

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
              {formatRelativeTime(order.createdAt)}
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
          <ActionIcon size={18} />

          <span>
            {ACTION_LABELS[order.status]}
          </span>
        </button>
      </aside>
    </div>
  );
}