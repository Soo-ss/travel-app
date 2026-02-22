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

const MOCK_HOTELS: AccommodationDetail[] = [
  {
    id: "acc-1001",
    name: "소테츠 그랜드 프레사 오사카 - 난바",
    city: "오사카",
    district: "난바",
    subtitle: "전 객실 시즌스 침대와 공기청정기가 비치된 도톤보리 인근 호텔",
    tags: ["트리플 BEST", "도심 접근성"],
    starRating: 3,
    reviewScore: 4.1,
    reviewCount: 665,
    savedCount: 15357,
    priceKRW: 104859,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    description:
      "난바역과 가까워 쇼핑과 이동이 편리한 비즈니스 호텔입니다. 합리적인 가격과 깔끔한 객실 컨디션으로 꾸준히 선택받고 있습니다.",
    amenities: ["무료 Wi-Fi", "24시간 프런트", "수하물 보관", "세탁 서비스"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    ],
  },
  {
    id: "acc-1002",
    name: "아고 호텔 오사카 신사이바시",
    city: "오사카",
    district: "신사이바시",
    subtitle: "위치 좋고 가성비 좋은 비즈니스 호텔",
    tags: ["트리플 BEST", "가성비"],
    starRating: 3,
    reviewScore: 4.0,
    reviewCount: 96,
    savedCount: 7288,
    priceKRW: 97836,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description:
      "신사이바시 중심지에서 가깝고 대중교통 접근성이 우수합니다. 짧은 일정의 자유여행에 적합합니다.",
    amenities: ["무료 Wi-Fi", "금연 객실", "에어컨", "객실 정비"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    ],
  },
];

function toSummary(item: AccommodationDetail): AccommodationSummary {
  return {
    id: item.id,
    name: item.name,
    city: item.city,
    district: item.district,
    subtitle: item.subtitle,
    tags: item.tags,
    starRating: item.starRating,
    reviewScore: item.reviewScore,
    reviewCount: item.reviewCount,
    savedCount: item.savedCount,
    priceKRW: item.priceKRW,
    thumbnailUrl: item.thumbnailUrl,
  };
}

export class MockAccommodationProvider implements AccommodationProvider {
  async getPopularCities(): Promise<AccommodationPopularCitiesResponse> {
    return {
      cities: ["오사카", "후쿠오카", "도쿄", "제주", "다낭", "나트랑", "홍콩"],
    };
  }

  async searchAccommodations(
    request: AccommodationSearchRequest,
  ): Promise<AccommodationSearchResponse> {
    const filtered = MOCK_HOTELS.filter((item) =>
      item.city.includes(request.destination),
    );

    return {
      query: request,
      total: filtered.length,
      items: filtered.map(toSummary),
    };
  }

  async getAccommodationDetail(id: string): Promise<AccommodationDetailResponse> {
    const item = MOCK_HOTELS.find((hotel) => hotel.id === id) || MOCK_HOTELS[0];
    return { item };
  }

  async bookAccommodation(
    request: AccommodationBookingRequest,
  ): Promise<AccommodationBookingResponse> {
    return {
      bookingId: `AB-${Date.now().toString().slice(-8)}`,
      accommodationId: request.accommodationId,
      status: "confirmed",
      message: `${request.guestName}님의 숙소 예약이 확정되었습니다.`,
    };
  }
}
