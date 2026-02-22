export type AirportCode = "PUS" | "OSA" | "SEL" | "TYO" | "FUK";

export interface FlightSearchRequest {
  origin: AirportCode;
  destination: AirportCode;
  departDate: string;
  returnDate: string;
  passengers: number;
  seatClass: "economy" | "business";
}

export interface FlightLeg {
  departTime: string;
  arriveTime: string;
  routeLabel: string;
  airline: string;
  durationText: string;
}

export interface FlightOption {
  id: string;
  recommendationTag?: string;
  outbound: FlightLeg;
  inbound: FlightLeg;
  seatsLeft: number;
  priceKRW: number;
}

export interface FlightSearchResponse {
  query: FlightSearchRequest;
  total: number;
  options: FlightOption[];
}

export interface FlightBookingRequest {
  flightId: string;
  customerName: string;
  phone: string;
}

export interface FlightBookingResponse {
  bookingId: string;
  flightId: string;
  status: "confirmed";
  message: string;
}

export interface FlightBookingRecord extends FlightBookingResponse {
  customerName: string;
  phone: string;
  createdAt: string;
}
