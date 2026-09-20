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

import type { Order } from "@/types/order";

const API_URL = "http://localhost:8080";

const CAFETERIA_ID =
  "59ac35a8-1c1c-4081-8720-2d517d8740bd";


/* =========================================================
   ITEM QUE VIENE DEL BACKEND
   ========================================================= */

interface BackendOrderItem {
  id: string;

  orderId: string;

  lunchId: string;

  lunchName: string;

  unitPrice: number;

  quantity: number;

  beverageChoice: string | null;

  note: string | null;

  subtotal: number;
}


/* =========================================================
   PEDIDO QUE VIENE DEL BACKEND
   ========================================================= */

interface BackendOrder {
  id: string;

  cafeteriaId: string;

  clientId: string | null;

  clientName: string;

  clientDocument: string | null;

  status:
    | "PENDING"
    | "PREPARING"
    | "READY"
    | "CALLED"
    | "DELIVERED"
    | "CANCELLED";

  total: number;

  cancellationDeadline: string | null;

  createdAt: string;

  updatedAt: string;

  items: BackendOrderItem[];
}


/* =========================================================
   CONVERTIR ESTADO BACKEND → FRONTEND
   ========================================================= */

function mapOrderStatus(
  status: BackendOrder["status"]
): Order["status"] {

  switch (status) {

    case "PENDING":
      return "pending";

    case "PREPARING":
      return "preparing";

    case "READY":
      return "ready";

    case "CALLED":
      return "called";

    case "DELIVERED":
      return "delivered";

    case "CANCELLED":
      return "pending";

    default:
      return "pending";
  }
}


/* =========================================================
   CONVERTIR PEDIDO BACKEND → FRONTEND
   ========================================================= */

function mapBackendOrder(
  backendOrder: BackendOrder
): Order {

  return {

    id:
      backendOrder.id,

    student:
      backendOrder.clientName,

    studentId:
      backendOrder.clientDocument ?? "",

    createdAt:
      backendOrder.createdAt,

    updatedAt:
      backendOrder.updatedAt,

    items:
      backendOrder.items.map(
        (item) => ({
          id:
            item.id,

          name:
            item.lunchName,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          beverageChoice:
            item.beverageChoice
              ?? undefined,

          note:
            item.note
              ?? undefined,

          subtotal:
            item.subtotal,
        })
      ),

    total:
      backendOrder.total,

    status:
      mapOrderStatus(
        backendOrder.status
      ),
  };
}


/* =========================================================
   WORKER PAGE
   ========================================================= */

