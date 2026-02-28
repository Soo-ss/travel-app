import type { FlightBookingRecord } from "../types/flight";
import { executeQuery } from "../db/postgres";

export async function saveBooking(record: FlightBookingRecord) {
  await executeQuery(
    `
    INSERT INTO flight_bookings (
      booking_id,
      flight_id,
      customer_name,
      phone,
      status,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      record.bookingId,
      record.flightId,
      record.customerName,
      record.phone,
      record.status,
      record.createdAt,
    ],
  );
}

type FlightBookingRow = {
  booking_id: string;
  flight_id: string;
  customer_name: string;
  phone: string;
  status: "confirmed";
  created_at: string;
};

export async function listBookings(): Promise<FlightBookingRecord[]> {
  const rows = await executeQuery<FlightBookingRow[]>(
    `
    SELECT
      booking_id,
      flight_id,
      customer_name,
      phone,
      status,
      created_at
    FROM flight_bookings
    ORDER BY created_at DESC
    LIMIT 200
    `,
  );

  return rows.map((row) => ({
    bookingId: row.booking_id,
    flightId: row.flight_id,
    customerName: row.customer_name,
    phone: row.phone,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    message: "예약이 확정되었습니다.",
  }));
}
