import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateHtpb } from "./generate-htpb";
import { generateLarsen } from "./generate-larsen";
import type { GenRequest, LarsenExercise, Session } from "./types";

interface AppState {
  request: GenRequest;
  session: Session | null;
  history: Session[];
  serial: number;
  setRequest: (patch: Partial<GenRequest>) => void;
  generate: () => Session;
  load: (s: Session) => void;
  clearSession: () => void;
}

const defaultRequest: GenRequest = {
  method: "HTPB10",
  difficulty: 1,
  key: "auto",
  exercise: "auto",
  durationMin: null,
};

export const DEFAULT_SESSION: Session = generateHtpb({
  difficulty: 1,
  key: "Bb",
  durationMin: 12,
  serial: 1,
  seed: 20260916,
  recentKeys: [],
});

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      request: defaultRequest,
      session: DEFAULT_SESSION,
      history: [DEFAULT_SESSION],
      serial: 2,
      setRequest: (patch) =>
        set((s) => ({ request: { ...s.request, ...patch } })),
      generate: () => {
        const { request, serial, history } = get();
        const seed = (Date.now() ^ (serial * 9973)) >>> 0;
        const recentKeys = history.slice(0, 4).map((h) => h.destKey);
        const lastLarsen = history.find((h) => h.kind === "Larsen") as
          | Extract<Session, { kind: "Larsen" }>
          | undefined;
        const lastEx = lastLarsen?.exercises[0]?.number as LarsenExercise | undefined;
        const session =
          request.method === "HTPB10"
            ? generateHtpb({
                difficulty: request.difficulty,
                key: request.key,
                durationMin: request.durationMin,
                serial,
                seed,
                recentKeys,
              })
            : generateLarsen({
                difficulty: request.difficulty,
                key: request.key,
                exercise: request.exercise,
                durationMin: request.durationMin,
                serial,
                seed,
                recentKeys,
                lastExercise: lastEx,
              });
        set({
          session,
          serial: serial + 1,
          history: [session, ...history].slice(0, 16),
        });
        return session;
      },
      load: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "seance-atelier",
      partialize: (s) => ({
        request: s.request,
        session: s.session,
        history: s.history,
        serial: s.serial,
      }),
    },
  ),
);

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const done = () => setHydrated(true);
    if (useApp.persist.hasHydrated()) done();
    const unsub = useApp.persist.onFinishHydration(done);
    return unsub;
  }, []);
  return hydrated;
}
