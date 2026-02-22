import type {
  AccommodationBookingRequest,
  AccommodationBookingResponse,
  AccommodationDetailResponse,
  AccommodationPopularCitiesResponse,
  AccommodationSearchRequest,
  AccommodationSearchResponse,
} from "../../types/accommodation";

export interface AccommodationProvider {
  getPopularCities(): Promise<AccommodationPopularCitiesResponse>;
  searchAccommodations(
    request: AccommodationSearchRequest,
  ): Promise<AccommodationSearchResponse>;
  getAccommodationDetail(id: string): Promise<AccommodationDetailResponse>;
  bookAccommodation(
    request: AccommodationBookingRequest,
  ): Promise<AccommodationBookingResponse>;
}
