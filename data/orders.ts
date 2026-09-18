import type { Order } from "@/types/order";

const minutesAgo = (minutes: number) =>
  new Date(
    Date.now() - minutes * 60_000
  ).toISOString();

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    student: "Juan Martínez",
    studentId: "EST001",
    createdAt: minutesAgo(2),
    items: [
      {
        name: "Hamburguesa clásica",
        quantity: 1,
      },
      {
        name: "Papas",
        quantity: 1,
      },
    ],
    note: "Sin cebolla",
    status: "pending",
  },

  {
    id: "ORD-002",
    student: "María González",
    studentId: "EST024",
    createdAt: minutesAgo(5),
    items: [
      {
        name: "Menú del día",
        quantity: 1,
      },
      {
        name: "Jugo natural",
        quantity: 1,
      },
    ],
    status: "pending",
  },

  {
    id: "ORD-003",
    student: "Andrés López",
    studentId: "EST037",
    createdAt: minutesAgo(7),
    items: [
      {
        name: "Perrito caliente",
        quantity: 1,
      },
      {
        name: "Gaseosa",
        quantity: 1,
      },
    ],
    status: "pending",
  },

  {
    id: "ORD-004",
    student: "Valentina Ruiz",
    studentId: "EST052",
    createdAt: minutesAgo(9),
    items: [
      {
        name: "Ensalada César",
        quantity: 1,
      },
      {
        name: "Agua",
        quantity: 1,
      },
    ],
    status: "pending",
  },

  {
    id: "ORD-005",
    student: "Sebastián Torres",
    studentId: "EST015",
    createdAt: minutesAgo(12),
    items: [
      {
        name: "Pizza personal",
        quantity: 1,
      },
      {
        name: "Jugo natural",
        quantity: 1,
      },
    ],
    status: "preparing",
  },

  {
    id: "ORD-006",
    student: "Camila Díaz",
    studentId: "EST028",
    createdAt: minutesAgo(15),
    items: [
      {
        name: "Sándwich de pollo",
        quantity: 1,
      },
      {
        name: "Papas",
        quantity: 1,
      },
    ],
    status: "preparing",
  },

  {
    id: "ORD-007",
    student: "Mateo Herrera",
    studentId: "EST041",
    createdAt: minutesAgo(17),
    items: [
      {
        name: "Bowl saludable",
        quantity: 1,
      },
      {
        name: "Agua",
        quantity: 1,
      },
    ],
    note: "Sin salsas",
    status: "preparing",
  },

  {
    id: "ORD-008",
    student: "Laura Sánchez",
    studentId: "EST009",
    createdAt: minutesAgo(20),
    items: [
      {
        name: "Arepa de choclo",
        quantity: 1,
      },
      {
        name: "Chocolate",
        quantity: 1,
      },
    ],
    status: "ready",
  },

  {
    id: "ORD-009",
    student: "Daniel Ramírez",
    studentId: "EST033",
    createdAt: minutesAgo(23),
    items: [
      {
        name: "Combo hamburguesa",
        quantity: 1,
      },
      {
        name: "Papas",
        quantity: 1,
      },
    ],
    status: "ready",
  },

  {
    id: "ORD-010",
    student: "Sofía Morales",
    studentId: "EST046",
    createdAt: minutesAgo(26),
    items: [
      {
        name: "Salchipapa",
        quantity: 1,
      },
      {
        name: "Jugo natural",
        quantity: 1,
      },
    ],
    status: "ready",
  },

  {
    id: "ORD-011",
    student: "Nicolás Castro",
    studentId: "EST060",
    createdAt: minutesAgo(29),
    items: [
      {
        name: "Wrap de pollo",
        quantity: 1,
      },
      {
        name: "Agua",
        quantity: 1,
      },
    ],
    status: "called",
    calledAt: minutesAgo(6),
  },

  {
    id: "ORD-012",
    student: "Isabella Peña",
    studentId: "EST007",
    createdAt: minutesAgo(32),
    items: [
      {
        name: "Hamburguesa especial",
        quantity: 1,
      },
      {
        name: "Papas",
        quantity: 1,
      },
    ],
    status: "delivered",
    deliveredAt: minutesAgo(24),
  },

  {
    id: "ORD-013",
    student: "Felipe Ortiz",
    studentId: "EST020",
    createdAt: minutesAgo(36),
    items: [
      {
        name: "Menú del día",
        quantity: 1,
      },
      {
        name: "Agua",
        quantity: 1,
      },
    ],
    status: "delivered",
    deliveredAt: minutesAgo(28),
  },

  {
    id: "ORD-014",
    student: "Valeria Castaño",
    studentId: "EST038",
    createdAt: minutesAgo(40),
    items: [
      {
        name: "Ensalada de frutas",
        quantity: 1,
      },
      {
        name: "Jugo natural",
        quantity: 1,
      },
    ],
    status: "delivered",
    deliveredAt: minutesAgo(32),
  },
];