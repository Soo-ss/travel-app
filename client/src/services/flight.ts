import type {
  FlightBookingRequest,
  FlightBookingResponse,
  FlightSearchRequest,
  FlightSearchResponse,
} from "../types/flight";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function searchFlights(
  payload: FlightSearchRequest,
): Promise<FlightSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/flight/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("항공권 검색에 실패했습니다.");
  }

  return response.json();
}

export async function bookFlight(
  payload: FlightBookingRequest,
): Promise<FlightBookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/flight/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("항공권 예약에 실패했습니다.");
  }

  return response.json();
}
