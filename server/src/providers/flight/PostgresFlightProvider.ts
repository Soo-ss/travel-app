import { randomUUID } from "node:crypto";
import { executeQuery } from "../../db/postgres";
import type {
  FlightBookingRequest,
  FlightBookingResponse,
  FlightOption,
  FlightSearchRequest,
  FlightSearchResponse,
} from "../../types/flight";
import type { FlightProvider } from "./FlightProvider";

type FlightOfferRow = {
  id: string;
  recommendation_tag: string | null;
  outbound_depart_time: string;
  outbound_arrive_time: string;
  outbound_airline: string;
  outbound_duration_text: string;
  inbound_depart_time: string;
  inbound_arrive_time: string;
  inbound_airline: string;
  inbound_duration_text: string;
  seats_left: number;
  price_krw: number;
};

function toFlightOption(
  row: FlightOfferRow,
  request: FlightSearchRequest,
): FlightOption {
  return {
    id: row.id,
    recommendationTag: row.recommendation_tag || undefined,
    outbound: {
      departTime: row.outbound_depart_time,
      arriveTime: row.outbound_arrive_time,
      routeLabel: `${request.origin}-${request.destination}`,
      airline: row.outbound_airline,
      durationText: row.outbound_duration_text,
    },
    inbound: {
      departTime: row.inbound_depart_time,
      arriveTime: row.inbound_arrive_time,
      routeLabel: `${request.destination}-${request.origin}`,
      airline: row.inbound_airline,
      durationText: row.inbound_duration_text,
    },
    seatsLeft: row.seats_left,
    priceKRW: row.price_krw,
  };
}

export class PostgresFlightProvider implements FlightProvider {
  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResponse> {
    const rows = await executeQuery<FlightOfferRow[]>(
      `
      SELECT
        id,
        recommendation_tag,
        outbound_depart_time,
        outbound_arrive_time,
        outbound_airline,
        outbound_duration_text,
        inbound_depart_time,
        inbound_arrive_time,
        inbound_airline,
        inbound_duration_text,
        seats_left,
        price_krw
      FROM flight_offers
      WHERE origin = $1
        AND destination = $2
        AND seat_class = $3
        AND is_active = TRUE
      ORDER BY price_krw ASC
      LIMIT 50
      `,
      [request.origin, request.destination, request.seatClass],
    );

    const options = rows.map((row) => toFlightOption(row, request));

    return {
      query: request,
      total: options.length,
      options,
    };
  }

  async bookFlight(request: FlightBookingRequest): Promise<FlightBookingResponse> {
    const bookingId = `BK-${randomUUID().slice(0, 8).toUpperCase()}`;

    return {
      bookingId,
      flightId: request.flightId,
      status: "confirmed",
      message: `${request.customerName}님의 예약이 확정되었습니다.`,
    };
  }
}
