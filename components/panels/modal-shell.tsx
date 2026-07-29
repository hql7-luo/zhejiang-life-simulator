"use client";

import { motion } from "framer-motion";
import { CloseIcon } from "@/components/ui/icons";

export function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.section
        aria-modal="true"
        className="paper-card max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-sm sm:rounded-sm"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 28, opacity: 0 }}
        role="dialog"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-[#fbf8ef]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cinnabar">{eyebrow}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{title}</h2>
          </div>
          <button aria-label="关闭" className="rounded-full border border-ink/15 p-2 hover:bg-white" onClick={onClose}>
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        {children}
      </motion.section>
    </motion.div>
  );
}
