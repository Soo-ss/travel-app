import type { FlightBookingRecord } from "../types/flight";

const bookingStore: FlightBookingRecord[] = [];

export function saveBooking(record: FlightBookingRecord) {
  bookingStore.push(record);
}

export function listBookings() {
  return [...bookingStore];
}
