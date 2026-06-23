"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { usuarios as mockUsuarios, type Usuario } from "@/lib/mock";
import {
  UserCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ROLES = ["estudiante", "administrador"] as const;
type Rol = (typeof ROLES)[number];

const ROL_BADGE: Record<Rol, string> = {
  estudiante: "bg-blue-100 text-blue-700",
  administrador: "bg-purple-100 text-purple-700",
};

const emptyForm = (): Omit<Usuario, "id" | "fechaCreacion"> => ({
  nombre: "",
  email: "",
  rol: "estudiante",
  activo: true,
});

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<Omit<Usuario, "id" | "fechaCreacion">>(emptyForm());
  const [errores, setErrores] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "error" } | null>(null);

  /* ──────────────── helpers ──────────────── */
  const mostrarToast = (msg: string, tipo: "ok" | "error" = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm(emptyForm());
    setErrores({});
    setShowModal(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditando(u);
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol, activo: u.activo });
    setErrores({});
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setForm(emptyForm());
    setErrores({});
  };

  const validar = (): boolean => {
    const e: typeof errores = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido.";
    if (!form.email.trim()) {
      e.email = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Correo no válido.";
    } else {
      const duplicado = (usuarios ?? []).find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editando?.id
      );
      if (duplicado) e.email = "Este correo ya está registrado.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    if (editando) {
      setUsuarios((prev) =>
        (prev ?? []).map((u) => (u.id === editando.id ? { ...u, ...form } : u))
      );
      mostrarToast("Usuario actualizado correctamente.");
    } else {
      const nuevo: Usuario = {
        id: Math.max(0, ...usuarios.map((u) => u.id)) + 1,
        fechaCreacion: new Date().toISOString().split("T")[0],
        ...form,
      };
      setUsuarios((prev) => [nuevo, ...prev]);
      mostrarToast("Usuario creado correctamente.");
    }
    cerrarModal();
  };

  const eliminar = (id: number) => {
    setUsuarios((prev) => (prev ?? []).filter((u) => u.id !== id));
    setConfirmDelete(null);
    mostrarToast("Usuario eliminado.");
  };

  /* ──────────────── filtrado ──────────────── */
  const filtrados = (usuarios ?? []).filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.rol.toLowerCase().includes(q)
    );
  });

  /* ──────────────── render ──────────────── */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-slate-200 px-4 py-8 gap-1 shrink-0">
          <div className="flex items-center gap-2 mb-8 px-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="font-bold text-slate-800 text-lg tracking-tight">NotasApp</span>
          </div>
          {[
            {
              href: "/dashboard", label: "Dashboard",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              href: "/nota", label: "Notas",
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            },
            {
              href: "/etiqueta", label: "Etiquetas",
              icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
            },
            {
              href: "/usuario", label: "Usuarios",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                href === "/usuario"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
              </svg>
              {label}
            </Link>
          ))}
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Gestiona las cuentas de la plataforma — {usuarios?.length} registros
              </p>
            </div>
            <button
              onClick={abrirCrear}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Nuevo usuario
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total", value: usuarios?.length, color: "text-slate-800" },
              { label: "Estudiantes", value: (usuarios ?? []).filter((u) => u.rol === "estudiante").length, color: "text-blue-700" },
              { label: "Admins", value: (usuarios ?? []).filter((u) => u.rol === "administrador").length, color: "text-purple-700" },
              { label: "Activos", value: (usuarios ?? []).filter((u) => u.activo).length, color: "text-emerald-700" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o rol…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">#</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Usuario</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Correo</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Rol</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Estado</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Creado</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-600 whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtrados?.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400">
                        <UserCircleIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                  {(filtrados ?? []).map((u, idx) => {
                    const initials = u.nombre
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase();
                    const avatarPalette = [
                      "bg-indigo-100 text-indigo-700",
                      "bg-emerald-100 text-emerald-700",
                      "bg-amber-100 text-amber-700",
                      "bg-rose-100 text-rose-700",
                      "bg-sky-100 text-sky-700",
                    ];
                    const avatarColor = avatarPalette[u.id % avatarPalette?.length];

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
                              {initials}
                            </span>
                            <span className="font-medium text-slate-800">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ROL_BADGE[u.rol as Rol] ?? "bg-slate-100 text-slate-600"}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.activo ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 tabular-nums">{u.fechaCreacion}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => abrirEditar(u)}
                              title="Editar"
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u.id)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              Mostrando {filtrados?.length} de {usuarios?.length} usuarios
            </div>
          </div>
        </main>
      </div>

      {/* ────────── Modal crear / editar ────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={cerrarModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editando ? "Editar usuario" : "Nuevo usuario"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editando ? `ID #${editando.id}` : "Completa los datos del nuevo miembro."}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body modal */}
            <div className="px-6 py-6 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. María García López"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errores.nombre
                      ? "border-red-300 focus:ring-red-300"
                      : "border-slate-200 focus:ring-indigo-400"
                  }`}
                />
                {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errores.email
                      ? "border-red-300 focus:ring-red-300"
                      : "border-slate-200 focus:ring-indigo-400"
                  }`}
                />
                {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as Rol }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {(ROLES ?? []).map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle activo */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Cuenta activa</p>
                  <p className="text-xs text-slate-500 mt-0.5">El usuario podrá iniciar sesión</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
                    form.activo ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.activo ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                <CheckCircleIcon className="w-4 h-4" />
                {editando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────── Modal confirmar eliminación ────────── */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">¿Eliminar usuario?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Esta acción no se puede deshacer. El usuario y todas sus notas asociadas serán eliminados permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmDelete)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────── Toast ────────── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.tipo === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
          <CheckCircleIcon className="w-5 h-5 shrink-0" />
          {toast.msg}
        </div>
      )}
    </div>
  );
}