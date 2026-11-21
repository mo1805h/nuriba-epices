"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
}

export default function Faq() {
  const [faqItems, setFaqItems] = useState<FaqRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("faq_items")
      .select("id,question,answer")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const rows = (data as FaqRow[]) ?? [];
        setFaqItems(rows);
        setOpenId(rows[0]?.id ?? null);
      });
  }, []);

  if (faqItems.length === 0) return null;

  return (
    <section className="bg-white px-5 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-light-green">
            Questions fréquentes
          </p>
          <h2 className="font-display text-3xl font-bold text-deep-green md:text-4xl">
            Vous avez des questions ?
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-border-soft"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between bg-cream px-5 py-4 text-left text-sm font-semibold text-deep-green"
                >
                  {item.question}
                  <span
                    className={`ml-3 text-gold transition-transform ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-sm leading-relaxed text-[#555]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
