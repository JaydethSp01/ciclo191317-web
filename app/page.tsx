"use client";
export const dynamic = "force-dynamic";
import { Hero } from "@/components/ui/Hero";
import Link from 'next/link';
import { notas, etiquetas, usuarios, notaEtiquetas } from '@/lib/mock';
import {
  BookOpen,
  Tag,
  Clock,
  TrendingUp,
  ChevronRight,
  Search,
  PlusCircle,
  ArrowUpRight,
} from 'lucide-react';

const totalNotas = notas?.length;
const totalEtiquetas = etiquetas?.length;
const notasEstaSemana = (notas ?? []).filter((n) => {
  const diff =
    (new Date().getTime() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}).length;
const promedioEtiquetas =
  totalNotas > 0 ? (notaEtiquetas?.length / totalNotas).toFixed(1) : '0';

const metricCards = [
  {
    label: 'Total de Notas',
    value: totalNotas,
    icon: BookOpen,
    light: 'bg-indigo-50',
    text: 'text-indigo-600',
    trend: '+2 este mes',
    href: '/notas',
  },
  {
    label: 'Etiquetas Activas',
    value: totalEtiquetas,
    icon: Tag,
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    trend: `${(etiquetas ?? []).filter((e) => e.activa).length} en uso`,
    href: '/etiquetas',
  },
  {
    label: 'Notas esta Semana',
    value: notasEstaSemana,
    icon: Clock,
    light: 'bg-amber-50',
    text: 'text-amber-600',
    trend: 'Últimos 7 días',
    href: '/notas',
  },
  {
    label: 'Etiquetas / Nota',
    value: promedioEtiquetas,
    icon: TrendingUp,
    light: 'bg-violet-50',
    text: 'text-violet-600',
    trend: 'Promedio actual',
    href: '/etiquetas',
  },
];

const notasRecientes = [...notas]
  .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 6);

function getEtiquetasDeNota(notaId: string) {
  return notaEtiquetas
    .filter((ne) => ne.notaId === notaId)
    .map((ne) => (etiquetas ?? []).find((e) => e.id === ne.etiquetaId))
    .filter(Boolean) as typeof etiquetas;
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const colorMap: Record<string, string> = {
  indigo:  'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100 text-amber-700',
  rose:    'bg-rose-100 text-rose-700',
  violet:  'bg-violet-100 text-violet-700',
  sky:     'bg-sky-100 text-sky-700',
  orange:  'bg-orange-100 text-orange-700',
};

export default function DashboardPage() {
  const usuario = usuarios[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero title="Hola, {usuario.nombre.split(' ')[0]} 👋" subtitle="Aquí tienes un resumen de tu actividad de estudio." />
      {/* ── Top Nav ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Welcome ─────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hola, {usuario.nombre.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Aquí tienes un resumen de tu actividad de estudio.
          </p>
        </div>

        {/* ── Metric Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(metricCards ?? []).map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${card.light} p-2.5 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition" />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{card.value}</p>
                <p className="text-sm font-medium text-slate-700">{card.label}</p>
                <p className="text-xs text-slate-400 mt-1">{card.trend}</p>
              </Link>
            );
          })}
        </div>

        {/* ── Main Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabla notas recientes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Notas recientes</h2>
              <Link
                href="/notas"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition"
              >
                Ver todas <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Título
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Etiquetas
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Fecha
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(notasRecientes ?? []).map((nota) => {
                    const etqs = getEtiquetasDeNota(nota.id);
                    return (
                      <tr key={nota.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 truncate max-w-[220px]">
                            {nota.titulo}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                            {nota.contenido.slice(0, 60)}…
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {etqs?.length === 0 ? (
                              <span className="text-slate-300 text-xs">—</span>
                            ) : (
                              etqs.slice(0, 2).map((e) => (
                                <span
                                  key={e.id}
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    colorMap[e.color] ?? 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {e.nombre}
                                </span>
                              ))
                            )}
                            {etqs?.length > 2 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                +{etqs?.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {formatFecha(nota.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/notas/${nota.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-xs transition"
                          >
                            Abrir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="flex flex-col gap-4">
            {/* Nube de etiquetas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Etiquetas</h2>
                <Link
                  href="/etiquetas"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  Gestionar
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {(etiquetas ?? []).map((etq) => {
                  const count = (notaEtiquetas ?? []).filter(
                    (ne) => ne.etiquetaId === etq.id
                  ).length;
                  return (
                    <Link
                      key={etq.id}
                      href={`/etiquetas/${etq.id}`}
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium transition hover:opacity-80 ${
                        colorMap[etq.color] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {etq.nombre}
                      <span className="ml-0.5 text-xs opacity-60">({count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Búsqueda rápida */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-3">Búsqueda rápida</h2>
              <Link
                href="/buscar"
                className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 text-sm hover:border-indigo-300 hover:bg-indigo-50 transition"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                Buscar en tus notas…
              </Link>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
              <h2 className="font-semibold mb-1">¿Listo para estudiar?</h2>
              <p className="text-indigo-200 text-xs mb-4">
                Crea una nota y organízala con etiquetas para encontrarla siempre.
              </p>
              <Link
                href="/notas/nueva"
                className="flex items-center justify-center gap-2 w-full bg-white text-indigo-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-indigo-50 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Crear nota ahora
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}