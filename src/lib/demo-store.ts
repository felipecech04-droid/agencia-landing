export type Cliente = {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export type FacturaItem = {
  descripcion: string
  cantidad: number
  precio: number
}

export type Factura = {
  id: string
  folio: string
  clienteId: string
  clienteNombre: string
  items: FacturaItem[]
  subtotal: number
  iva: number
  total: number
  fecha: string
  estado: "pagada" | "pendiente" | "cancelada"
}

export type Categoria = {
  id: string
  nombre: string
}

export type Producto = {
  id: string
  nombre: string
  sku: string
  categoriaId: string
  categoriaNombre: string
  precio: number
  stock: number
  stockMinimo: number
}

export type Movimiento = {
  id: string
  productoId: string
  productoNombre: string
  tipo: "entrada" | "salida"
  cantidad: number
  fecha: string
  motivo: string
}

export type TicketRespuesta = {
  id: string
  autor: string
  contenido: string
  fecha: string
}

export type Ticket = {
  id: string
  folio: string
  titulo: string
  descripcion: string
  estado: "abierto" | "en_progreso" | "resuelto" | "cerrado"
  prioridad: "baja" | "media" | "alta" | "critica"
  cliente: string
  email: string
  fecha: string
  respuestas: TicketRespuesta[]
}

export type DemoData = {
  clientes: Cliente[]
  facturas: Factura[]
  categorias: Categoria[]
  productos: Producto[]
  movimientos: Movimiento[]
  tickets: Ticket[]
}

const SEED: DemoData = {
  clientes: [
    { id: "c1", nombre: "ElectroHogar S.A.", email: "contacto@electrohogar.com", telefono: "+52 55 1234 5678", direccion: "Av. Reforma 123, CDMX" },
    { id: "c2", nombre: "TechSolutions México", email: "ventas@techsolutions.mx", telefono: "+52 81 2345 6789", direccion: "Blvd. Díaz Ordaz 500, Monterrey" },
    { id: "c3", nombre: "Distribuidora del Norte", email: "info@distrinorte.com", telefono: "+52 33 3456 7890", direccion: "Av. Américas 200, Guadalajara" },
    { id: "c4", nombre: "Consultora Estratégica", email: "admin@consultoraestrategica.mx", telefono: "+52 55 4567 8901", direccion: "Insurgentes Sur 800, CDMX" },
    { id: "c5", nombre: "Grupo Alimenticio San Juan", email: "compras@gruposanjuan.com", telefono: "+52 442 567 8901", direccion: "Calle Real 50, Querétaro" },
    { id: "c6", nombre: "Servicios Cloud Pro", email: "info@cloudpro.mx", telefono: "+52 55 6789 0123", direccion: "Santa Fe 300, CDMX" },
    { id: "c7", nombre: "Ferretería El Constructor", email: "ventas@ferreconstructor.com", telefono: "+52 222 789 0123", direccion: "Av. Juárez 150, Puebla" },
    { id: "c8", nombre: "Logística Express", email: "ops@logisticaexpress.mx", telefono: "+52 55 8901 2345", direccion: "Vallejo 600, CDMX" },
  ],
  categorias: [
    { id: "cat1", nombre: "Electrónicos" },
    { id: "cat2", nombre: "Hogar y Cocina" },
    { id: "cat3", nombre: "Ferretería" },
    { id: "cat4", nombre: "Oficina" },
    { id: "cat5", nombre: "Jardinería" },
  ],
  productos: [
    { id: "p1", nombre: "Laptop ProBook 15", sku: "LAP-001", categoriaId: "cat1", categoriaNombre: "Electrónicos", precio: 18999, stock: 25, stockMinimo: 5 },
    { id: "p2", nombre: "Monitor 27\" 4K", sku: "MON-001", categoriaId: "cat1", categoriaNombre: "Electrónicos", precio: 8499, stock: 12, stockMinimo: 3 },
    { id: "p3", nombre: "Teclado Mecánico RGB", sku: "TEC-001", categoriaId: "cat1", categoriaNombre: "Electrónicos", precio: 1299, stock: 40, stockMinimo: 10 },
    { id: "p4", nombre: "Mouse Ergonómico", sku: "MOU-001", categoriaId: "cat1", categoriaNombre: "Electrónicos", precio: 699, stock: 60, stockMinimo: 15 },
    { id: "p5", nombre: "Licuadora Profesional", sku: "LIC-001", categoriaId: "cat2", categoriaNombre: "Hogar y Cocina", precio: 2499, stock: 18, stockMinimo: 5 },
    { id: "p6", nombre: "Set de Ollas Antiadherentes", sku: "OLA-001", categoriaId: "cat2", categoriaNombre: "Hogar y Cocina", precio: 3499, stock: 8, stockMinimo: 3 },
    { id: "p7", nombre: "Taladro Percutor 800W", sku: "TAL-001", categoriaId: "cat3", categoriaNombre: "Ferretería", precio: 1899, stock: 5, stockMinimo: 5 },
    { id: "p8", nombre: "Juego de Llaves Mixtas", sku: "LLA-001", categoriaId: "cat3", categoriaNombre: "Ferretería", precio: 899, stock: 22, stockMinimo: 8 },
    { id: "p9", nombre: "Silla Ejecutiva Ergonómica", sku: "SIL-001", categoriaId: "cat4", categoriaNombre: "Oficina", precio: 5499, stock: 10, stockMinimo: 3 },
    { id: "p10", nombre: "Escritorio Eléctrico Ajustable", sku: "ESC-001", categoriaId: "cat4", categoriaNombre: "Oficina", precio: 8999, stock: 4, stockMinimo: 2 },
    { id: "p11", nombre: "Cortadora de Césped Eléctrica", sku: "COR-001", categoriaId: "cat5", categoriaNombre: "Jardinería", precio: 4299, stock: 7, stockMinimo: 3 },
    { id: "p12", nombre: "Sistema de Riego Automático", sku: "RIE-001", categoriaId: "cat5", categoriaNombre: "Jardinería", precio: 2799, stock: 15, stockMinimo: 5 },
  ],
  facturas: [
    { id: "f1", folio: "F-001", clienteId: "c1", clienteNombre: "ElectroHogar S.A.", items: [{ descripcion: "Laptop ProBook 15", cantidad: 3, precio: 18999 }, { descripcion: "Monitor 27\" 4K", cantidad: 3, precio: 8499 }], subtotal: 82494, iva: 13199, total: 95693, fecha: "2025-05-02", estado: "pagada" },
    { id: "f2", folio: "F-002", clienteId: "c2", clienteNombre: "TechSolutions México", items: [{ descripcion: "Silla Ejecutiva Ergonómica", cantidad: 10, precio: 5499 }], subtotal: 54990, iva: 8798, total: 63788, fecha: "2025-05-05", estado: "pagada" },
    { id: "f3", folio: "F-003", clienteId: "c3", clienteNombre: "Distribuidora del Norte", items: [{ descripcion: "Taladro Percutor 800W", cantidad: 20, precio: 1899 }, { descripcion: "Juego de Llaves Mixtas", cantidad: 15, precio: 899 }], subtotal: 51465, iva: 8234, total: 59699, fecha: "2025-05-08", estado: "pendiente" },
    { id: "f4", folio: "F-004", clienteId: "c4", clienteNombre: "Consultora Estratégica", items: [{ descripcion: "Escritorio Eléctrico Ajustable", cantidad: 4, precio: 8999 }], subtotal: 35996, iva: 5759, total: 41755, fecha: "2025-05-10", estado: "pagada" },
    { id: "f5", folio: "F-005", clienteId: "c5", clienteNombre: "Grupo Alimenticio San Juan", items: [{ descripcion: "Licuadora Profesional", cantidad: 12, precio: 2499 }, { descripcion: "Set de Ollas Antiadherentes", cantidad: 6, precio: 3499 }], subtotal: 50982, iva: 8157, total: 59139, fecha: "2025-05-12", estado: "pendiente" },
    { id: "f6", folio: "F-006", clienteId: "c6", clienteNombre: "Servicios Cloud Pro", items: [{ descripcion: "Laptop ProBook 15", cantidad: 5, precio: 18999 }, { descripcion: "Monitor 27\" 4K", cantidad: 5, precio: 8499 }, { descripcion: "Teclado Mecánico RGB", cantidad: 5, precio: 1299 }], subtotal: 143985, iva: 23038, total: 167023, fecha: "2025-05-15", estado: "pagada" },
    { id: "f7", folio: "F-007", clienteId: "c7", clienteNombre: "Ferretería El Constructor", items: [{ descripcion: "Taladro Percutor 800W", cantidad: 8, precio: 1899 }, { descripcion: "Juego de Llaves Mixtas", cantidad: 30, precio: 899 }, { descripcion: "Cortadora de Césped Eléctrica", cantidad: 3, precio: 4299 }], subtotal: 55479, iva: 8877, total: 64356, fecha: "2025-05-18", estado: "pagada" },
    { id: "f8", folio: "F-008", clienteId: "c8", clienteNombre: "Logística Express", items: [{ descripcion: "Silla Ejecutiva Ergonómica", cantidad: 6, precio: 5499 }, { descripcion: "Escritorio Eléctrico Ajustable", cantidad: 3, precio: 8999 }], subtotal: 59991, iva: 9599, total: 69590, fecha: "2025-05-20", estado: "cancelada" },
    { id: "f9", folio: "F-009", clienteId: "c1", clienteNombre: "ElectroHogar S.A.", items: [{ descripcion: "Teclado Mecánico RGB", cantidad: 20, precio: 1299 }, { descripcion: "Mouse Ergonómico", cantidad: 30, precio: 699 }], subtotal: 46950, iva: 7512, total: 54462, fecha: "2025-05-22", estado: "pendiente" },
    { id: "f10", folio: "F-010", clienteId: "c3", clienteNombre: "Distribuidora del Norte", items: [{ descripcion: "Sistema de Riego Automático", cantidad: 10, precio: 2799 }, { descripcion: "Cortadora de Césped Eléctrica", cantidad: 5, precio: 4299 }], subtotal: 49485, iva: 7918, total: 57403, fecha: "2025-05-25", estado: "pagada" },
  ],
  movimientos: [
    { id: "m1", productoId: "p1", productoNombre: "Laptop ProBook 15", tipo: "entrada", cantidad: 15, fecha: "2025-05-01", motivo: "Compra a proveedor" },
    { id: "m2", productoId: "p7", productoNombre: "Taladro Percutor 800W", tipo: "salida", cantidad: 8, fecha: "2025-05-03", motivo: "Venta F-003" },
    { id: "m3", productoId: "p1", productoNombre: "Laptop ProBook 15", tipo: "salida", cantidad: 3, fecha: "2025-05-02", motivo: "Venta F-001" },
    { id: "m4", productoId: "p12", productoNombre: "Sistema de Riego Automático", tipo: "entrada", cantidad: 20, fecha: "2025-05-10", motivo: "Compra a proveedor" },
    { id: "m5", productoId: "p5", productoNombre: "Licuadora Profesional", tipo: "salida", cantidad: 12, fecha: "2025-05-12", motivo: "Venta F-005" },
    { id: "m6", productoId: "p9", productoNombre: "Silla Ejecutiva Ergonómica", tipo: "entrada", cantidad: 15, fecha: "2025-05-14", motivo: "Reabastecimiento" },
    { id: "m7", productoId: "p10", productoNombre: "Escritorio Eléctrico Ajustable", tipo: "salida", cantidad: 4, fecha: "2025-05-10", motivo: "Venta F-004" },
    { id: "m8", productoId: "p7", productoNombre: "Taladro Percutor 800W", tipo: "entrada", cantidad: 10, fecha: "2025-05-20", motivo: "Reabastecimiento urgente" },
  ],
  tickets: [
    {
      id: "t1", folio: "TK-001", titulo: "Error al generar factura PDF", descripcion: "Al hacer clic en 'Descargar PDF' la página se queda cargando indefinidamente. Ya probé en Chrome y Edge.", estado: "resuelto", prioridad: "alta", cliente: "Carlos Mendoza", email: "carlos@electrohogar.com", fecha: "2025-05-03",
      respuestas: [
        { id: "r1", autor: "Soporte Forja", contenido: "Gracias por reportar. Vamos a revisar el módulo de PDF. ¿Podría compartir una captura de la consola?", fecha: "2025-05-03" },
        { id: "r2", autor: "Carlos Mendoza", contenido: "Aquí está la captura: el error dice 'pdfGenerator is not defined'", fecha: "2025-05-03" },
        { id: "r3", autor: "Soporte Forja", contenido: "Perfecto. Ya identificamos el bug. Se debía a un cambio en la librería de PDF. Lo corregimos y desplegamos la actualización. ¿Podría confirmar que ya funciona?", fecha: "2025-05-04" },
        { id: "r4", autor: "Carlos Mendoza", contenido: "Confirmado, ya funciona correctamente. ¡Gracias por la rápida respuesta!", fecha: "2025-05-04" },
      ],
    },
    {
      id: "t2", folio: "TK-002", titulo: "Solicitud de nueva funcionalidad: reporte de ventas mensual", descripcion: "Necesitamos un reporte que muestre las ventas agrupadas por mes con opción a exportar a Excel.", estado: "abierto", prioridad: "media", cliente: "María García", email: "maria@techsolutions.mx", fecha: "2025-05-06",
      respuestas: [
        { id: "r5", autor: "Soporte Forja", contenido: "Hola María. Tomamos nota de la solicitud. ¿Podríamos agendar una llamada para definir los detalles del reporte?", fecha: "2025-05-06" },
      ],
    },
    {
      id: "t3", folio: "TK-003", titulo: "Problema con inicio de sesión", descripcion: "Desde ayer no puedo acceder al panel. Me dice 'Usuario no encontrado' aunque uso el mismo correo de siempre.", estado: "en_progreso", prioridad: "critica", cliente: "Roberto Sánchez", email: "roberto@distrinorte.com", fecha: "2025-05-08",
      respuestas: [
        { id: "r6", autor: "Soporte Forja", contenido: "Roberto, revisamos y parece que hubo una migración de usuarios. Le restablecemos el acceso. En breve le enviamos un nuevo link de ingreso.", fecha: "2025-05-08" },
      ],
    },
    {
      id: "t4", folio: "TK-004", titulo: "Duda sobre actualización de precios masiva", descripcion: "¿Es posible actualizar el precio de varios productos al mismo tiempo? Tengo 50 productos que cambiaron de precio y actualizar uno por uno es muy lento.", estado: "abierto", prioridad: "baja", cliente: "Laura Jiménez", email: "laura@gruposanjuan.com", fecha: "2025-05-10",
      respuestas: [],
    },
    {
      id: "t5", folio: "TK-005", titulo: "Error en cálculo de IVA en facturas internacionales", descripcion: "Las facturas para clientes en el extranjero están calculando el IVA al 16% cuando deberían ser tasa 0% (exportación).", estado: "resuelto", prioridad: "alta", cliente: "Fernando López", email: "fernando@cloudpro.mx", fecha: "2025-05-11",
      respuestas: [
        { id: "r7", autor: "Soporte Forja", contenido: "Fernando, gracias por detectarlo. Hemos agregado un campo de 'tipo de operación' (nacional/exportación) que ajusta automáticamente el IVA. Ya está disponible en producción.", fecha: "2025-05-12" },
        { id: "r8", autor: "Fernando López", contenido: "Excelente, lo probaré de inmediato. Muchas gracias.", fecha: "2025-05-12" },
      ],
    },
    {
      id: "t6", folio: "TK-006", titulo: "Notificaciones de stock bajo no llegan", descripcion: "Configuré alertas para cuando un producto baje de 5 unidades pero no estoy recibiendo los correos.", estado: "abierto", prioridad: "media", cliente: "Gabriela Ruiz", email: "gabriela@ferreconstructor.com", fecha: "2025-05-14",
      respuestas: [],
    },
    {
      id: "t7", folio: "TK-007", titulo: "Mejora en búsqueda de productos", descripcion: "Sugiero que la búsqueda de productos permita filtrar por rango de precio además del nombre.", estado: "cerrado", prioridad: "baja", cliente: "Andrés Herrera", email: "andres@logisticaexpress.mx", fecha: "2025-05-01",
      respuestas: [
        { id: "r9", autor: "Soporte Forja", contenido: "Buena sugerencia. Lo agregamos al roadmap para el próximo sprint.", fecha: "2025-05-02" },
      ],
    },
  ],
}

const STORAGE_KEY = "forja_demo_data"

export function loadData(): DemoData {
  if (typeof window === "undefined") return SEED
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoData
      if (parsed.clientes && parsed.facturas && parsed.productos) return parsed
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
  return SEED
}

export function saveData(data: DemoData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function calcularFolio(tipo: string, existing: { folio: string }[]): string {
  const max = existing.reduce((n, i) => {
    const num = parseInt(i.folio.replace(/^\D+/, ""))
    return num > n ? num : n
  }, 0)
  return `${tipo}-${String(max + 1).padStart(3, "0")}`
}

export function moneda(n: number): string {
  return "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
