import type {
  TravelInsightRequest,
  TravelInsightResponse,
} from "../types/travel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function askTravelAI(
  payload: TravelInsightRequest,
): Promise<TravelInsightResponse> {
  const res = await fetch(`${API_BASE_URL}/api/travel/insight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "AI request failed");
  }

  return res.json();
}
