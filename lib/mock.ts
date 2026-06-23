export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  avatar: string;
  carrera: string;
  semestre: number;
  creadoEn: string;
};

export type Etiqueta = {
  id: string;
  nombre: string;
  color: string;
  usuarioId: string;
};

export type Nota = {
  id: string;
  titulo: string;
  contenido: string;
  usuarioId: string;
  archivada: boolean;
  fijada: boolean;
  creadaEn: string;
  actualizadaEn: string;
};

export type NotaEtiqueta = {
  id: string;
  notaId: string;
  etiquetaId: string;
};

export const usuarios: Usuario[] = [
  {
    id: "u1",
    nombre: "Sofía Ramírez",
    email: "sofia.ramirez@universidad.edu",
    avatar: "SR",
    carrera: "Ingeniería en Sistemas",
    semestre: 6,
    creadoEn: "2025-08-15T10:00:00Z",
  },
  {
    id: "u2",
    nombre: "Diego Herrera",
    email: "diego.herrera@universidad.edu",
    avatar: "DH",
    carrera: "Medicina",
    semestre: 4,
    creadoEn: "2025-09-01T09:30:00Z",
  },
  {
    id: "u3",
    nombre: "Valentina Torres",
    email: "valentina.torres@universidad.edu",
    avatar: "VT",
    carrera: "Derecho",
    semestre: 8,
    creadoEn: "2025-07-20T14:15:00Z",
  },
  {
    id: "u4",
    nombre: "Mateo Gómez",
    email: "mateo.gomez@universidad.edu",
    avatar: "MG",
    carrera: "Administración de Empresas",
    semestre: 3,
    creadoEn: "2026-01-10T08:45:00Z",
  },
];

export const etiquetas: Etiqueta[] = [
  { id: "e1", nombre: "Matemáticas", color: "#6366f1", usuarioId: "u1" },
  { id: "e2", nombre: "Algoritmos", color: "#8b5cf6", usuarioId: "u1" },
  { id: "e3", nombre: "Bases de Datos", color: "#0ea5e9", usuarioId: "u1" },
  { id: "e4", nombre: "Anatomía", color: "#ef4444", usuarioId: "u2" },
  { id: "e5", nombre: "Farmacología", color: "#f97316", usuarioId: "u2" },
  { id: "e6", nombre: "Derecho Civil", color: "#10b981", usuarioId: "u3" },
  { id: "e7", nombre: "Examen Parcial", color: "#f59e0b", usuarioId: "u1" },
  { id: "e8", nombre: "Finanzas", color: "#14b8a6", usuarioId: "u4" },
];

