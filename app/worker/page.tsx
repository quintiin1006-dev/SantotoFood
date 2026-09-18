"use client";

import {
  useMemo,
  useState,
} from "react";

import Header from "@/components/worker/Header";

import KanbanBoard from "@/components/worker/KanbanBoard";

import OrderDetail from "@/components/worker/OrderDetail";

import BottomNav, {
  type WorkerModule,
} from "@/components/worker/BottomNav";

import { initialOrders } from "@/data/orders";

import type {
  Order,
  OrderStatus,
} from "@/types/order";

export default function WorkerPage() {
  const [orders, setOrders] =
    useState<Order[]>(initialOrders);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [search, setSearch] =
    useState("");

  const [activeModule, setActiveModule] =
    useState<WorkerModule>("orders");

  /*
   * ======================================================
   * BÚSQUEDA
   * ======================================================
   */

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter(
      (order) => {
        const matchesStudent =
          order.student
            .toLowerCase()
            .includes(query);

        const matchesId =
          order.studentId
            .toLowerCase()
            .includes(query);

        const matchesProduct =
          order.items.some(
            (item) =>
              item.name
                .toLowerCase()
                .includes(query)
          );

        return (
          matchesStudent ||
          matchesId ||
          matchesProduct
        );
      }
    );
  }, [orders, search]);

  /*
   * ======================================================
   * CAMBIO DE ESTADO
   * ======================================================
   */

  const updateOrderStatus = (
    order: Order,
    status: OrderStatus
  ) => {
    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (currentOrder) =>
            currentOrder.id ===
            order.id
              ? {
                  ...currentOrder,
                  status,
                }
              : currentOrder
        )
    );

    setSelectedOrder(null);
  };

  /*
   * ======================================================
   * ACCIONES DEL PEDIDO
   * ======================================================
   *
   * Flujo:
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

  const handleOrderAction = (
    order: Order
  ) => {
    switch (order.status) {
      /*
       * PEDIDO RECIBIDO
       */

      case "pending":
        updateOrderStatus(
          order,
          "preparing"
        );

        break;

      /*
       * PEDIDO EN PREPARACIÓN
       */

      case "preparing":
        updateOrderStatus(
          order,
          "ready"
        );

        break;

      /*
       * PEDIDO LISTO
       *
       * El trabajador llama al estudiante.
       */

      case "ready":
        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (currentOrder) =>
                currentOrder.id ===
                order.id
                  ? {
                      ...currentOrder,

                      status: "called",

                      calledAt:
                        new Date().toISOString(),
                    }
                  : currentOrder
            )
        );

        setSelectedOrder(null);

        break;

      /*
       * ESTUDIANTE AVISADO
       *
       * El trabajador confirma que
       * entregó físicamente el pedido.
       */

      case "called":
        updateOrderStatus(
          order,
          "delivered"
        );

        break;

      /*
       * PEDIDO FINALIZADO
       */

      case "delivered":
        break;
    }
  };

  /*
   * ======================================================
   * MÓDULOS
   * ======================================================
   */

  const renderModule = () => {
    if (
      activeModule === "orders"
    ) {
      return (
        <KanbanBoard
          orders={filteredOrders}
          onOpenOrder={
            setSelectedOrder
          }
          onAction={
            handleOrderAction
          }
        />
      );
    }

    return (
      <section
        style={{
          flex: 1,

          display: "grid",

          placeItems: "center",

          color:
            "rgba(255,255,255,.7)",
        }}
      >
        <p>
          Módulo de{" "}
          <strong>
            {activeModule}
          </strong>
        </p>
      </section>
    );
  };

  /*
   * ======================================================
   * INTERFAZ
   * ======================================================
   */

  return (
    <main className="worker-page">

      <Header
        search={search}
        onSearchChange={
          setSearch
        }
      />

      <div className="worker-main">
        {renderModule()}
      </div>

      <BottomNav
        activeModule={
          activeModule
        }
        onChange={
          setActiveModule
        }
      />

      <OrderDetail
        order={
          selectedOrder
        }
        onClose={() =>
          setSelectedOrder(
            null
          )
        }
        onAction={
          handleOrderAction
        }
      />

    </main>
  );
}