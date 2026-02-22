export type AccommodationSort = "recommended" | "price_low" | "rating";

export interface AccommodationSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  sort: AccommodationSort;
}

export interface AccommodationSummary {
  id: string;
  name: string;
  city: string;
  district: string;
  subtitle: string;
  tags: string[];
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  savedCount: number;
  priceKRW: number;
  thumbnailUrl: string;
}

export interface AccommodationSearchResponse {
  query: AccommodationSearchRequest;
  total: number;
  items: AccommodationSummary[];
}

export interface AccommodationDetail extends AccommodationSummary {
  description: string;
  amenities: string[];
  images: string[];
}

export interface AccommodationDetailResponse {
  item: AccommodationDetail;
}
