"use client";

import {
  useEffect,
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

import {
  advanceOrder,
  canAdvanceOrder,
} from "@/lib/orderWorkflow";

import type { Order } from "@/types/order";

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
   * Re-render periódico para que los tiempos
   * relativos ("Hace 5 min") se mantengan vivos.
   */

  const [, setNow] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setNow(Date.now()),
      30_000
    );

    return () => clearInterval(id);
  }, []);

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
   *
   * El flujo completo (pending → preparing →
   * ready → called → delivered) y los timestamps
   * asociados viven en lib/orderWorkflow.
   */

  const handleOrderAction = (
    order: Order
  ) => {
    if (!canAdvanceOrder(order)) {
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (currentOrder) =>
            currentOrder.id ===
            order.id
              ? advanceOrder(
                  currentOrder
                )
              : currentOrder
        )
    );

    setSelectedOrder(null);
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