export interface Order {
  id: string;
  productId: string;
  productName: string;
  price: number;
  queueToken: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: number;
}
