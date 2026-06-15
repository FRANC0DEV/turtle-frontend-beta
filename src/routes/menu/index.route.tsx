import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, useCallback, useRef } from 'react'
import { fetchMenu, createOrder, type Product, type CartItem } from '@/lib/api'
import { ArrowLeft } from 'lucide-react'

type Screen = 'welcome' | 'menu' | 'carrito' | 'confirm'
type CatKey = 'todos' | 'mar' | 'criolla' | 'bebidas' | 'postres'

const CAT_MAP: Record<string, CatKey> = {
  'Del Mar': 'mar',
  Criolla: 'criolla',
  Bebidas: 'bebidas',
  Postres: 'postres',
}

const CAT_CHIPS: { key: CatKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'mar', label: '🌊 Del Mar' },
  { key: 'criolla', label: '🌶️ Criolla' },
  { key: 'bebidas', label: '🥤 Bebidas' },
  { key: 'postres', label: '🍮 Postres' },
]

const CAT_EMOJI_CLASS: Record<string, string> = {
  mar: 'mar',
  criolla: 'criolla',
  bebidas: 'bebida',
  postres: 'postre',
}

const GROUP_LABELS: { key: CatKey; label: string }[] = [
  { key: 'mar', label: '🌊 Del Mar' },
  { key: 'criolla', label: '🌶️ Criolla' },
  { key: 'bebidas', label: '🥤 Bebidas' },
  { key: 'postres', label: '🍮 Postres' },
]

export const Route = createFileRoute('/menu/')({
  component: MenuPage,
})

