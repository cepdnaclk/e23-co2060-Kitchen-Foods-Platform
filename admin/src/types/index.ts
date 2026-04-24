export type UserRole = 'Admin' | 'Chef' | 'Customer'
export type OrderStatus = 'Pending' | 'Quoted' | 'Paid' | 'Completed'

export interface AdminUser {
  email: string
}

export interface User {
  uid: string
  full_name: string
  email: string
  role: UserRole
}

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  chefId: string
  imageUrl: string
  categoryId: string
  categoryName: string
}

export interface FoodCategory {
  id: string
  name: string
  description: string
}

export interface Order {
  id: string
  customer: string
  mealDescription: string
  status: OrderStatus
}

export interface ActivityEvent {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
}

export interface DashboardStats {
  totalUsers: number
  activeChefs: number
  totalOrders: number
  totalFoodItems: number
}
