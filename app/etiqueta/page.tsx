"use client";
export const dynamic = "force-dynamic";
import { useState } from 'react'
import Link from 'next/link'
import { etiquetasMock } from '@/lib/mock'

interface Etiqueta {
  id: number
  nombre: string
  color: string
  descripcion: string
  notasCount: number
}

const COLORES: { label: string; value: string }[] = [
  { label: 'Rojo', value: '#ef4444' },
  { label: 'Naranja', value: '#f97316' },
  { label: 'Amarillo', value: '#eab308' },
  { label: 'Verde', value: '#22c55e' },
  { label: 'Azul', value: '#3b82f6' },
  { label: 'Índigo', value: '#6366f1' },
  { label: 'Violeta', value: '#a855f7' },
  { label: 'Rosa', value: '#ec4899' },
]

const FORM_VACIO = {
  nombre: '',
  color: '#6366f1',
  descripcion: '',
}

export default function EtiquetasPage() {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>(etiquetasMock)
  const [formulario, setFormulario] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [confirmEliminar, setConfirmEliminar] = useState<number | null>(null)
  const [errorNombre, setErrorNombre] = useState(false)

  const etiquetasFiltradas = (etiquetas ?? []).filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const masUsada = etiquetas?.length
    ? (etiquetas ?? []).reduce((a, b) => (a.notasCount >= b.notasCount ? a : b))
    : null

  const handleNueva = () => {
    setFormulario(FORM_VACIO)
    setEditandoId(null)
    setErrorNombre(false)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditar = (etiqueta: Etiqueta) => {
    setFormulario({
      nombre: etiqueta.nombre,
      color: etiqueta.color,
      descripcion: etiqueta.descripcion,
    })
    setEditandoId(etiqueta.id)
    setErrorNombre(false)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGuardar = () => {
    if (!formulario.nombre.trim()) {
      setErrorNombre(true)
      return
    }

    if (editandoId !== null) {
      setEtiquetas((prev) =>
        (prev ?? []).map((e) => (e.id === editandoId ? { ...e, ...formulario } : e)),
      )
    } else {
      const nueva: Etiqueta = {
        id: Math.max(0, ...etiquetas.map((e) => e.id)) + 1,
        ...formulario,
        notasCount: 0,
      }
      setEtiquetas((prev) => [nueva, ...prev])
    }

    setFormulario(FORM_VACIO)
    setEditandoId(null)
    setMostrarFormulario(false)
    setErrorNombre(false)
  }

  const handleCancelar = () => {
    setFormulario(FORM_VACIO)
    setEditandoId(null)
    setMostrarFormulario(false)
    setErrorNombre(false)
  }

  const handleEliminar = (id: number) => {
    setEtiquetas((prev) => (prev ?? []).filter((e) => e.id !== id))
    setConfirmEliminar(null)
    if (editandoId === id) handleCancelar()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-6 border-b border-slate-100">
          <span className="text-2xl">📝</span>
          <h1 className="text-lg font-bold text-slate-900 mt-1 leading-tight">
            NotasApp
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Para estudiantes</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <span className="text-base">🏠</span>
            Dashboard
          </Link>
          <Link
            href="/nota"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <span className="text-base">📄</span>
            Mis Notas
          </Link>
          <Link
            href="/etiqueta"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold"
          >
            <span className="text-base">🏷️</span>
            Etiquetas
          </Link>
          <Link
            href="/usuario"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <span className="text-base">👤</span>
            Perfil
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                Ana García
              </p>
              <p className="text-xs text-slate-400 truncate">ana@uni.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Etiquetas</h2>
            <p className="text-sm text-slate-500">
              Organiza tus notas con categorías personalizadas
            </p>
          </div>
          <button
            onClick={handleNueva}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva etiqueta
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total etiquetas
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {etiquetas?.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Notas etiquetadas
              </p>
              <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                {(etiquetas ?? []).reduce((s, e) => s + e.notasCount, 0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Más usada
              </p>
              {masUsada ? (
                <span
                  className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: masUsada.color }}
                >
                  {masUsada.nombre}
                </span>
              ) : (
                <p className="text-slate-400 mt-2">—</p>
              )}
            </div>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-indigo-800">
                  {editandoId !== null
                    ? '✏️  Editando etiqueta'
                    : '➕  Nueva etiqueta'}
                </h3>
                <button
                  onClick={handleCancelar}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Cerrar formulario"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre{' '}
                    <span className="text-red-500" aria-hidden>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formulario.nombre}
                    onChange={(e) => {
                      setFormulario({ ...formulario, nombre: e.target.value })
                      if (e.target.value.trim()) setErrorNombre(false)
                    }}
                    placeholder="ej. Matemáticas"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      errorNombre ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errorNombre && (
                    <p className="text-xs text-red-500 mt-1">
                      El nombre es obligatorio
                    </p>
                  )}
                </div>

                {/* Vista previa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Vista previa
                  </label>
                  <div className="flex items-center gap-3 h-[42px]">
                    <span
                      className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm transition-colors"
                      style={{ backgroundColor: formulario.color }}
                    >
                      {formulario.nombre || 'Mi etiqueta'}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formulario.descripcion}
                    onChange={(e) =>
                      setFormulario({ ...formulario, descripcion: e.target.value })
                    }
                    placeholder="Descripción opcional de la categoría..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Color */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {(COLORES ?? []).map((c) => (
                      <button
                        key={c.value}
                        title={c.label}
                        onClick={() =>
                          setFormulario({ ...formulario, color: c.value })
                        }
                        className={`w-8 h-8 rounded-full shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${
                          formulario.color === c.value
                            ? 'scale-110 ring-2 ring-offset-2 ring-slate-700'
                            : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={handleCancelar}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  {editandoId !== null ? 'Guardar cambios' : 'Crear etiqueta'}
                </button>
              </div>
            </div>
          )}

          {/* Buscador */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {etiquetasFiltradas?.length}{' '}
                {etiquetasFiltradas?.length === 1 ? 'etiqueta' : 'etiquetas'}
                {busqueda && (
                  <span className="text-slate-400 font-normal">
                    {' '}
                    · buscando &ldquo;{busqueda}&rdquo;
                  </span>
                )}
              </p>
            </div>

            {etiquetasFiltradas?.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-5xl block mb-3">🏷️</span>
                <p className="text-slate-500 text-sm font-medium">
                  {busqueda
                    ? 'Ninguna etiqueta coincide con la búsqueda'
                    : 'Aún no hay etiquetas. ¡Crea la primera!'}
                </p>
                {!busqueda && (
                  <button
                    onClick={handleNueva}
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Crear etiqueta
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Etiqueta
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Notas
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(etiquetasFiltradas ?? []).map((etiqueta) => (
                      <tr
                        key={etiqueta.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: etiqueta.color }}
                            />
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                              style={{ backgroundColor: etiqueta.color }}
                            >
                              {etiqueta.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {etiqueta.descripcion ? (
                            <span className="text-sm text-slate-600 line-clamp-1">
                              {etiqueta.descripcion}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-300 italic">
                              Sin descripción
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                            {etiqueta.notasCount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditar(etiqueta)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Editar
                            </button>

                            {confirmEliminar === etiqueta.id ? (
                              <div className="flex items-center gap-1.5 animate-pulse">
                                <span className="text-xs text-red-600 font-medium mr-1">
                                  ¿Eliminar?
                                </span>
                                <button
                                  onClick={() => handleEliminar(etiqueta.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setConfirmEliminar(null)}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmEliminar(etiqueta.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Vista rápida en pills */}
          {etiquetas?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                Vista rápida · haz clic para editar
              </h3>
              <div className="flex flex-wrap gap-2">
                {(etiquetas ?? []).map((etiqueta) => (
                  <button
                    key={etiqueta.id}
                    onClick={() => handleEditar(etiqueta)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
                    style={{ backgroundColor: etiqueta.color }}
                  >
                    {etiqueta.nombre}
                    <span className="bg-black/20 rounded-full px-1.5 py-0.5 text-xs font-bold leading-none">
                      {etiqueta.notasCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}