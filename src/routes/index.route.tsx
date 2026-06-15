import { createFileRoute, Link } from '@tanstack/react-router'
import { TurtleIcon, ChefHat, Settings } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0d1b2a] p-6">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sand shadow-lg">
            <TurtleIcon className="h-10 w-10 text-ocean-dark" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            TURTLE
          </h1>
          <p className="text-sm text-[#B5D4F4] sm:text-base">
            Del Mar al Limón — Sistema de Gestión
          </p>
        </div>

        <div className="grid gap-4 pt-4">
          <Link
            to="/menu"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-white transition-all hover:bg-white/10 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ocean">
              <ChefHat className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">Menú Digital</p>
              <p className="text-sm text-[#B5D4F4]">
                Ver carta y hacer pedidos desde tu mesa
              </p>
            </div>
          </Link>

          <Link
            to="/admin"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-white transition-all hover:bg-white/10 hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ocean-mid">
              <Settings className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">Administración</p>
              <p className="text-sm text-[#B5D4F4]">
                Gestionar productos, insumos, proveedores e inventario
              </p>
            </div>
          </Link>
        </div>

        <p className="text-xs text-white/30">TURTLE v1.0</p>
      </div>
    </div>
  )
}