export default function WorkerPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [search, setSearch] =
    useState("");

  const [activeModule, setActiveModule] =
    useState<WorkerModule>("orders");

  const [loading, setLoading] =
    useState(true);

  /*
   * Error utilizado únicamente
   * para problemas cargando pedidos.
   */
  const [error, setError] =
    useState<string | null>(null);

  /*
   * Error utilizado para acciones
   * realizadas sobre los pedidos.
   */
  const [actionError, setActionError] =
    useState<string | null>(null);

  /*
   * Indica si el error corresponde
   * a la regla FIFO.
   */
  const [isPriorityError, setIsPriorityError] =
    useState(false);


  /* =======================================================
     CARGAR PEDIDOS
     ======================================================= */

  useEffect(() => {

    let cancelled = false;

    const loadOrders = async () => {

      try {

        setError(null);

        const response =
          await fetch(
            `${API_URL}/api/orders?cafeteriaId=${CAFETERIA_ID}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );


        if (!response.ok) {

          throw new Error(
            `Error al obtener pedidos: ${response.status}`
          );
        }


        const data: BackendOrder[] =
          await response.json();


        const mappedOrders =
          data.map(
            mapBackendOrder
          );


        if (!cancelled) {

          setOrders(
            mappedOrders
          );
        }

      } catch (error) {

        console.error(
          "Error obteniendo pedidos:",
          error
        );


        if (!cancelled) {

          setError(
            "No se pudieron cargar los pedidos."
          );
        }

      } finally {

        if (!cancelled) {

          setLoading(false);
        }
      }
    };


    void loadOrders();


    return () => {

      cancelled = true;
    };

  }, []);


  /* =======================================================
     ACTUALIZACIÓN DEL RELOJ
     ======================================================= */

  const [, setNow] =
    useState(0);


  useEffect(() => {

    const intervalId =
      setInterval(() => {

        setNow(
          Date.now()
        );

      }, 30_000);


    return () => {

      clearInterval(
        intervalId
      );
    };

  }, []);


  /* =======================================================
     FILTRAR PEDIDOS
     ======================================================= */

  const filteredOrders =
    useMemo(() => {

      const query =
        search
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


  /* =======================================================
     ACCIÓN SOBRE PEDIDO
     ======================================================= */

  const handleOrderAction =
    async (order: Order) => {

      let endpoint:
        string | null = null;


      switch (order.status) {

        case "pending":

          endpoint =
            `/api/orders/${order.id}/prepare`;

          break;


        case "preparing":

          endpoint =
            `/api/orders/${order.id}/ready`;

          break;


        case "ready":

          endpoint =
            `/api/orders/${order.id}/call`;

          break;


        case "called":

          endpoint =
            `/api/orders/${order.id}/deliver`;

          break;


        case "delivered":

          return;


        default:

          return;
      }


      try {

        /*
         * Limpiar notificación anterior.
         */
        setActionError(null);

        setIsPriorityError(false);


        const response =
          await fetch(
            `${API_URL}${endpoint}`,
            {
              method: "PATCH",
            }
          );


        /* ============================================
           ERROR DEL BACKEND
           ============================================ */

        if (!response.ok) {

          const backendMessage =
            await response.text();


          /*
           * 409 = regla de negocio.
           *
           * En este caso significa que el pedido
           * no tiene prioridad.
           */
          if (
            response.status === 409
          ) {

            setIsPriorityError(
              true
            );

            setActionError(
              "Primero prepara el pedido anterior para continuar."
            );

            return;
          }


          throw new Error(
            backendMessage ||
            "No se pudo actualizar el pedido."
          );
        }


        /* ============================================
           PEDIDO ACTUALIZADO
           ============================================ */

        const updatedBackendOrder:
          BackendOrder =
          await response.json();


        const updatedOrder =
          mapBackendOrder(
            updatedBackendOrder
          );


        /*
         * Actualizamos únicamente
         * el pedido que cambió.
         */
        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (currentOrder) =>
                currentOrder.id ===
                updatedOrder.id
                  ? updatedOrder
                  : currentOrder
            )
        );


        /*
         * Actualizamos también
         * el detalle si está abierto.
         */
        setSelectedOrder(
          (currentSelectedOrder) => {

            if (
              currentSelectedOrder?.id ===
              updatedOrder.id
            ) {

              return updatedOrder;
            }


            return currentSelectedOrder;
          }
        );

      } catch (error) {

        console.error(
          "Error actualizando pedido:",
          error
        );


        setIsPriorityError(
          false
        );


        if (
          error instanceof Error
        ) {

          setActionError(
            error.message
          );

        } else {

          setActionError(
            "No se pudo actualizar el pedido."
          );
        }
      }
    };


  /* =======================================================
     CERRAR NOTIFICACIÓN
     ======================================================= */

  const closeActionNotification =
    () => {

      setActionError(null);

      setIsPriorityError(false);
    };


  /* =======================================================
     RENDERIZAR MÓDULO
     ======================================================= */

  const renderModule = () => {

    if (
      activeModule === "orders"
    ) {

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

            <p>
              Cargando pedidos...
            </p>

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

            <p>
              {error}
            </p>

          </section>
        );
      }


      return (
        <KanbanBoard
          orders={
            filteredOrders
          }

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


  /* =======================================================
     RENDER PRINCIPAL
     ======================================================= */

  return (
    <main className="worker-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <Header
        search={
          search
        }

        onSearchChange={
          setSearch
        }
      />


      {/* =================================================
          CONTENIDO
          ================================================= */}

      <div className="worker-main">

        {renderModule()}

      </div>


      {/* =================================================
          NAVEGACIÓN INFERIOR
          ================================================= */}

      <BottomNav
        activeModule={
          activeModule
        }

        onChange={
          setActiveModule
        }
      />


      {/* =================================================
          DETALLE DEL PEDIDO
          ================================================= */}

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


      {/* =================================================
          NOTIFICACIÓN
          ================================================= */}

      {actionError && (

        <div
          role="alert"

          onClick={
            closeActionNotification
          }

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

              borderRadius:
                "24px",

              padding:
                "28px",

              boxShadow:
                "0 24px 70px rgba(0,0,0,.25)",

              textAlign:
                "center",

              cursor:
                "default",
            }}
          >

            {/* =======================================
                CÍRCULO ROJO
                ======================================= */}

            <div
              style={{
                width:
                  "56px",

                height:
                  "56px",

                margin:
                  "0 auto 16px",

                borderRadius:
                  "50%",

                display:
                  "grid",

                placeItems:
                  "center",

                background:
                  "#fee2e2",

                color:
                  "#dc2626",

                fontSize:
                  "28px",

                fontWeight:
                  700,
              }}
            >

              !

            </div>


            {/* =======================================
                TÍTULO
                ======================================= */}

            <h2
              style={{
                margin:
                  "0 0 10px",

                fontSize:
                  "20px",

                fontWeight:
                  700,

                color:
                  "#172033",
              }}
            >

              {isPriorityError
                ? "Acción no disponible"
                : "No se pudo completar la acción"}

            </h2>


            {/* =======================================
                MENSAJE
                ======================================= */}

            <p
              style={{
                margin:
                  "0 0 24px",

                fontSize:
                  "15px",

                lineHeight:
                  1.5,

                color:
                  "#5d6678",
              }}
            >

              {actionError}

            </p>


            {/* =======================================
                BOTÓN
                ======================================= */}

            <button
              type="button"

              onClick={
                closeActionNotification
              }

              style={{
                width:
                  "100%",

                border:
                  "none",

                borderRadius:
                  "14px",

                padding:
                  "13px 18px",

                background:
                  "#0b63ce",

                color:
                  "#ffffff",

                fontSize:
                  "15px",

                fontWeight:
                  600,

                cursor:
                  "pointer",
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