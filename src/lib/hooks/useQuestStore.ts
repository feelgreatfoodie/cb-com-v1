import { create } from 'zustand';

export type QuestPhase = 'hero' | 'journey' | 'workshop' | 'bossfight' | 'complete';

interface RevealedStreams {
  data: boolean;
  sales: boolean;
  poker: boolean;
}

interface QuestState {
  phase: QuestPhase;
  scrollProgress: number;
  revealedStreams: RevealedStreams;
  equationRevealed: boolean;
  questStarted: boolean;
  setPhase: (phase: QuestPhase) => void;
  setScrollProgress: (progress: number) => void;
  revealStream: (stream: keyof RevealedStreams) => void;
  revealEquation: () => void;
  startQuest: () => void;
}

export const useQuestStore = create<QuestState>((set) => ({
  phase: 'hero',
  scrollProgress: 0,
  revealedStreams: { data: false, sales: false, poker: false },
  equationRevealed: false,
  questStarted: false,

  setPhase: (phase) => set({ phase }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  revealStream: (stream) =>
    set((state) => ({
      revealedStreams: { ...state.revealedStreams, [stream]: true },
    })),
  revealEquation: () => set({ equationRevealed: true }),
  startQuest: () => set({ questStarted: true }),
}));
