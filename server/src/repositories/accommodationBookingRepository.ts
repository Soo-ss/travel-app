import type { AccommodationBookingRecord } from "../types/accommodation";
import { executeQuery } from "../db/postgres";

export async function saveAccommodationBooking(record: AccommodationBookingRecord) {
  await executeQuery(
    `
    INSERT INTO accommodation_bookings (
      booking_id,
      accommodation_id,
      guest_name,
      phone,
      check_in,
      check_out,
      guests,
      status,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      record.bookingId,
      record.accommodationId,
      record.guestName,
      record.phone,
      record.checkIn,
      record.checkOut,
      record.guests,
      record.status,
      record.createdAt,
    ],
  );
}

type AccommodationBookingRow = {
  booking_id: string;
  accommodation_id: string;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: "confirmed";
  created_at: string;
};

export async function listAccommodationBookings(): Promise<
  AccommodationBookingRecord[]
> {
  const rows = await executeQuery<AccommodationBookingRow[]>(
    `
    SELECT
      booking_id,
      accommodation_id,
      guest_name,
      phone,
      check_in,
      check_out,
      guests,
      status,
      created_at
    FROM accommodation_bookings
    ORDER BY created_at DESC
    LIMIT 200
    `,
  );

  return rows.map((row) => ({
    bookingId: row.booking_id,
    accommodationId: row.accommodation_id,
    guestName: row.guest_name,
    phone: row.phone,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    message: "숙소 예약이 확정되었습니다.",
  }));
}
