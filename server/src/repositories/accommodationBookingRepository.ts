import type { AccommodationBookingRecord } from "../types/accommodation";

const bookingStore: AccommodationBookingRecord[] = [];

export function saveAccommodationBooking(record: AccommodationBookingRecord) {
  bookingStore.push(record);
}

export function listAccommodationBookings() {
  return [...bookingStore];
}
