"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from "react";
import Link from "next/link";
import { notas as mockNotas, etiquetas as mockEtiquetas } from "@/lib/mock";
import type { Nota, Etiqueta } from "@/lib/mock";

interface NotaForm {
  titulo: string;
  contenido: string;
  etiquetaIds: number[];
}

const FORM_VACIO: NotaForm = {
  titulo: "",
  contenido: "",
  etiquetaIds: [],
};

export default function NotaPage() {
  const [notas, setNotas] = useState<Nota[]>(mockNotas);
  const [etiquetas] = useState<Etiqueta[]>(mockEtiquetas);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEtiqueta, setFiltroEtiqueta] = useState<number | null>(null);
  const [modo, setModo] = useState<"cerrado" | "crear" | "editar">("cerrado");
  const [notaActual, setNotaActual] = useState<Nota | null>(null);
  const [form, setForm] = useState<NotaForm>(FORM_VACIO);
  const [errorTitulo, setErrorTitulo] = useState(false);
  const [nextId, setNextId] = useState(
    Math.max(...mockNotas.map((n) => n.id)) + 1
  );

  const notasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase();
    return (notas ?? []).filter((nota) => {
      const matchTexto =
        nota.titulo.toLowerCase().includes(q) ||
        nota.contenido.toLowerCase().includes(q);
      const matchTag =
        filtroEtiqueta === null ||
        (nota.etiquetas ?? []).some((e) => e.id === filtroEtiqueta);
      return matchTexto && matchTag;
    });
  }, [notas, busqueda, filtroEtiqueta]);

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setNotaActual(null);
    setErrorTitulo(false);
    setModo("crear");
  };

  const abrirEditar = (nota: Nota) => {
    setForm({
      titulo: nota.titulo,
      contenido: nota.contenido,
      etiquetaIds: (nota.etiquetas ?? []).map((e) => e.id),
    });
    setNotaActual(nota);
    setErrorTitulo(false);
    setModo("editar");
  };

  const cerrar = () => {
    setModo("cerrado");
    setNotaActual(null);
    setForm(FORM_VACIO);
    setErrorTitulo(false);
  };

  const guardar = () => {
    if (!form.titulo.trim()) {
      setErrorTitulo(true);
      return;
    }
    const etiquetasElegidas = (etiquetas ?? []).filter((e) =>
      form.etiquetaIds.includes(e.id)
    );
    const hoy = new Date().toISOString().split("T")[0];

    if (modo === "crear") {
      const nueva: Nota = {
        id: nextId,
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        fechaCreacion: hoy,
        fechaActualizacion: hoy,
        usuarioId: 1,
        etiquetas: etiquetasElegidas,
      };
      setNotas([nueva, ...notas]);
      setNextId((prev) => prev + 1);
    } else if (modo === "editar" && notaActual) {
      setNotas((prev) =>
        (prev ?? []).map((n) =>
          n.id === notaActual.id
            ? {
                ...n,
                titulo: form.titulo.trim(),
                contenido: form.contenido.trim(),
                etiquetas: etiquetasElegidas,
                fechaActualizacion: hoy,
              }
            : n
        )
      );
    }
    cerrar();
  };

  const eliminar = (id: number) => {
    setNotas((prev) => (prev ?? []).filter((n) => n.id !== id));
  };

  const toggleEtiquetaForm = (id: number) => {
    setForm((prev) => ({
      ...prev,
      etiquetaIds: prev.etiquetaIds.includes(id)
        ? (prev.etiquetaIds ?? []).filter((eid) => eid !== id)
        : [...prev.etiquetaIds, id],
    }));
  };

  const totalEtiquetadas = (notas ?? []).filter((n) => n.etiquetas?.length > 0).length;
  const etiquetaMasUsada = etiquetas
    .map((e) => ({
      ...e,
      count: (notas ?? []).filter((n) => (n.etiquetas ?? []).some((ne) => ne.id === e.id)).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Cabecera ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white text-xs font-bold select-none">
              N
            </div>
            <span className="text-base font-semibold text-slate-800 tracking-tight">
              NotasApp
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/nota"
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md"
            >
              Notas
            </Link>
            <Link
              href="/etiqueta"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              Etiquetas
            </Link>
            <Link
              href="/usuario"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              Usuarios
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* ── Título + botón ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mis notas</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gestiona, filtra y organiza todas tus notas de estudio.
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Nueva nota
          </button>
        </div>

        {/* ── Estadísticas ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total notas
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {notas?.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Con etiqueta
            </p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {totalEtiquetadas}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 col-span-2 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Etiqueta top
            </p>
            {etiquetaMasUsada && etiquetaMasUsada.count > 0 ? (
              <span
                className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: etiquetaMasUsada.color + "22",
                  color: etiquetaMasUsada.color,
                }}
              >
                {etiquetaMasUsada.nombre}
                <span className="ml-1.5 opacity-75 text-xs">
                  ×{etiquetaMasUsada.count}
                </span>
              </span>
            ) : (
              <p className="text-slate-400 text-sm mt-1">—</p>
            )}
          </div>
        </div>

        {/* ── Barra de filtros ── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por título o contenido…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFiltroEtiqueta(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filtroEtiqueta === null
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Todas
            </button>
            {(etiquetas ?? []).map((et) => (
              <button
                key={et.id}
                onClick={() =>
                  setFiltroEtiqueta(filtroEtiqueta === et.id ? null : et.id)
                }
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={
                  filtroEtiqueta === et.id
                    ? { backgroundColor: et.color, color: "#fff", borderColor: et.color }
                    : { backgroundColor: "#fff", color: et.color, borderColor: et.color + "66" }
                }
              >
                {et.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabla ── */}
        {notasFiltradas?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-700 font-semibold">
              No hay notas que coincidan
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Ajusta los filtros o crea una nueva nota.
            </p>
            <button
              onClick={abrirCrear}
              className="mt-5 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Crear nota
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 w-10">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                    Título
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Contenido
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                    Etiquetas
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                    Actualizado
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(notasFiltradas ?? []).map((nota, idx) => (
                  <tr
                    key={nota.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-900">
                        {nota.titulo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell max-w-xs">
                      <span className="text-slate-500 line-clamp-2 leading-relaxed">
                        {nota.contenido || (
                          <em className="text-slate-300 not-italic">Sin contenido</em>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {nota.etiquetas?.length === 0 ? (
                          <span className="text-slate-300 text-xs">—</span>
                        ) : (
                          (nota.etiquetas ?? []).map((et) => (
                            <span
                              key={et.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: et.color + "1a",
                                color: et.color,
                                border: `1px solid ${et.color}40`,
                              }}
                            >
                              {et.nombre}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400 whitespace-nowrap">
                      {nota.fechaActualizacion}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => abrirEditar(nota)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(nota.id)}
                          className="px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
              Mostrando {notasFiltradas?.length} de {notas?.length} nota
              {notas?.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </main>

      {/* ── Modal formulario ── */}
      {modo !== "cerrado" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={cerrar}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                    modo === "crear" ? "bg-indigo-600" : "bg-amber-500"
                  }`}
                >
                  {modo === "crear" ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  {modo === "crear" ? "Nueva nota" : "Editar nota"}
                </h2>
              </div>
              <button
                onClick={cerrar}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Ej: Apuntes de Álgebra Lineal"
                  value={form.titulo}
                  onChange={(e) => {
                    setForm({ ...form, titulo: e.target.value });
                    if (e.target.value.trim()) setErrorTitulo(false);
                  }}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                    errorTitulo
                      ? "border-red-400 focus:ring-red-300"
                      : "border-slate-200 focus:ring-indigo-300"
                  }`}
                />
                {errorTitulo && (
                  <p className="text-red-500 text-xs mt-1">
                    El título es obligatorio.
                  </p>
                )}
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contenido
                </label>
                <textarea
                  rows={6}
                  placeholder="Escribe el desarrollo de tu nota, fórmulas, conceptos clave…"
                  value={form.contenido}
                  onChange={(e) =>
                    setForm({ ...form, contenido: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none leading-relaxed"
                />
                <p className="text-right text-xs text-slate-400 mt-1">
                  {form.contenido?.length} caracteres
                </p>
              </div>

              {/* Etiquetas */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2">
                  {(etiquetas ?? []).map((et) => {
                    const activa = form.etiquetaIds.includes(et.id);
                    return (
                      <button
                        key={et.id}
                        type="button"
                        onClick={() => toggleEtiquetaForm(et.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                        style={
                          activa
                            ? { backgroundColor: et.color, color: "#fff", borderColor: et.color }
                            : { backgroundColor: "#fff", color: et.color, borderColor: et.color + "66" }
                        }
                      >
                        {activa && (
                          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M9.707 3.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L5 6.586l3.293-3.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                        {et.nombre}
                      </button>
                    );
                  })}
                </div>
                {form.etiquetaIds?.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    {form.etiquetaIds?.length} etiqueta
                    {form.etiquetaIds?.length !== 1 ? "s" : ""} seleccionada
                    {form.etiquetaIds?.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                onClick={cerrar}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  modo === "crear"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {modo === "crear" ? "Crear nota" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}