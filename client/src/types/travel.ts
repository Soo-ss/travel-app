export interface LatLng {
  lat: number;
  lng: number;
}

export type ScheduleType = "spot" | "food" | "hotel" | "move";

export interface ScheduleItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: ScheduleType;
}

export interface ItineraryPayload {
  city: string;
  days: number;
  companions: string[];
  styles: string[];
  pace: string;
  durationLabel: string;
}

export interface TravelInsightRequest {
  message: string;
  itinerary: ItineraryPayload;
}

export interface TravelInsightResult {
  city: string;
  days: number;
  route: LatLng[];
  schedules: Record<number, ScheduleItem[]>;
}

export interface TravelInsightResponse {
  insight: string;
  itinerary: TravelInsightResult;
}
