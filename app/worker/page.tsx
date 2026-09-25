"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import Header from "@/components/worker/Header";
import KanbanBoard from "@/components/worker/KanbanBoard";
import OrderDetail from "@/components/worker/OrderDetail";
import BottomNav, {
  type WorkerModule,
} from "@/components/worker/BottomNav";

import { useOrders } from "@/features/orders/hooks/useOrders";
import type { Order } from "@/types/order";

export default function WorkerPage() {
  const {
    orders,
    loading,
    error,
    actionError,
    isPriorityError,
    handleOrderAction,
    clearActionError,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [search, setSearch] =
    useState("");

  const [activeModule, setActiveModule] =
    useState<WorkerModule>("orders");

  const [, setNow] = useState(0);

  /* =======================================================
     ACTUALIZACIÓN DEL RELOJ
     ======================================================= */

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  /* =======================================================
     FILTRAR PEDIDOS
     ======================================================= */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const matchesStudent = order.student
        .toLowerCase()
        .includes(query);

      const matchesId = order.studentId
        .toLowerCase()
        .includes(query);

      const matchesProduct = order.items.some(
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
    });
  }, [orders, search]);

  /* =======================================================
     ACCIÓN SOBRE PEDIDO
     ======================================================= */

  const onOrderAction = async (order: Order) => {
    const updatedOrder =
      await handleOrderAction(order);

    if (!updatedOrder) {
      return;
    }

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === updatedOrder.id
        ? updatedOrder
        : currentOrder
    );
  };

  /* =======================================================
     RENDERIZAR MÓDULO
     ======================================================= */

  const renderModule = () => {
    if (activeModule === "orders") {
      if (loading) {
        return (
          <section
            style={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              color:
                "rgba(255,255,255,.8)",
            }}
          >
            <p>Cargando pedidos...</p>
          </section>
        );
      }

      if (error) {
        return (
          <section
            style={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              color:
                "rgba(255,255,255,.8)",
            }}
          >
            <p>{error}</p>
          </section>
        );
      }

      return (
        <KanbanBoard
          orders={filteredOrders}
          onOpenOrder={setSelectedOrder}
          onAction={onOrderAction}
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
          <strong>{activeModule}</strong>
        </p>
      </section>
    );
  };

  return (
    <main className="worker-page">
      {/* =================================================
          LOGO CENTRAL TRANSPARENTE
          ================================================= */}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "52%",
          left: "50%",
          transform:
            "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          opacity: 0.09,
          pointerEvents: "none",
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        
      </div>

      <Header
        search={search}
        onSearchChange={setSearch}
      />

      <div className="worker-main">
        {renderModule()}
      </div>

      <BottomNav
        activeModule={activeModule}
        onChange={setActiveModule}
      />

      <OrderDetail
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onAction={onOrderAction}
      />

      {actionError && (
        <div
          role="alert"
          onClick={clearActionError}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "rgba(0, 0, 0, 0.18)",
            backdropFilter:
              "blur(4px)",
            padding: "24px",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width:
                "min(440px, 100%)",
              background:
                "rgba(255, 255, 255, 0.98)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow:
                "0 24px 70px rgba(0,0,0,.25)",
              textAlign: "center",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#fee2e2",
                color: "#dc2626",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              !
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              {isPriorityError
                ? "Acción no disponible"
                : "No se pudo completar la acción"}
            </h2>

            <p
              style={{
                margin: "0 0 24px",
                fontSize: "15px",
                lineHeight: 1.5,
                color: "#5d6678",
              }}
            >
              {actionError}
            </p>

            <button
              type="button"
              onClick={clearActionError}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "14px",
                padding: "13px 18px",
                background: "#0b63ce",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
