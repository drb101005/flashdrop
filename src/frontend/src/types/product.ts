export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  inventory: number;
  totalInventory: number;
  dealExpiresAt: Date;
  isFeatured?: boolean;
  badge?: string;
  color?: string;
}
