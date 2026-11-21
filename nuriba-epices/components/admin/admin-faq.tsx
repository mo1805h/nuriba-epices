"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export default function AdminFaq() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("faq_items")
      .select("id,question,answer,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (err) setError(err.message);
    setRows((data as FaqRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(row?: FaqRow) {
    setError("");
    setEditingId(row ? row.id : "new");
    setQuestion(row?.question ?? "");
    setAnswer(row?.answer ?? "");
  }

  async function save() {
    if (question.trim().length < 3 || answer.trim().length < 3) {
      setError("La question et la réponse sont obligatoires.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { question: question.trim(), answer: answer.trim() };
    const { error: err } =
      editingId === "new"
        ? await supabase.from("faq_items").insert({
            ...payload,
            sort_order: (rows.at(-1)?.sort_order ?? 0) + 1,
          })
        : await supabase.from("faq_items").update(payload).eq("id", editingId!);
    setSaving(false);
    if (err) {
      setError("Enregistrement impossible. Vérifiez que vous êtes connecté avec le compte fondateur.");
      return;
    }
    setEditingId(null);
    load();
  }

  async function remove(row: FaqRow) {
    if (!confirm(`Supprimer la question « ${row.question} » ?`)) return;
    const { error: err } = await supabase.from("faq_items").delete().eq("id", row.id);
    if (err) {
      setError("Suppression impossible.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((r, i) => ({ ...r, sort_order: i + 1 }));
    setRows(renumbered);
    await Promise.all(
      [renumbered[index], renumbered[target]].map((r) =>
        supabase.from("faq_items").update({ sort_order: r.sort_order }).eq("id", r.id)
      )
    );
  }

  const form = (
    <div className="space-y-3 rounded-2xl border-2 border-mid-green bg-white p-4">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={200}
          className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          placeholder="Ex : Livrez-vous en dehors de Ouagadougou ?"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Réponse</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-deep-green px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          onClick={() => setEditingId(null)}
          className="rounded-full border border-border-soft px-5 py-2 text-sm font-semibold text-muted"
        >
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-deep-green">Questions fréquentes</h2>
        {editingId === null && (
          <button
            onClick={() => startEdit()}
            className="rounded-full bg-deep-green px-4 py-2 text-xs font-bold text-white"
          >
            + Ajouter une question
          </button>
        )}
      </div>
      <p className="text-sm text-muted">Les changements apparaissent tout de suite sur la page d&apos;accueil.</p>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}

      {editingId === "new" && form}

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : rows.length === 0 && editingId !== "new" ? (
        <p className="rounded-2xl border border-dashed border-border-soft bg-white p-8 text-center text-sm text-muted">
          Aucune question. La section FAQ est masquée sur le site.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) =>
            editingId === r.id ? (
              <li key={r.id}>{form}</li>
            ) : (
              <li key={r.id} className="rounded-2xl border border-border-soft bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-deep-green">{r.question}</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-[#444]">{r.answer}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <div className="flex gap-1">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded border border-border-soft px-2 text-xs disabled:opacity-30" aria-label="Monter">↑</button>
                      <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="rounded border border-border-soft px-2 text-xs disabled:opacity-30" aria-label="Descendre">↓</button>
                    </div>
                    <button onClick={() => startEdit(r)} className="rounded-full border border-border-soft px-3 py-1 text-xs font-semibold text-deep-green">✏️ Modifier</button>
                    <button onClick={() => remove(r)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600">🗑</button>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
