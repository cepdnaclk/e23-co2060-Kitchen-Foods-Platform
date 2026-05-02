import axios from 'axios'
import type {
  ActivityEvent,
  DashboardStats,
  FoodCategory,
  FoodItem,
  Order,
  OrderStatus,
  User,
  UserRole,
} from '../types/index.ts'

const BASE_URL = 'http://localhost:5000/api/admin'

let authToken: string | null = localStorage.getItem('admin_token')
let unauthorizedHandler: (() => void) | null = null

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler()
    }

    return Promise.reject(error)
  },
)

const mockUsers: User[] = [
  {
    uid: '7c8bd3f7-1b51-4f85-a1ea-8b21e420b6d9',
    full_name: 'Ayesha Perera',
    email: 'ayesha@kitchenfoods.lk',
    role: 'Chef',
  },
  {
    uid: '44d3fdb0-1857-4893-91aa-d17cbf26d5e9',
    full_name: 'Dilan Fernando',
    email: 'dilan@kitchenfoods.lk',
    role: 'Customer',
  },
]

const mockFoodItems: FoodItem[] = [
  {
    id: 'F-1001',
    name: 'Village Rice Bowl',
    description: 'Traditional rice bowl with seasonal curries.',
    price: 1250,
    chefId: '7c8bd3f7-1b51-4f85-a1ea-8b21e420b6d9',
    imageUrl:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    categoryId: 'c1',
    categoryName: 'Rice & Curry',
  },
]

const mockFoodCategories: FoodCategory[] = [
  {
    id: 'c1',
    name: 'Rice & Curry',
    description: 'Traditional Sri Lankan rice plates with curries.',
  },
  {
    id: 'c2',
    name: 'Short Eats',
    description: 'Popular quick bites and snack items.',
  },
]

const mockOrders: Order[] = [
  {
    id: 'ORD-2209',
    customer: 'Dilan Fernando',
    mealDescription: 'Low-spice lunch meal with less oil',
    status: 'Pending',
  },
  {
    id: 'ORD-2210',
    customer: 'Nimali Gunawardena',
    mealDescription: 'Family dinner set for 4',
    status: 'Quoted',
  },
]

const mockActivities: ActivityEvent[] = [
  {
    id: 'A-01',
    action: 'Created user',
    actor: 'Admin',
    target: 'Sahan Silva (Chef)',
    timestamp: '2 mins ago',
  },
  {
    id: 'A-02',
    action: 'Updated order status',
    actor: 'Admin',
    target: 'ORD-2209 -> Quoted',
    timestamp: '15 mins ago',
  },
  {
    id: 'A-03',
    action: 'Removed food item',
    actor: 'Admin',
    target: 'F-0932',
    timestamp: '1 hour ago',
  },
  {
    id: 'A-04',
    action: 'Added food item',
    actor: 'Admin',
    target: 'F-1001',
    timestamp: '2 hours ago',
  },
  {
    id: 'A-05',
    action: 'Deleted user',
    actor: 'Admin',
    target: 'test+old@kitchenfoods.lk',
    timestamp: '3 hours ago',
  },
]

export const adminApi = {
  setToken(token: string | null) {
    authToken = token
  },

  registerUnauthorizedHandler(handler: () => void) {
    unauthorizedHandler = handler
  },

  async login(email: string, password: string) {
    // TODO: Wire up Axios call here (POST /auth/login)
    const response = await instance.post('/auth/login', { email, password })

    return response.data as { token: string; user: { email: string } }
  },

  async getDashboardOverview() {
    // TODO: Wire up Axios call here (GET /dashboard/overview)
    const response = await instance.get('/dashboard/overview')

    return response.data as {
      stats: DashboardStats
      activities: ActivityEvent[]
    }
  },

  async getUsers() {
    // TODO: Wire up Axios call here (GET /users)
    const response = await instance.get('/users')

    return response.data as User[]
  },

  async createUser(payload: {
    full_name: string
    email: string
    password: string
    role: UserRole
  }) {
    // TODO: Wire up Axios call here (POST /users)
    const response = await instance.post('/users', payload)

    return response.data as User
  },

  async updateUser(
    userId: string,
    payload: { full_name: string; email: string; role: UserRole },
  ) {
    // TODO: Wire up Axios call here (PUT /users/:id)
    const response = await instance.put(`/users/${userId}`, payload)

    return response.data as User
  },

  async deleteUser(userId: string) {
    // TODO: Wire up Axios call here (DELETE /users/:id)
    await instance.delete(`/users/${userId}`)
  },

  async getFoodItems() {
    // TODO: Wire up Axios call here (GET /food)
    const response = await instance.get('/food')

    return response.data as FoodItem[]
  },

  async getFoodCategories() {
    // Public endpoint for category list
    const response = await axios.get('http://localhost:8000/api/food/categories')

    return response.data as FoodCategory[]
  },

  async createFoodItem(payload: Omit<FoodItem, 'id' | 'categoryName'>) {
    // TODO: Wire up Axios call here (POST /food)
    const response = await instance.post('/food', payload)

    return response.data as FoodItem
  },

  async updateFoodItem(
    itemId: string,
    payload: Omit<FoodItem, 'id' | 'categoryName'>,
  ) {
    // TODO: Wire up Axios call here (PUT /food/:id)
    const response = await instance.put(`/food/${itemId}`, payload)

    return response.data as FoodItem
  },

  async deleteFoodItem(itemId: string) {
    // TODO: Wire up Axios call here (DELETE /food/:id)
    await instance.delete(`/food/${itemId}`)
  },

  async getOrders() {
    // TODO: Wire up Axios call here (GET /orders)
    const response = await instance.get('/orders')

    return response.data as Order[]
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    // TODO: Wire up Axios call here (PATCH /orders/:id/status)
    const response = await instance.patch(`/orders/${orderId}/status`, { status })

    return response.data as Order
  },

  async deleteOrder(orderId: string) {
    // TODO: Wire up Axios call here (DELETE /orders/:id)
    await instance.delete(`/orders/${orderId}`)
  },

  // Mock helpers keep UI functional until backend admin endpoints are ready.
  getMockDashboardData() {
    return {
      stats: {
        totalUsers: mockUsers.length,
        activeChefs: mockUsers.filter((u) => u.role === 'Chef').length,
        totalOrders: mockOrders.length,
        totalFoodItems: mockFoodItems.length,
      },
      activities: mockActivities,
    }
  },

  getMockUsers() {
    return structuredClone(mockUsers)
  },

  getMockFoodItems() {
    return structuredClone(mockFoodItems)
  },

  getMockFoodCategories() {
    return structuredClone(mockFoodCategories)
  },

  getMockOrders() {
    return structuredClone(mockOrders)
  },
}