export const notas: Nota[] = [
  {
    id: "n1",
    titulo: "Complejidad algorítmica — Big O Notation",
    contenido:
      "La notación Big O describe el comportamiento límite de una función cuando el argumento tiende hacia un valor particular. O(1) es tiempo constante, O(log n) logarítmico, O(n) lineal, O(n²) cuadrático. Ejemplos: búsqueda binaria es O(log n), bubble sort es O(n²). Siempre analizar el peor caso a menos que se indique lo contrario.",
    usuarioId: "u1",
    archivada: false,
    fijada: true,
    creadaEn: "2026-03-10T11:00:00Z",
    actualizadaEn: "2026-06-20T09:15:00Z",
  },
  {
    id: "n2",
    titulo: "Normalización de bases de datos — 1FN a 3FN",
    contenido:
      "1FN: Eliminar grupos repetitivos, cada celda debe tener un valor atómico. 2FN: Eliminar dependencias parciales de la clave primaria. 3FN: Eliminar dependencias transitivas. BCNF: Toda dependencia funcional X→Y, X debe ser superclave. Desnormalización se aplica cuando el rendimiento es crítico. Clave foránea siempre referencia a clave primaria.",
    usuarioId: "u1",
    archivada: false,
    fijada: false,
    creadaEn: "2026-04-05T14:30:00Z",
    actualizadaEn: "2026-06-18T16:00:00Z",
  },
  {
    id: "n3",
    titulo: "Derivadas — Reglas de diferenciación",
    contenido:
      "Regla de la potencia: d/dx(xⁿ) = n·xⁿ⁻¹. Regla del producto: d/dx(uv) = u'v + uv'. Regla del cociente: d/dx(u/v) = (u'v - uv')/v². Regla de la cadena: d/dx(f(g(x))) = f'(g(x))·g'(x). Derivada de sen(x) = cos(x), de cos(x) = -sen(x), de eˣ = eˣ, de ln(x) = 1/x.",
    usuarioId: "u1",
    archivada: false,
    fijada: true,
    creadaEn: "2026-05-12T09:00:00Z",
    actualizadaEn: "2026-06-21T10:45:00Z",
  },
  {
    id: "n4",
    titulo: "Sistema nervioso central — Estructuras y funciones",
    contenido:
      "El SNC se compone de encéfalo y médula espinal. El encéfalo incluye: cerebro (cognición, movimiento voluntario), cerebelo (coordinación, equilibrio), tronco encefálico (funciones vitales: respiración, frecuencia cardíaca). Los ventrículos contienen LCR. La barrera hematoencefálica protege el tejido nervioso. Las neuronas se clasifican en motoras, sensitivas e interneuronas.",
    usuarioId: "u2",
    archivada: false,
    fijada: true,
    creadaEn: "2026-02-28T08:00:00Z",
    actualizadaEn: "2026-06-19T07:30:00Z",
  },
  {
    id: "n5",
    titulo: "Antibióticos — Clasificación y mecanismos de acción",
    contenido:
      "β-lactámicos (penicilinas, cefalosporinas): inhiben síntesis de pared celular. Aminoglucósidos (gentamicina): inhiben síntesis proteica en ribosoma 30S. Macrólidos (azitromicina): inhibición en 50S. Quinolonas (ciprofloxacino): inhibición de ADN girasa. Tetraciclinas: bacteriostáticos de amplio espectro. Resistencia: β-lactamasas, bombas de eflujo, modificación del sitio diana.",
    usuarioId: "u2",
    archivada: false,
    fijada: false,
    creadaEn: "2026-04-18T13:00:00Z",
    actualizadaEn: "2026-06-15T11:20:00Z",
  },
  {
    id: "n6",
    titulo: "Contratos — Elementos esenciales y clasificación",
    contenido:
      "Elementos esenciales: consentimiento (oferta + aceptación), objeto (lícito, posible, determinado), causa (lícita). Clasificación: bilaterales/unilaterales, onerosos/gratuitos, conmutativos/aleatorios, formales/consensuales. Vicios del consentimiento: error, dolo, violencia, lesión. Nulidad absoluta vs relativa. Arts. 1792–1859 Código Civil Federal.",
    usuarioId: "u3",
    archivada: false,
    fijada: false,
    creadaEn: "2026-01-30T15:00:00Z",
    actualizadaEn: "2026-06-22T12:00:00Z",
  },
  {
    id: "n7",
    titulo: "Estados financieros — Balance general y estado de resultados",
    contenido:
      "Balance general: Activos = Pasivos + Capital. Activos circulantes (efectivo, cuentas por cobrar, inventarios) vs activos fijos (maquinaria, equipo). Pasivos corrientes vs largo plazo. Estado de resultados: Ingresos − Costo de ventas = Utilidad bruta. Utilidad bruta − Gastos operativos = EBIT. EBIT − Intereses − Impuestos = Utilidad neta. EBITDA excluye depreciación y amortización.",
    usuarioId: "u4",
    archivada: false,
    fijada: true,
    creadaEn: "2026-03-22T10:30:00Z",
    actualizadaEn: "2026-06-20T14:00:00Z",
  },
  {
    id: "n8",
    titulo: "Resumen parcial — Estructuras de datos",
    contenido:
      "Stack (LIFO): push/pop O(1). Queue (FIFO): enqueue/dequeue O(1). Lista enlazada: inserción O(1), búsqueda O(n). Árbol binario de búsqueda: búsqueda/inserción O(log n) promedio, O(n) peor caso. Hash table: búsqueda/inserción O(1) amortizado. Heap: inserción O(log n), extracción del máximo O(log n). Grafo: BFS/DFS O(V+E).",
    usuarioId: "u1",
    archivada: true,
    fijada: false,
    creadaEn: "2026-05-30T17:00:00Z",
    actualizadaEn: "2026-06-01T08:00:00Z",
  },
];

export const notaEtiquetas: NotaEtiqueta[] = [
  { id: "ne1", notaId: "n1", etiquetaId: "e2" },
  { id: "ne2", notaId: "n1", etiquetaId: "e7" },
  { id: "ne3", notaId: "n2", etiquetaId: "e3" },
  { id: "ne4", notaId: "n3", etiquetaId: "e1" },
  { id: "ne5", notaId: "n3", etiquetaId: "e7" },
  { id: "ne6", notaId: "n4", etiquetaId: "e4" },
  { id: "ne7", notaId: "n5", etiquetaId: "e5" },
  { id: "ne8", notaId: "n6", etiquetaId: "e6" },
  { id: "ne9", notaId: "n7", etiquetaId: "e8" },
  { id: "ne10", notaId: "n8", etiquetaId: "e2" },
  { id: "ne11", notaId: "n8", etiquetaId: "e7" },
];

export const USUARIO_ACTIVO_ID = "u1";

export function getEtiquetasDe(notaId: string): Etiqueta[] {
  const ids = notaEtiquetas
    .filter((ne) => ne.notaId === notaId)
    .map((ne) => ne.etiquetaId);
  return etiquetas.filter((e) => ids.includes(e.id));
}

export function getNotasDe(usuarioId: string): Nota[] {
  return notas.filter((n) => n.usuarioId === usuarioId);
}

export function getEtiquetasDeUsuario(usuarioId: string): Etiqueta[] {
  return etiquetas.filter((e) => e.usuarioId === usuarioId);
}

// Auto-stub (deploy validator): exports que las paginas usan pero faltaban.
export const etiquetasMock: any = {};