function MenuPage() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [mesa, setMesa] = useState<number>(0)
  const [mesaInput, setMesaInput] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [catActual, setCatActual] = useState<CatKey>('todos')
  const [carrito, setCarrito] = useState<CartItem[]>([])
  const [nota, setNota] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [pedidoNum, setPedidoNum] = useState(90)
  const [loading, setLoading] = useState(false)
  const [menuLoading, setMenuLoading] = useState(true)
  const platosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMenu().then((data) => {
      setProducts(data)
      setMenuLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 2200)
    return () => clearTimeout(t)
  }, [toastMsg])

  useEffect(() => {
    if (platosRef.current) platosRef.current.scrollTop = 0
  }, [catActual])

  const totalItems = carrito.reduce((s, x) => s + x.qty, 0)

  const entrarAlMenu = useCallback(() => {
    const val = parseInt(mesaInput)
    if (!val || val < 1 || val > 20) {
      setToastMsg('Ingresa un número de mesa válido (1-20)')
      return
    }
    setMesa(val)
    setScreen('menu')
  }, [mesaInput])

  const filterCat = useCallback((cat: CatKey) => {
    setCatActual(cat)
  }, [])

  const toggleCarrito = useCallback(
    (product: Product) => {
      setCarrito((prev) => {
        const exists = prev.find((x) => x.id === product.id)
        if (exists) {
          setToastMsg('Eliminado del pedido')
          return prev.filter((x) => x.id !== product.id)
        }
        setToastMsg(`${product.nombre} agregado`)
        return [
          ...prev,
          {
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            qty: 1,
          },
        ]
      })
    },
    [],
  )

  const cambiarQty = useCallback((id: string, delta: number) => {
    setCarrito((prev) => {
      const next = prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
      return next
    })
  }, [])

  const confirmarPedido = useCallback(async () => {
    if (!carrito.length) {
      setToastMsg('Agrega algo al pedido primero')
      return
    }
    setLoading(true)
    try {
      const order = await createOrder({
        mesa,
        items: carrito,
        nota,
      })
      setPedidoNum(order.numero)
      setCarrito([])
      setNota('')
      setScreen('confirm')
    } catch {
      setToastMsg('Error al enviar el pedido')
    } finally {
      setLoading(false)
    }
  }, [carrito, mesa, nota])

  const filteredProducts =
    catActual === 'todos'
      ? products
      : products.filter((p) => CAT_MAP[p.categoria] === catActual)

  const enCar = new Set(carrito.map((x) => x.id))

  return (
    <div className="flex min-h-dvh bg-cream">
      <div className="relative flex h-dvh w-full flex-col bg-cream">
          {/* HEADER */}
          <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-b from-ocean to-ocean-mid">
            <div className="px-5 pb-7 pt-[18px]">
              <div className="mb-3 flex items-center gap-2.5">
                <Link to="/" className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-sand text-lg transition-transform hover:scale-105">
                  🐟
                </Link>
                <div className="flex-1">
                  <div className="font-serif text-[17px] font-bold text-white">
                    Del Mar al Limón
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.8px] text-[#B5D4F4]">
                    Menú Digital
                  </div>
                </div>
                {screen !== 'welcome' && (
                  <Link to="/admin" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20" title="Ir a administración">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                )}
              </div>
              {mesa > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-white/20 bg-white/12 px-3 py-1 text-xs font-medium text-white">
                  <i className="ti ti-armchair text-[13px]" />
                  <span>Mesa {mesa}</span>
                </div>
              )}
            </div>
            <svg
              className="absolute -bottom-px left-0 right-0 h-5"
              viewBox="0 0 420 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C70,20 140,0 210,10 C280,20 350,0 420,10 L420,20 L0,20 Z"
                fill="#FDF9F3"
              />
            </svg>
          </div>

          {/* SCREEN: WELCOME */}
          {screen === 'welcome' && (
            <div className="flex flex-1 flex-col items-center justify-center bg-cream px-7 py-8 text-center">
              <div className="mb-4 text-6xl animate-[float_3s_ease-in-out_infinite]">
                🐠
              </div>
              <div className="mb-2 font-serif text-[26px] text-ocean">
                ¡Bienvenido!
              </div>
              <div className="mb-8 text-[13px] leading-relaxed text-muted-foreground">
                Ingresa el número de tu mesa para ver el menú y hacer tu pedido
                directamente desde aquí.
              </div>
              <div className="mb-2 w-full text-left text-xs font-medium text-foreground">
                Número de mesa
              </div>
              <input
                type="number"
                className="mb-3.5 w-full rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-center text-[15px] font-medium tracking-wider text-foreground outline-none transition-colors focus:border-ocean"
                placeholder="Ej: 5"
                min={1}
                max={20}
                value={mesaInput}
                onChange={(e) => setMesaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && entrarAlMenu()}
              />
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ocean px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-ocean-mid active:translate-y-0"
                onClick={entrarAlMenu}
              >
                <i className="ti ti-book" />
                Ver Menú
              </button>
            </div>
          )}

          {/* SCREEN: MENU */}
          {screen === 'menu' && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Categories */}
              <div className="flex flex-shrink-0 gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
                {CAT_CHIPS.map((chip) => (
                  <button
                    key={chip.key}
                    className={`flex-shrink-0 cursor-pointer rounded-full border-[0.5px] px-3.5 py-1.5 text-xs font-sans whitespace-nowrap transition-all duration-[0.18s] ${
                      catActual === chip.key
                        ? 'border-ocean bg-ocean text-white'
                        : 'border-border bg-white text-[#555]'
                    }`}
                    onClick={() => filterCat(chip.key)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Platos list */}
              <div ref={platosRef} className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-[#ddd]">
                {menuLoading ? (
                  <div className="space-y-3 pt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex animate-pulse items-stretch overflow-hidden rounded-xl border border-border bg-white">
                        <div className="flex w-[72px] flex-shrink-0 items-center justify-center bg-ocean-light/50">
                          <div className="h-7 w-7 rounded-full bg-ocean-light" />
                        </div>
                        <div className="flex-1 space-y-2 px-2.5 py-3">
                          <div className="h-3.5 w-3/4 rounded bg-muted" />
                          <div className="h-2.5 w-full rounded bg-muted" />
                          <div className="h-3 w-1/4 rounded bg-muted" />
                        </div>
                        <div className="flex items-center px-3">
                          <div className="h-7 w-7 rounded-full bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : catActual === 'todos' ? (
                  GROUP_LABELS.map((g) => {
                    const groupItems = products.filter(
                      (p) => CAT_MAP[p.categoria] === g.key,
                    )
                    if (!groupItems.length) return null
                    return (
                      <div key={g.key}>
                        <div className="my-3 font-serif text-sm italic text-ocean tracking-[0.3px]">
                          {g.label}
                        </div>
                        {groupItems.map((p) =>
                          platoCard(p, enCar, toggleCarrito),
                        )}
                      </div>
                    )
                  })
                ) : (
                  filteredProducts.map((p) =>
                    platoCard(p, enCar, toggleCarrito),
                  )
                )}
              </div>

              {/* FAB Carrito */}
              {totalItems > 0 && (
                <button
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-full bg-ocean px-6 py-3.5 text-sm font-medium text-white whitespace-nowrap shadow-[0_8px_24px_rgba(12,68,124,0.35)] transition-all hover:bg-ocean-mid hover:-translate-y-0.5"
                  onClick={() => setScreen('carrito')}
                >
                  <i className="ti ti-shopping-cart" />
                  Ver pedido
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold text-ocean-dark">
                    {totalItems}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* SCREEN: CARRITO */}
          {screen === 'carrito' && (
            <div className="flex flex-1 flex-col overflow-hidden bg-cream">
              <div className="flex flex-shrink-0 items-center gap-2.5 px-4 pb-2.5 pt-3.5">
                <button
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] border-[0.5px] border-border bg-white text-ocean"
                  onClick={() => setScreen('menu')}
                >
                  <i className="ti ti-arrow-left text-base" />
                </button>
                <h2 className="font-serif text-[17px] text-foreground">
                  Tu pedido
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                {!carrito.length ? (
                  <div className="py-10 text-center text-[#bbb]">
                    <i className="ti ti-shopping-cart mb-2.5 block text-[40px]" />
                    <p className="text-[13px]">Tu pedido está vacío</p>
                  </div>
                ) : (
                  <>
                    {carrito.map((item) => (
                      <div
                        key={item.id}
                        className="mb-2.5 flex items-center gap-2.5 rounded-xl border-[0.5px] border-border bg-white p-3"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ocean-light text-sm font-bold text-ocean">
                          {item.nombre.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-medium text-foreground">
                            {item.nombre}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            S/. {item.precio} c/u
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border-[0.5px] border-border bg-white text-sm text-foreground transition-all hover:border-ocean hover:bg-ocean-light hover:text-ocean"
                            onClick={() => cambiarQty(item.id, -1)}
                          >
                            −
                          </button>
                          <span className="min-w-[18px] text-center text-sm font-semibold text-foreground">
                            {item.qty}
                          </span>
                          <button
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border-[0.5px] border-border bg-white text-sm text-foreground transition-all hover:border-ocean hover:bg-ocean-light hover:text-ocean"
                            onClick={() => cambiarQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="ml-1 text-[13px] font-semibold text-ocean">
                          S/. {(item.precio * item.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="my-3">
                      <div className="mb-1.5 text-xs font-medium text-foreground">
                        Notas para cocina (opcional)
                      </div>
                      <textarea
                        className="w-full resize-none rounded-xl border-[0.5px] border-border bg-white px-3 py-2.5 text-xs text-foreground outline-none transition-colors focus:border-ocean"
                        rows={2}
                        placeholder="Ej: sin cebolla, extra limón..."
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {carrito.length > 0 && (
                <div className="flex-shrink-0 px-4 pb-4 pt-3">
                  <div className="mb-3 rounded-xl border-[0.5px] border-border bg-white p-3">
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Subtotal
                      </span>
                      <span id="c-subtotal" className="text-xs text-muted-foreground">
                        S/.{' '}
                        {carrito
                          .reduce((s, x) => s + x.precio * x.qty, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        IGV (18%)
                      </span>
                      <span id="c-igv" className="text-xs text-muted-foreground">
                        S/.{' '}
                        {(
                          carrito.reduce((s, x) => s + x.precio * x.qty, 0) *
                          0.18
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        Total
                      </span>
                      <strong className="text-[15px] font-semibold text-foreground">
                        S/.{' '}
                        {(
                          carrito.reduce((s, x) => s + x.precio * x.qty, 0) *
                          1.18
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-ocean px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-ocean-mid disabled:opacity-60"
                    onClick={confirmarPedido}
                    disabled={loading}
                  >
                    {loading ? (
                      'Enviando...'
                    ) : (
                      <>
                        <i className="ti ti-send" />{' '}
                        Enviar pedido a cocina
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: CONFIRMACIÓN */}
          {screen === 'confirm' && (
            <div className="flex flex-1 flex-col items-center justify-center bg-cream px-7 py-8 text-center">
              <div className="mb-5 flex h-20 w-20 animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)] items-center justify-center rounded-full border-3 border-lime bg-lime-light text-4xl">
                ✅
              </div>
              <div className="mb-2 font-serif text-[22px] text-foreground">
                ¡Pedido enviado!
              </div>
              <div className="mb-7 text-[13px] leading-relaxed text-muted-foreground">
                Tu pedido fue recibido por cocina. Te avisamos cuando esté
                listo.
              </div>
              <div className="mb-1 font-serif text-[32px] font-bold text-ocean">
                #{pedidoNum}
              </div>
              <div className="mb-7 text-[11px] uppercase tracking-[0.5px] text-muted-foreground">
                Número de pedido
              </div>
              <div className="mb-4 w-full rounded-xl border-[0.5px] border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-sm text-white">
                      <i className="ti ti-check" />
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Recibido
                    </div>
                  </div>
                  <div className="mx-1 h-0.5 flex-1 bg-ocean" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 animate-[pulse_1.5s_ease-in-out_infinite] items-center justify-center rounded-full bg-sand text-sm text-ocean-dark">
                      🔥
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      En cocina
                    </div>
                  </div>
                  <div className="mx-1 h-0.5 flex-1 bg-[#f0ece4]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0ece4] text-sm text-[#ccc]">
                      <i className="ti ti-star" />
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Listo
                    </div>
                  </div>
                  <div className="mx-1 h-0.5 flex-1 bg-[#f0ece4]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0ece4] text-sm text-[#ccc]">
                      <i className="ti ti-armchair" />
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      En tu mesa
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-ocean bg-transparent px-4 py-3.5 text-sm font-medium text-ocean transition-all hover:bg-ocean-light"
                onClick={() => {
                  setScreen('menu')
                  setCatActual('todos')
                }}
              >
                <i className="ti ti-plus" /> Agregar más al pedido
              </button>
            </div>
          )}

          {/* TOAST */}
          <div
            className={`pointer-events-none absolute bottom-20 left-1/2 z-99 -translate-x-1/2 transform rounded-full bg-foreground px-4 py-2 text-xs text-white whitespace-nowrap transition-all duration-[0.25s] ${
              toastMsg
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            {toastMsg}
          </div>
      </div>
    </div>
  )
}

function platoCard(
  p: Product,
  enCar: Set<string>,
  toggle: (p: Product) => void,
) {
  const inCart = enCar.has(p.id)
  const catKey = CAT_MAP[p.categoria] || 'mar'
  const catClass = CAT_EMOJI_CLASS[catKey] || 'mar'

  const bgMap: Record<string, string> = {
    mar: 'bg-ocean-light',
    criolla: 'bg-amber-light',
    bebida: 'bg-lime-light',
    postre: 'bg-coral-light',
  }

  return (
    <div
      key={p.id}
      className="mb-2.5 flex animate-[fadeIn_0.3s_ease-out] cursor-pointer items-stretch overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:border-ocean hover:shadow-[0_2px_12px_rgba(12,68,124,0.08)] active:scale-[0.99]"
    >
      <div
        className={`flex w-[72px] flex-shrink-0 items-center justify-center text-lg font-bold text-ocean ${bgMap[catClass] || 'bg-ocean-light'}`}
      >
        {p.nombre.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 px-2.5 py-2.5">
        <div className="mb-0.5 text-[13px] font-medium text-foreground">
          {p.nombre}
          {p.popular && (
            <span className="ml-1.5 rounded-md bg-amber-light px-1.5 py-0.5 text-[9px] font-medium text-amber-dark">
              Popular
            </span>
          )}
        </div>
        <div className="mb-1.5 text-[10px] leading-relaxed text-muted-foreground">
          {p.descripcion}
        </div>
        <div className="text-[13px] font-semibold text-ocean">
          S/. {p.precio.toFixed(2)}
        </div>
      </div>
      <div className="flex items-center px-3">
        <button
          className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-lg text-white transition-all duration-200 active:scale-90 ${
            inCart
              ? 'bg-lime shadow-sm shadow-lime/30'
              : 'bg-ocean shadow-sm shadow-ocean/30 hover:bg-ocean-mid'
          }`}
          onClick={() => toggle(p)}
        >
          {inCart ? <i className="ti ti-check text-sm" /> : '+'}
        </button>
      </div>
    </div>
  )
}
