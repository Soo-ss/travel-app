import { randomUUID } from "node:crypto";
import { executeQuery } from "../../db/postgres";
import type {
  AccommodationBookingRequest,
  AccommodationBookingResponse,
  AccommodationDetail,
  AccommodationDetailResponse,
  AccommodationPopularCitiesResponse,
  AccommodationSearchRequest,
  AccommodationSearchResponse,
  AccommodationSummary,
} from "../../types/accommodation";
import type { AccommodationProvider } from "./AccommodationProvider";

type AccommodationRow = {
  id: string;
  name: string;
  city: string;
  district: string;
  subtitle: string;
  tags_json: string;
  star_rating: number;
  review_score: number;
  review_count: number;
  saved_count: number;
  price_krw: number;
  thumbnail_url: string;
  description: string;
  amenities_json: string;
  images_json: string;
};

function parseArray(jsonText: string): string[] {
  try {
    const value = JSON.parse(jsonText);
    return Array.isArray(value) ? value.map(String) : [];
  } catch {
    return [];
  }
}

function toSummary(row: AccommodationRow): AccommodationSummary {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    district: row.district,
    subtitle: row.subtitle,
    tags: parseArray(row.tags_json),
    starRating: row.star_rating,
    reviewScore: Number(row.review_score),
    reviewCount: row.review_count,
    savedCount: row.saved_count,
    priceKRW: row.price_krw,
    thumbnailUrl: row.thumbnail_url,
  };
}

function toDetail(row: AccommodationRow): AccommodationDetail {
  return {
    ...toSummary(row),
    description: row.description,
    amenities: parseArray(row.amenities_json),
    images: parseArray(row.images_json),
  };
}

function resolveSort(sort: AccommodationSearchRequest["sort"]) {
  if (sort === "price_low") return "price_krw ASC";
  if (sort === "rating") return "review_score DESC, review_count DESC";
  return "saved_count DESC, review_score DESC";
}

export class PostgresAccommodationProvider implements AccommodationProvider {
  async getPopularCities(): Promise<AccommodationPopularCitiesResponse> {
    const rows = await executeQuery<Array<{ city: string }>>(
      `
      SELECT city
      FROM accommodations
      WHERE is_active = TRUE
      GROUP BY city
      ORDER BY COUNT(*) DESC, city ASC
      LIMIT 20
      `,
    );

    return {
      cities: rows.map((row) => row.city),
    };
  }

  async searchAccommodations(
    request: AccommodationSearchRequest,
  ): Promise<AccommodationSearchResponse> {
    const sortSql = resolveSort(request.sort);
    const rows = await executeQuery<AccommodationRow[]>(
      `
      SELECT
        id,
        name,
        city,
        district,
        subtitle,
        tags_json,
        star_rating,
        review_score,
        review_count,
        saved_count,
        price_krw,
        thumbnail_url,
        description,
        amenities_json,
        images_json
      FROM accommodations
      WHERE is_active = TRUE
        AND (city ILIKE '%' || $1 || '%' OR district ILIKE '%' || $1 || '%')
      ORDER BY ${sortSql}
      LIMIT 100
      `,
      [request.destination],
    );

    const items = rows.map(toSummary);

    return {
      query: request,
      total: items.length,
      items,
    };
  }

  async getAccommodationDetail(id: string): Promise<AccommodationDetailResponse> {
    const rows = await executeQuery<AccommodationRow[]>(
      `
      SELECT
        id,
        name,
        city,
        district,
        subtitle,
        tags_json,
        star_rating,
        review_score,
        review_count,
        saved_count,
        price_krw,
        thumbnail_url,
        description,
        amenities_json,
        images_json
      FROM accommodations
      WHERE id = $1 AND is_active = TRUE
      LIMIT 1
      `,
      [id],
    );

    if (rows.length === 0) {
      throw new Error("Accommodation not found.");
    }

    return {
      item: toDetail(rows[0]),
    };
  }

  async bookAccommodation(
    request: AccommodationBookingRequest,
  ): Promise<AccommodationBookingResponse> {
    const bookingId = `AB-${randomUUID().slice(0, 8).toUpperCase()}`;

    return {
      bookingId,
      accommodationId: request.accommodationId,
      status: "confirmed",
      message: `${request.guestName}님의 숙소 예약이 확정되었습니다.`,
    };
  }
}
