import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Truck,
  ClipboardList,
  ChevronRight,
  TurtleIcon,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/supplies', label: 'Insumos', icon: PackagePlus },
  { href: '/admin/suppliers', label: 'Proveedores', icon: Truck },
  { href: '/admin/inventory', label: 'Inventario', icon: ClipboardList },
] as const

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-2 border-b border-[#e8e2d8] px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand">
          <TurtleIcon className="h-5 w-5 text-ocean-dark" />
        </div>
        <span className="text-lg font-semibold text-ocean">TURTLE</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ocean text-white'
                  : 'text-muted-foreground hover:bg-ocean-light hover:text-ocean-dark',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              <ChevronRight
                className={cn(
                  'ml-auto h-4 w-4 transition-transform',
                  isActive && 'rotate-90',
                )}
              />
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[#e8e2d8] px-6 py-4">
        <p className="text-xs text-muted-foreground">Del Mar al Limón</p>
        <p className="text-xs text-muted-foreground">Sistema TURTLE v1.0</p>
      </div>
    </aside>
  )
}

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  ),
})
