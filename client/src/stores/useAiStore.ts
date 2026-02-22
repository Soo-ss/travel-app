import { create } from "zustand";
import type {
  ItineraryPayload,
  LatLng,
  ScheduleItem,
  TravelInsightResponse,
} from "../types/travel";

type RequestStatus = "idle" | "loading" | "success" | "error";

interface AiState {
  city: string;
  days: number;
  currentDay: number;
  insight: string;
  route: LatLng[];
  schedules: Record<number, ScheduleItem[]>;
  promptData: ItineraryPayload | null;
  status: RequestStatus;
  errorMessage: string | null;

  setCurrentDay: (day: number) => void;
  setPromptData: (payload: ItineraryPayload) => void;
  setLoading: () => void;
  setResult: (payload: TravelInsightResponse) => void;
  setError: (message: string) => void;
  setSchedules: (data: Record<number, ScheduleItem[]>) => void;
  reset: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  city: "",
  days: 0,
  currentDay: 1,
  insight: "",
  route: [],
  schedules: {},
  promptData: null,
  status: "idle",
  errorMessage: null,

  setCurrentDay: (day) => set({ currentDay: day }),

  setPromptData: (payload) => set({ promptData: payload, errorMessage: null }),

  setLoading: () => set({ status: "loading", errorMessage: null }),

  setResult: (payload) =>
    set({
      city: payload.itinerary.city,
      days: payload.itinerary.days,
      insight: payload.insight,
      route: payload.itinerary.route,
      schedules: payload.itinerary.schedules,
      currentDay: 1,
      status: "success",
      errorMessage: null,
    }),

  setError: (message) => set({ status: "error", errorMessage: message }),

  setSchedules: (data) => set({ schedules: data }),

  reset: () =>
    set({
      city: "",
      days: 0,
      currentDay: 1,
      insight: "",
      route: [],
      schedules: {},
      promptData: null,
      status: "idle",
      errorMessage: null,
    }),
}));
