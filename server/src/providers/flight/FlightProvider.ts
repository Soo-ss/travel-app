import type {
  FlightBookingRequest,
  FlightBookingResponse,
  FlightSearchRequest,
  FlightSearchResponse,
} from "../../types/flight";

export interface FlightProvider {
  searchFlights(request: FlightSearchRequest): Promise<FlightSearchResponse>;
  bookFlight(request: FlightBookingRequest): Promise<FlightBookingResponse>;
}
