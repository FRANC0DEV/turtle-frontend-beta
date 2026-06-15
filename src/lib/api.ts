import { getProducts, type Product } from './db'

export type { Product }

export interface CartItem {
  id: string
  nombre: string
  precio: number
  qty: number
}

export interface CreateOrderPayload {
  mesa: number
  items: CartItem[]
  nota: string
}

export interface Order {
  id: string
  numero: number
  mesa: number
  items: CartItem[]
  nota: string
  subtotal: number
  igv: number
  total: number
  estado: 'recibido' | 'cocina' | 'listo' | 'mesa'
  createdAt: string
}

let orderCounter = 90

const STORAGE_ORDERS = 'turtle_orders'

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders))
}

export async function fetchMenu(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 100))
  return getProducts().filter((p) => p.disponible)
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  await new Promise((r) => setTimeout(r, 300))
  orderCounter++

  const subtotal = payload.items.reduce((s, i) => s + i.precio * i.qty, 0)
  const igv = subtotal * 0.18

  const order: Order = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
    numero: orderCounter,
    mesa: payload.mesa,
    items: payload.items,
    nota: payload.nota,
    subtotal,
    igv,
    total: subtotal + igv,
    estado: 'recibido',
    createdAt: new Date().toISOString(),
  }

  const orders = readOrders()
  orders.unshift(order)
  writeOrders(orders)

  return order
}

export async function fetchOrderStatus(orderId: string): Promise<Order | null> {
  await new Promise((r) => setTimeout(r, 100))
  const orders = readOrders()
  return orders.find((o) => o.id === orderId) ?? null
}

export async function fetchOrdersByMesa(mesa: number): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 100))
  return readOrders().filter((o) => o.mesa === mesa)
}
