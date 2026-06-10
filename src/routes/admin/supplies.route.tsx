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
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useSupplies } from '@/hooks/useDb'
import { UNIDADES_MEDIDA } from '@/lib/db'
import type { Supply } from '@/lib/db'

export const Route = createFileRoute('/admin/supplies')({
  component: SuppliesPage,
})

const CATEGORIAS_INSUMO = ['Pescados', 'Verduras', 'Carnes', 'Lácteos', 'Bebidas', 'Aceites', 'Embutidos', 'Otros']

function SuppliesPage() {
  const { items, add, update, remove } = useSupplies()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Supply | null>(null)
  const [form, setForm] = useState({ nombre: '', unidad: 'kg', stock: 0, stockMinimo: 0, precioUnitario: 0, categoria: 'Pescados' })

  const filtered = items.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ nombre: '', unidad: 'kg', stock: 0, stockMinimo: 0, precioUnitario: 0, categoria: 'Pescados' })
    setModalOpen(true)
  }

  function openEdit(supply: Supply) {
    setEditing(supply)
    setForm({ nombre: supply.nombre, unidad: supply.unidad, stock: supply.stock, stockMinimo: supply.stockMinimo, precioUnitario: supply.precioUnitario, categoria: supply.categoria })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || form.precioUnitario <= 0) return
    if (editing) {
      update(editing.id, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    if (confirm('¿Eliminar este insumo?')) remove(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ocean-dark">Insumos</h1>
          <p className="text-muted-foreground">Control de ingredientes y materias primas</p>
        </div>
        <Button onClick={openCreate} className="bg-lime hover:bg-lime/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Insumo
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ocean-dark">{editing ? 'Editar Insumo' : 'Nuevo Insumo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre del insumo</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Corvina" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Categoría</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v || CATEGORIAS_INSUMO[0] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_INSUMO.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unidad de medida</Label>
                <Select value={form.unidad} onValueChange={(v) => setForm({ ...form, unidad: v || UNIDADES_MEDIDA[0] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIDADES_MEDIDA.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Stock actual</Label>
                <Input type="number" min={0} value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>Stock mínimo</Label>
                <Input type="number" min={0} value={form.stockMinimo || ''} onChange={(e) => setForm({ ...form, stockMinimo: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>Precio (S/.)</Label>
                <Input type="number" min={0} step={0.5} value={form.precioUnitario || ''} onChange={(e) => setForm({ ...form, precioUnitario: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-lime hover:bg-lime/90 text-white">
              {editing ? 'Guardar Cambios' : 'Crear Insumo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar insumos..." className="border-[#e8e2d8] bg-white pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-[#e8e2d8]">
        <CardHeader>
          <CardTitle className="text-ocean-dark">Lista de Insumos ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Stock Mín.</TableHead>
                <TableHead>Precio Unit.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const bajoStock = item.stock <= item.stockMinimo
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-ocean-dark">{item.nombre}</TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell>{item.unidad}</TableCell>
                    <TableCell className={bajoStock ? 'font-semibold text-coral' : ''}>{item.stock}</TableCell>
                    <TableCell>{item.stockMinimo}</TableCell>
                    <TableCell className="font-semibold text-ocean">S/ {item.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        bajoStock ? 'bg-coral-light text-coral' : 'bg-lime-light text-lime'
                      }`}>
                        {bajoStock ? 'Stock Bajo' : 'Ok'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="text-ocean hover:bg-ocean-light">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-coral hover:bg-coral-light">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No se encontraron insumos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
