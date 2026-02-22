import { getAccommodationProvider } from "../providers/accommodation";
import {
  saveAccommodationBooking,
} from "../repositories/accommodationBookingRepository";
import type {
  AccommodationBookingRecord,
  AccommodationBookingRequest,
  AccommodationSearchRequest,
} from "../types/accommodation";

function toSearchRequest(
  payload: Partial<AccommodationSearchRequest>,
): AccommodationSearchRequest {
  return {
    destination: payload.destination || "오사카",
    checkIn: payload.checkIn || "2026-02-28",
    checkOut: payload.checkOut || "2026-03-01",
    guests: Math.max(1, Number(payload.guests || 2)),
    sort: payload.sort || "recommended",
  };
}

function toBookingRequest(
  payload: Partial<AccommodationBookingRequest>,
): AccommodationBookingRequest {
  if (!payload.accommodationId) {
    throw new Error("accommodationId is required.");
  }

  return {
    accommodationId: payload.accommodationId,
    guestName: payload.guestName || "고객",
    phone: payload.phone || "010-0000-0000",
    checkIn: payload.checkIn || "2026-02-28",
    checkOut: payload.checkOut || "2026-03-01",
    guests: Math.max(1, Number(payload.guests || 2)),
  };
}

export async function getPopularCities() {
  const provider = getAccommodationProvider();
  return provider.getPopularCities();
}

export async function searchAccommodations(
  payload: Partial<AccommodationSearchRequest>,
) {
  const provider = getAccommodationProvider();
  const request = toSearchRequest(payload);
  return provider.searchAccommodations(request);
}

export async function getAccommodationDetail(id: string) {
  const provider = getAccommodationProvider();
  if (!id) throw new Error("id is required.");
  return provider.getAccommodationDetail(id);
}

export async function bookAccommodation(
  payload: Partial<AccommodationBookingRequest>,
) {
  const provider = getAccommodationProvider();
  const request = toBookingRequest(payload);
  const booking = await provider.bookAccommodation(request);

  const record: AccommodationBookingRecord = {
    ...booking,
    guestName: request.guestName,
    phone: request.phone,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    guests: request.guests,
    createdAt: new Date().toISOString(),
  };
  saveAccommodationBooking(record);

  return booking;
}
