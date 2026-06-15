import { useState } from 'react'
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
  Menu,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/supplies', label: 'Insumos', icon: PackagePlus },
  { href: '/admin/suppliers', label: 'Proveedores', icon: Truck },
  { href: '/admin/inventory', label: 'Inventario', icon: ClipboardList },
] as const

const menuItem = { href: '/menu', label: 'Menú Digital', icon: ExternalLink } as const

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
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
      <div className="border-t border-[#e8e2d8] my-2" />
      <a
        href={menuItem.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ocean transition-colors hover:bg-ocean-light"
      >
        <menuItem.icon className="h-4 w-4" />
        {menuItem.label}
      </a>
    </>
  )
}

function SidebarDesktop() {
  return (
    <aside className="hidden xl:flex xl:h-screen xl:w-64 xl:flex-col xl:border-r xl:bg-white">
      <div className="flex items-center gap-2 border-b border-[#e8e2d8] px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand">
          <TurtleIcon className="h-5 w-5 text-ocean-dark" />
        </div>
        <span className="text-lg font-semibold text-ocean">TURTLE</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <NavLinks />
      </nav>
      <div className="border-t border-[#e8e2d8] px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-coral-light hover:text-coral"
        >
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </Link>
      </div>
    </aside>
  )
}

function MobileHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const currentLabel = navItems.find((i) => i.href === location.pathname)?.label || 'Administración'

  return (
    <div className="flex items-center gap-3 border-b border-[#e8e2d8] bg-white px-4 py-3 xl:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon"><Menu className="h-5 w-5 text-ocean" /></Button>} />
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center gap-2 border-b border-[#e8e2d8] px-6 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand">
              <TurtleIcon className="h-5 w-5 text-ocean-dark" />
            </div>
            <span className="text-lg font-semibold text-ocean">TURTLE</span>
          </div>
          <nav className="space-y-1 px-3 py-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </nav>
          <div className="space-y-3 border-t border-[#e8e2d8] px-4 py-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-coral-light hover:text-coral"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </Link>
            <p className="px-2 text-xs text-muted-foreground">Sistema TURTLE v1.0</p>
          </div>
        </SheetContent>
      </Sheet>
      <div>
        <p className="text-sm font-semibold text-ocean-dark">{currentLabel}</p>
        <p className="text-[10px] text-muted-foreground">Del Mar al Limón</p>
      </div>
    </div>
  )
}

function SidebarTablet() {
  const location = useLocation()
  return (
    <aside className="hidden md:flex xl:hidden md:w-16 md:flex-col md:border-r md:bg-white">
      <div className="flex items-center justify-center border-b border-[#e8e2d8] py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand">
          <TurtleIcon className="h-5 w-5 text-ocean-dark" />
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.label}
              className={cn(
                'flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ocean text-white'
                  : 'text-muted-foreground hover:bg-ocean-light hover:text-ocean-dark',
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
        <div className="border-t border-[#e8e2d8] my-2" />
        <a
          href={menuItem.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={menuItem.label}
          className="flex items-center justify-center rounded-lg px-2 py-2 text-ocean transition-colors hover:bg-ocean-light"
        >
          <menuItem.icon className="h-5 w-5" />
        </a>
      </nav>
    </aside>
  )
}

export const Route = createRootRoute({
  component: () => {
    const location = useLocation()
    const isFullScreen = location.pathname === '/' || location.pathname.startsWith('/menu')

    if (isFullScreen) {
      return <Outlet />
    }

    return (
      <div className="flex min-h-dvh bg-cream">
        <SidebarDesktop />
        <SidebarTablet />
        <div className="flex flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    )
  },
})
