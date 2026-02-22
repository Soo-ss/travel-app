import type {
  AccommodationDetailResponse,
  AccommodationSearchRequest,
  AccommodationSearchResponse,
} from "../types/accommodation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function searchAccommodations(
  payload: AccommodationSearchRequest,
): Promise<AccommodationSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/accommodation/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("숙소 검색에 실패했습니다.");
  }

  return response.json();
}

export async function getAccommodationDetail(
  id: string,
): Promise<AccommodationDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/accommodation/${id}`);

  if (!response.ok) {
    throw new Error("숙소 상세 조회에 실패했습니다.");
  }

  return response.json();
}
