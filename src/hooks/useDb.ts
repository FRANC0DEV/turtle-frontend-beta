import { useCallback, useRef, useSyncExternalStore } from 'react'
import {
  seedInitialData,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSupplies,
  createSupply,
  updateSupply,
  deleteSupply,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getMovements,
  createMovement,
  getLowStockSupplies,
} from '@/lib/db'

const UPDATE_EVENT = 'turtle-update'

function subscribe(cb: () => void) {
  window.addEventListener(UPDATE_EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(UPDATE_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

function emitUpdate() {
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

function useSnapshot<T>(getter: () => T[]): T[] {
  const cachedRef = useRef<{ json: string; value: T[] }>({ json: '', value: [] })

  seedInitialData()

  const getSnapshot = (): T[] => {
    seedInitialData()
    const next = getter()
    const json = JSON.stringify(next)
    if (json !== cachedRef.current.json) {
      cachedRef.current = { json, value: next }
    }
    return cachedRef.current.value
  }

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useProducts() {
  const items = useSnapshot(getProducts)

  const add = useCallback((data: Parameters<typeof createProduct>[0]) => {
    createProduct(data)
    emitUpdate()
  }, [])

  const update = useCallback((id: string, data: Parameters<typeof updateProduct>[1]) => {
    updateProduct(id, data)
    emitUpdate()
  }, [])

  const remove = useCallback((id: string) => {
    deleteProduct(id)
    emitUpdate()
  }, [])

  return { items, add, update, remove }
}

export function useSupplies() {
  const items = useSnapshot(getSupplies)

  const add = useCallback((data: Parameters<typeof createSupply>[0]) => {
    createSupply(data)
    emitUpdate()
  }, [])

  const update = useCallback((id: string, data: Parameters<typeof updateSupply>[1]) => {
    updateSupply(id, data)
    emitUpdate()
  }, [])

  const remove = useCallback((id: string) => {
    deleteSupply(id)
    emitUpdate()
  }, [])

  return { items, add, update, remove }
}

export function useSuppliers() {
  const items = useSnapshot(getSuppliers)

  const add = useCallback((data: Parameters<typeof createSupplier>[0]) => {
    createSupplier(data)
    emitUpdate()
  }, [])

  const update = useCallback((id: string, data: Parameters<typeof updateSupplier>[1]) => {
    updateSupplier(id, data)
    emitUpdate()
  }, [])

  const remove = useCallback((id: string) => {
    deleteSupplier(id)
    emitUpdate()
  }, [])

  return { items, add, update, remove }
}

export function useMovements() {
  const items = useSnapshot(getMovements)

  const add = useCallback((data: Parameters<typeof createMovement>[0]) => {
    createMovement(data)
    emitUpdate()
  }, [])

  return { items, add }
}

export function useLowStock() {
  const items = useSnapshot(getLowStockSupplies)
  return { items }
}
