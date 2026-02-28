import { saveBooking } from "../repositories/flightBookingRepository";
import { getFlightProvider } from "../providers/flight";
import type {
  FlightBookingRecord,
  FlightBookingRequest,
  FlightSearchRequest,
} from "../types/flight";

function toSearchRequest(payload: Partial<FlightSearchRequest>): FlightSearchRequest {
  return {
    origin: payload.origin || "PUS",
    destination: payload.destination || "OSA",
    departDate: payload.departDate || "2026-03-18",
    returnDate: payload.returnDate || "2026-03-21",
    passengers: Math.max(1, Number(payload.passengers || 2)),
    seatClass: payload.seatClass || "economy",
  };
}

function toBookingRequest(payload: Partial<FlightBookingRequest>): FlightBookingRequest {
  if (!payload.flightId) {
    throw new Error("flightId is required.");
  }

  return {
    flightId: payload.flightId,
    customerName: payload.customerName || "고객",
    phone: payload.phone || "010-0000-0000",
  };
}

export async function searchFlights(payload: Partial<FlightSearchRequest>) {
  const provider = getFlightProvider();
  const query = toSearchRequest(payload);
  return provider.searchFlights(query);
}

export async function bookFlight(payload: Partial<FlightBookingRequest>) {
  const provider = getFlightProvider();
  const request = toBookingRequest(payload);
  const booking = await provider.bookFlight(request);

  const record: FlightBookingRecord = {
    ...booking,
    customerName: request.customerName,
    phone: request.phone,
    createdAt: new Date().toISOString(),
  };
  await saveBooking(record);

  return booking;
}
