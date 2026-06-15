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
import { useSuppliers } from '@/hooks/useDb'
import { TIPOS_PROVEEDOR, type Supplier } from '@/lib/db'

export const Route = createFileRoute('/admin/suppliers')({
  component: SuppliersPage,
})

function SuppliersPage() {
  const { items, add, update, remove } = useSuppliers()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState({ nombre: '', contacto: '', telefono: '', email: '', tipo: 'Pescados', direccion: '' })

  const filtered = items.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.tipo.toLowerCase().includes(search.toLowerCase()) ||
    s.contacto.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ nombre: '', contacto: '', telefono: '', email: '', tipo: 'Pescados', direccion: '' })
    setModalOpen(true)
  }

  function openEdit(supplier: Supplier) {
    setEditing(supplier)
    setForm({ nombre: supplier.nombre, contacto: supplier.contacto, telefono: supplier.telefono, email: supplier.email, tipo: supplier.tipo, direccion: supplier.direccion })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.contacto.trim()) return
    if (editing) {
      update(editing.id, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    if (confirm('¿Eliminar este proveedor?')) remove(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ocean-dark sm:text-3xl">Proveedores</h1>
          <p className="text-sm text-muted-foreground">Gestión de proveedores y contacto</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-sand-dark hover:bg-sand-dark/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ocean-dark">{editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Nombre / Empresa</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Pesquera Santa Rosa" />
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v || TIPOS_PROVEEDOR[0] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PROVEEDOR.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Contacto</Label>
                <Input value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} placeholder="Nombre del contacto" />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="999-888-777" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contacto@proveedor.com" />
            </div>
            <div className="grid gap-2">
              <Label>Dirección</Label>
              <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Av. Principal 123" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-sand-dark hover:bg-sand-dark/90 text-white">
              {editing ? 'Guardar Cambios' : 'Crear Proveedor'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar proveedores..." className="border-[#e8e2d8] bg-white pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-[#e8e2d8]">
        <CardHeader>
          <CardTitle className="text-ocean-dark">Lista de Proveedores ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium text-ocean-dark">{supplier.nombre}</TableCell>
                  <TableCell>{supplier.contacto}</TableCell>
                  <TableCell>{supplier.telefono}</TableCell>
                  <TableCell className="text-xs">{supplier.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-ocean-light px-2 py-0.5 text-xs font-medium text-ocean-dark">
                      {supplier.tipo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(supplier)} className="text-ocean hover:bg-ocean-light">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)} className="text-coral hover:bg-coral-light">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron proveedores
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
