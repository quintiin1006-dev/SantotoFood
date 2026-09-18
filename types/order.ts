export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "called"
  | "delivered";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  student: string;
  studentId: string;
  time: string;

  items: OrderItem[];

  note?: string;

  status: OrderStatus;

  calledAt?: string;
  deliveredAt?: string;
}