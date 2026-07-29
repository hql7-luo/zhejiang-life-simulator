"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArchivePanel } from "@/components/panels/archive-panel";
import { SettingsPanel } from "@/components/panels/settings-panel";
import { BirthSetup } from "@/components/screens/birth-setup";
import { GameScreen } from "@/components/screens/game-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { ReportScreen } from "@/components/screens/report-screen";
import { useGameStore } from "@/store/game-store";

export function LifeSimulator() {
  const status = useGameStore((state) => state.status);
  const [mounted, setMounted] = useState(false);
  const [panel, setPanel] = useState<"archive" | "settings" | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="stamp h-16 w-16 animate-pulse text-lg">人生</div>
      </main>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
        >
          {status === "home" && <HomeScreen onArchive={() => setPanel("archive")} onSettings={() => setPanel("settings")} />}
          {status === "setup" && <BirthSetup />}
          {status === "playing" && <GameScreen onArchive={() => setPanel("archive")} onSettings={() => setPanel("settings")} />}
          {status === "ended" && <ReportScreen onArchive={() => setPanel("archive")} />}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {panel === "archive" && <ArchivePanel onClose={() => setPanel(null)} />}
        {panel === "settings" && <SettingsPanel onClose={() => setPanel(null)} />}
      </AnimatePresence>
    </>
  );
}
