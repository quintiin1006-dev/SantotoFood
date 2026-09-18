import type { Order } from "@/types/order";

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    student: "Juan Martínez",
    studentId: "EST001",
    time: "Hace 2 min",
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
    time: "Hace 5 min",
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
    time: "Hace 7 min",
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
    time: "Hace 8 min",
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
    time: "Hace 10 min",
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
    time: "Hace 12 min",
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
    time: "Hace 14 min",
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
    time: "Hace 16 min",
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
    time: "Hace 18 min",
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
    time: "Hace 20 min",
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
    time: "Hace 22 min",
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
    status: "ready",
  },

  {
    id: "ORD-012",
    student: "Isabella Peña",
    studentId: "EST007",
    time: "Hace 25 min",
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
    deliveredAt: "12:32 p. m.",
  },

  {
    id: "ORD-013",
    student: "Felipe Ortiz",
    studentId: "EST020",
    time: "Hace 28 min",
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
    deliveredAt: "12:28 p. m.",
  },

  {
    id: "ORD-014",
    student: "Valeria Castaño",
    studentId: "EST038",
    time: "Hace 32 min",
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
    deliveredAt: "12:24 p. m.",
  },
];