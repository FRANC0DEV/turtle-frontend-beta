import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Filter } from 'lucide-react'
import { useMovements, useSupplies, useLowStock } from '@/hooks/useDb'
import { updateSupply } from '@/lib/db'

export const Route = createFileRoute('/admin/inventory')({
  component: InventoryPage,
})

function InventoryPage() {
  const { items: movements, add } = useMovements()
  const { items: supplies } = useSupplies()
  const { items: lowStockItems } = useLowStock()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [filterTipo, setFilterTipo] = useState('todas')
  const [form, setForm] = useState({ supplyId: '', tipo: 'Entrada' as 'Entrada' | 'Salida', cantidad: 0, responsable: '', nota: '' })

  const filtered = movements.filter((m) => {
    const matchSearch = m.supplyNombre.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === 'todas' || m.tipo === filterTipo
    return matchSearch && matchTipo
  })

  const selectedSupply = supplies.find((s) => s.id === form.supplyId)

  function openCreate() {
    setForm({ supplyId: supplies[0]?.id || '', tipo: 'Entrada', cantidad: 0, responsable: '', nota: '' })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.supplyId || form.cantidad <= 0 || !form.responsable.trim()) return

    const supply = supplies.find((s) => s.id === form.supplyId)
    if (!supply) return

    add({
      supplyId: form.supplyId,
      supplyNombre: supply.nombre,
      tipo: form.tipo,
      cantidad: form.cantidad,
      responsable: form.responsable,
      nota: form.nota,
      fecha: new Date().toISOString().split('T')[0],
    })

    const newStock = form.tipo === 'Entrada'
      ? supply.stock + form.cantidad
      : Math.max(0, supply.stock - form.cantidad)

    updateSupply(form.supplyId, { stock: newStock })
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ocean-dark sm:text-3xl">Inventario</h1>
          <p className="text-sm text-muted-foreground">Control de movimientos y stock de insumos</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-coral hover:bg-coral/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Movimiento
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ocean-dark">Nuevo Movimiento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Insumo</Label>
              <Select value={form.supplyId} onValueChange={(v) => v && setForm({ ...form, supplyId: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar insumo" />
                </SelectTrigger>
                <SelectContent>
                  {supplies.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nombre} (Stock: {s.stock} {s.unidad})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => v && setForm({ ...form, tipo: v as 'Entrada' | 'Salida' })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={form.cantidad || ''} onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) || 0 })} />
                {selectedSupply && (
                  <p className="text-[10px] text-muted-foreground">
                    Stock actual: {selectedSupply.stock} {selectedSupply.unidad}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Responsable</Label>
              <Input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre del responsable" />
            </div>
            <div className="grid gap-2">
              <Label>Nota (opcional)</Label>
              <Input value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} placeholder="Ej: Compra diaria, consumo..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-coral hover:bg-coral/90 text-white">
              Registrar Movimiento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="movements">
        <TabsList className="border-[#e8e2d8] bg-white">
          <TabsTrigger value="movements" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="stock" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
            Stock Actual
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-ocean data-[state=active]:text-white">
            Alertas {lowStockItems.length > 0 && `(${lowStockItems.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar movimientos..." className="border-[#e8e2d8] bg-white pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterTipo} onValueChange={(v) => v && setFilterTipo(v)}>
              <SelectTrigger className="w-40 border-[#e8e2d8] bg-white">
                <Filter className="mr-2 h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos</SelectItem>
                <SelectItem value="Entrada">Entradas</SelectItem>
                <SelectItem value="Salida">Salidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-[#e8e2d8]">
            <CardHeader>
              <CardTitle className="text-ocean-dark">Historial ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-xs">{mov.fecha}</TableCell>
                      <TableCell className="font-medium text-ocean-dark">{mov.supplyNombre}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          mov.tipo === 'Entrada' ? 'bg-lime-light text-lime' : 'bg-coral-light text-coral'
                        }`}>
                          {mov.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{mov.cantidad}</TableCell>
                      <TableCell>{mov.responsable}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{mov.nota || '—'}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No se encontraron movimientos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="mt-4">
          <Card className="border-[#e8e2d8]">
            <CardHeader>
              <CardTitle className="text-ocean-dark">Stock de Insumos</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insumo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Stock Mín.</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplies.map((s) => {
                    const bajoStock = s.stock <= s.stockMinimo
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium text-ocean-dark">{s.nombre}</TableCell>
                        <TableCell>{s.categoria}</TableCell>
                        <TableCell className={bajoStock ? 'font-semibold text-coral' : 'font-semibold'}>{s.stock}</TableCell>
                        <TableCell>{s.unidad}</TableCell>
                        <TableCell>{s.stockMinimo}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            bajoStock ? 'bg-coral-light text-coral' : 'bg-lime-light text-lime'
                          }`}>
                            {bajoStock ? 'Stock Bajo' : 'Ok'}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <Card className="border-[#e8e2d8]">
            <CardHeader>
              <CardTitle className="text-ocean-dark">Alertas de Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Todos los insumos tienen stock suficiente. ¡Buen trabajo!
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-coral/20 bg-coral-light/50 p-4">
                      <div>
                        <p className="font-semibold text-ocean-dark">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock actual: <span className="font-semibold text-coral">{item.stock}</span> / Mínimo: {item.stockMinimo} {item.unidad}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-coral px-3 py-1 text-xs font-medium text-white">
                        ¡Reponer!
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
