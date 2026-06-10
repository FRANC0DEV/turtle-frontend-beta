import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, PackagePlus, Truck, ClipboardList, TrendingUp, AlertTriangle } from 'lucide-react'
import { useProducts, useSupplies, useSuppliers, useMovements, useLowStock } from '@/hooks/useDb'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const products = useProducts()
  const supplies = useSupplies()
  const suppliers = useSuppliers()
  const movements = useMovements()
  const lowStock = useLowStock()

  const stats = [
    { label: 'Productos', value: products.items.length, icon: Package, color: 'text-ocean' },
    { label: 'Insumos', value: supplies.items.length, icon: PackagePlus, color: 'text-lime' },
    { label: 'Proveedores', value: suppliers.items.length, icon: Truck, color: 'text-sand-dark' },
    { label: 'Movimientos', value: movements.items.length, icon: ClipboardList, color: 'text-coral' },
  ]

  const recentMovements = movements.items.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ocean-dark">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Resumen del estado actual del restaurante "Del Mar al Limón"
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-[#e8e2d8]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ocean-dark">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#e8e2d8]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ocean-dark">
              <TrendingUp className="h-4 w-4 text-ocean" />
              Movimientos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay movimientos registrados.</p>
            ) : (
              <div className="space-y-2">
                {recentMovements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between rounded-lg border border-[#e8e2d8] bg-white p-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        mov.tipo === 'Entrada' ? 'bg-lime-light text-lime' : 'bg-coral-light text-coral'
                      }`}>
                        {mov.tipo}
                      </span>
                      <span className="font-medium text-ocean-dark">{mov.supplyNombre}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {mov.cantidad} unid · {mov.fecha}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#e8e2d8]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ocean-dark">
              <AlertTriangle className="h-4 w-4 text-coral" />
              Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todos los insumos tienen stock suficiente.</p>
            ) : (
              <div className="space-y-2">
                {lowStock.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-[#e8e2d8] bg-white p-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-coral-light px-2 py-0.5 text-xs font-medium text-coral">
                        ¡Urgente!
                      </span>
                      <span className="font-medium text-ocean-dark">{item.nombre}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Stock: {item.stock} / mín. {item.stockMinimo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
