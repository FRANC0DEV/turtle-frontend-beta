export interface Product {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  precio: number
  popular: boolean
  disponible: boolean
  createdAt: string
  updatedAt: string
}

export interface Supply {
  id: string
  nombre: string
  unidad: string
  stock: number
  stockMinimo: number
  precioUnitario: number
  categoria: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  nombre: string
  contacto: string
  telefono: string
  email: string
  tipo: string
  direccion: string
  createdAt: string
  updatedAt: string
}

export interface InventoryMovement {
  id: string
  supplyId: string
  supplyNombre: string
  tipo: 'Entrada' | 'Salida'
  cantidad: number
  responsable: string
  nota: string
  fecha: string
  createdAt: string
}

export const CATEGORIAS_PRODUCTO = [
  'Del Mar',
  'Criolla',
  'Bebidas',
  'Postres',
] as const

export const UNIDADES_MEDIDA = [
  'kg',
  'g',
  'L',
  'mL',
  'unid',
  'docena',
  'bolsa',
  'caja',
] as const

export const TIPOS_PROVEEDOR = [
  'Pescados',
  'Verduras',
  'Carnes',
  'Lácteos',
  'Bebidas',
  'Aceites',
  'Embutidos',
  'Otros',
] as const

const STORAGE_KEYS = {
  products: 'turtle_products',
  supplies: 'turtle_supplies',
  suppliers: 'turtle_suppliers',
  movements: 'turtle_movements',
} as const

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

function readData<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function seedInitialData(): void {
  const hasProducts = localStorage.getItem(STORAGE_KEYS.products)
  if (hasProducts) return

  const now = new Date().toISOString()

  const products: Product[] = [
    { id: generateId(), nombre: 'Ceviche Clásico', descripcion: 'Corvina, limón, ají limo, cebolla morada', categoria: 'Del Mar', precio: 35, popular: true, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Jalea Mixta', descripcion: 'Pescado, calamar, langostino, yuca frita', categoria: 'Del Mar', precio: 42, popular: true, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Sudado de Corvina', descripcion: 'Corvina en salsa criolla al wok', categoria: 'Del Mar', precio: 45, popular: false, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Arroz con Mariscos', descripcion: 'Arroz, conchas, langostinos, cilantro', categoria: 'Del Mar', precio: 48, popular: false, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Lomo Saltado', descripcion: 'Res, tomate, cebolla roja, papas fritas', categoria: 'Criolla', precio: 38, popular: true, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Ají de Gallina', descripcion: 'Gallina, ají amarillo, pan, nuez', categoria: 'Criolla', precio: 32, popular: false, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Chicha Morada', descripcion: 'Chicha artesanal de la casa', categoria: 'Bebidas', precio: 8, popular: true, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Maracuyá Sour', descripcion: 'Maracuyá, limón, pisco, jarabe', categoria: 'Bebidas', precio: 18, popular: false, disponible: true, createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Picarones', descripcion: 'Anillos de zapallo con miel de higo', categoria: 'Postres', precio: 16, popular: false, disponible: true, createdAt: now, updatedAt: now },
  ]

  const supplies: Supply[] = [
    { id: generateId(), nombre: 'Corvina', unidad: 'kg', stock: 15, stockMinimo: 5, precioUnitario: 18, categoria: 'Pescados', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Limón', unidad: 'kg', stock: 30, stockMinimo: 10, precioUnitario: 3.5, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Cebolla Roja', unidad: 'kg', stock: 25, stockMinimo: 8, precioUnitario: 2, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Ají Limo', unidad: 'kg', stock: 5, stockMinimo: 3, precioUnitario: 8, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Camote', unidad: 'kg', stock: 20, stockMinimo: 10, precioUnitario: 2.5, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Choclo', unidad: 'unid', stock: 40, stockMinimo: 20, precioUnitario: 1, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Aceite Vegetal', unidad: 'L', stock: 8, stockMinimo: 4, precioUnitario: 7, categoria: 'Aceites', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Papa Amarilla', unidad: 'kg', stock: 35, stockMinimo: 10, precioUnitario: 2.8, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Arroz', unidad: 'kg', stock: 50, stockMinimo: 15, precioUnitario: 3.2, categoria: 'Verduras', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Calamar', unidad: 'kg', stock: 10, stockMinimo: 4, precioUnitario: 22, categoria: 'Pescados', createdAt: now, updatedAt: now },
  ]

  const suppliers: Supplier[] = [
    { id: generateId(), nombre: 'Pesquera Santa Rosa', contacto: 'Juan Pérez', telefono: '999-888-777', email: 'juan@pesquera.com', tipo: 'Pescados', direccion: 'Av. Costanera 345', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Mercado Central', contacto: 'María García', telefono: '999-777-666', email: 'maria@mercado.com', tipo: 'Verduras', direccion: 'Jr. Junín 120', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Distribuidora San Fernando', contacto: 'Carlos López', telefono: '999-666-555', email: 'carlos@sanfernando.com', tipo: 'Aceites', direccion: 'Av. Industrial 890', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Granja Los Andes', contacto: 'Ana Torres', telefono: '999-555-444', email: 'ana@granjalandes.com', tipo: 'Verduras', direccion: 'Carretera Central km 45', createdAt: now, updatedAt: now },
    { id: generateId(), nombre: 'Embotelladora Nacional', contacto: 'Pedro Sánchez', telefono: '999-444-333', email: 'pedro@embotelladora.com', tipo: 'Bebidas', direccion: 'Av. Circunvalación 567', createdAt: now, updatedAt: now },
  ]

  const movements: InventoryMovement[] = [
    { id: generateId(), supplyId: supplies[0].id, supplyNombre: supplies[0].nombre, tipo: 'Entrada', cantidad: 10, responsable: 'Carlos', nota: 'Compra diaria', fecha: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], createdAt: now },
    { id: generateId(), supplyId: supplies[1].id, supplyNombre: supplies[1].nombre, tipo: 'Salida', cantidad: 5, responsable: 'Cocina', nota: 'Consumo del día', fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0], createdAt: now },
    { id: generateId(), supplyId: supplies[2].id, supplyNombre: supplies[2].nombre, tipo: 'Entrada', cantidad: 20, responsable: 'María', nota: 'Reabastecimiento', fecha: new Date().toISOString().split('T')[0], createdAt: now },
  ]

  writeData(STORAGE_KEYS.products, products)
  writeData(STORAGE_KEYS.supplies, supplies)
  writeData(STORAGE_KEYS.suppliers, suppliers)
  writeData(STORAGE_KEYS.movements, movements)
}

