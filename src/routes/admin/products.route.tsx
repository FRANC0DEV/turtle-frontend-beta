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
import { useProducts } from '@/hooks/useDb'
import { CATEGORIAS_PRODUCTO } from '@/lib/db'
import type { Product } from '@/lib/db'

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
})

const EMOJIS = ['🍋', '🦑', '🐟', '🦐', '🍲', '🐠', '🥩', '🍗', '🫕', '🟡', '🟣', '🍹', '💧', '🍚', '🟤', '🍩']

function ProductsPage() {
  const { items, add, update, remove } = useProducts()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: 'Del Mar', precio: 0, emoji: '🍋', popular: false, disponible: true })

  const filtered = items.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ nombre: '', descripcion: '', categoria: 'Del Mar', precio: 0, emoji: '🍋', popular: false, disponible: true })
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({ nombre: product.nombre, descripcion: product.descripcion, categoria: product.categoria as string, precio: product.precio, emoji: product.emoji, popular: product.popular, disponible: product.disponible })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || form.precio <= 0) return
    if (editing) {
      update(editing.id, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    if (confirm('¿Eliminar este producto?')) remove(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ocean-dark">Productos</h1>
          <p className="text-muted-foreground">Gestión de platos y productos del menú</p>
        </div>
        <Button onClick={openCreate} className="bg-ocean hover:bg-ocean-mid text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ocean-dark">{editing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre del plato</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Ceviche Clásico" />
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ingredientes principales" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Categoría</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v || CATEGORIAS_PRODUCTO[0] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_PRODUCTO.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Precio (S/)</Label>
                <Input type="number" min={0} step={0.5} value={form.precio || ''} onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Emoji</Label>
                <Select value={form.emoji} onValueChange={(v) => v && setForm({ ...form, emoji: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOJIS.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Disponible</Label>
                <Select value={form.disponible ? 'si' : 'no'} onValueChange={(v) => setForm({ ...form, disponible: v === 'si' })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="rounded border-[#e8e2d8]" />
              Marcar como Popular
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-ocean hover:bg-ocean-mid text-white">
              {editing ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          className="border-[#e8e2d8] bg-white pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-[#e8e2d8]">
        <CardHeader>
          <CardTitle className="text-ocean-dark">Lista de Productos ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <span className="font-medium text-ocean-dark">{product.nombre}</span>
                    {product.popular && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-medium text-amber-dark">Popular</span>
                    )}
                  </TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell className="font-semibold text-ocean">S/ {product.precio.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.disponible ? 'bg-lime-light text-lime' : 'bg-coral-light text-coral'
                    }`}>
                      {product.disponible ? 'Sí' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="text-ocean hover:bg-ocean-light">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-coral hover:bg-coral-light">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron productos
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