export function getProducts(): Product[] {
  return readData<Product>(STORAGE_KEYS.products)
}

export function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getProducts()
  const now = new Date().toISOString()
  const product: Product = { ...data, id: generateId(), createdAt: now, updatedAt: now }
  products.push(product)
  writeData(STORAGE_KEYS.products, products)
  return product
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
  const products = getProducts()
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() }
  writeData(STORAGE_KEYS.products, products)
  return products[idx]
}

export function deleteProduct(id: string): boolean {
  const products = getProducts().filter((p) => p.id !== id)
  writeData(STORAGE_KEYS.products, products)
  return true
}

export function getSupplies(): Supply[] {
  return readData<Supply>(STORAGE_KEYS.supplies)
}

export function createSupply(data: Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>): Supply {
  const supplies = getSupplies()
  const now = new Date().toISOString()
  const supply: Supply = { ...data, id: generateId(), createdAt: now, updatedAt: now }
  supplies.push(supply)
  writeData(STORAGE_KEYS.supplies, supplies)
  return supply
}

export function updateSupply(id: string, data: Partial<Omit<Supply, 'id' | 'createdAt'>>): Supply | null {
  const supplies = getSupplies()
  const idx = supplies.findIndex((s) => s.id === id)
  if (idx === -1) return null
  supplies[idx] = { ...supplies[idx], ...data, updatedAt: new Date().toISOString() }
  writeData(STORAGE_KEYS.supplies, supplies)
  return supplies[idx]
}

export function deleteSupply(id: string): boolean {
  const supplies = getSupplies().filter((s) => s.id !== id)
  writeData(STORAGE_KEYS.supplies, supplies)
  return true
}

export function getSuppliers(): Supplier[] {
  return readData<Supplier>(STORAGE_KEYS.suppliers)
}

export function createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
  const suppliers = getSuppliers()
  const now = new Date().toISOString()
  const supplier: Supplier = { ...data, id: generateId(), createdAt: now, updatedAt: now }
  suppliers.push(supplier)
  writeData(STORAGE_KEYS.suppliers, suppliers)
  return supplier
}

export function updateSupplier(id: string, data: Partial<Omit<Supplier, 'id' | 'createdAt'>>): Supplier | null {
  const suppliers = getSuppliers()
  const idx = suppliers.findIndex((s) => s.id === id)
  if (idx === -1) return null
  suppliers[idx] = { ...suppliers[idx], ...data, updatedAt: new Date().toISOString() }
  writeData(STORAGE_KEYS.suppliers, suppliers)
  return suppliers[idx]
}

export function deleteSupplier(id: string): boolean {
  const suppliers = getSuppliers().filter((s) => s.id !== id)
  writeData(STORAGE_KEYS.suppliers, suppliers)
  return true
}

export function getMovements(): InventoryMovement[] {
  return readData<InventoryMovement>(STORAGE_KEYS.movements)
}

export function createMovement(data: Omit<InventoryMovement, 'id' | 'createdAt'>): InventoryMovement {
  const movements = getMovements()
  const now = new Date().toISOString()
  const movement: InventoryMovement = { ...data, id: generateId(), createdAt: now }
  movements.unshift(movement)
  writeData(STORAGE_KEYS.movements, movements)
  return movement
}

export function getLowStockSupplies(): Supply[] {
  return getSupplies().filter((s) => s.stock <= s.stockMinimo)
}
