import type {
  FlightBookingRequest,
  FlightBookingResponse,
  FlightOption,
  FlightSearchRequest,
  FlightSearchResponse,
} from "../../types/flight";
import type { FlightProvider } from "./FlightProvider";

function createMockOptions(request: FlightSearchRequest): FlightOption[] {
  return [
    {
      id: "F-1001",
      recommendationTag: "최저가 추천",
      outbound: {
        departTime: "14:20",
        arriveTime: "15:50",
        routeLabel: `${request.origin}-${request.destination}`,
        airline: "이스타항공",
        durationText: "1시간 30분",
      },
      inbound: {
        departTime: "17:00",
        arriveTime: "18:30",
        routeLabel: `${request.destination}-${request.origin}`,
        airline: "이스타항공",
        durationText: "1시간 30분",
      },
      seatsLeft: 2,
      priceKRW: 227600,
    },
    {
      id: "F-1002",
      outbound: {
        departTime: "14:05",
        arriveTime: "15:35",
        routeLabel: `${request.origin}-${request.destination}`,
        airline: "티웨이항공",
        durationText: "1시간 30분",
      },
      inbound: {
        departTime: "16:35",
        arriveTime: "18:10",
        routeLabel: `${request.destination}-${request.origin}`,
        airline: "티웨이항공",
        durationText: "1시간 35분",
      },
      seatsLeft: 9,
      priceKRW: 249000,
    },
    {
      id: "F-1003",
      outbound: {
        departTime: "10:10",
        arriveTime: "11:40",
        routeLabel: `${request.origin}-${request.destination}`,
        airline: "제주항공",
        durationText: "1시간 30분",
      },
      inbound: {
        departTime: "20:05",
        arriveTime: "21:35",
        routeLabel: `${request.destination}-${request.origin}`,
        airline: "제주항공",
        durationText: "1시간 30분",
      },
      seatsLeft: 4,
      priceKRW: 264800,
    },
  ];
}

export class MockFlightProvider implements FlightProvider {
  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResponse> {
    const options = createMockOptions(request);
    return {
      query: request,
      total: options.length,
      options,
    };
  }

  async bookFlight(request: FlightBookingRequest): Promise<FlightBookingResponse> {
    return {
      bookingId: `BK-${Date.now().toString().slice(-8)}`,
      flightId: request.flightId,
      status: "confirmed",
      message: `${request.customerName || "고객"}님의 예약이 확정되었습니다.`,
    };
  }
}
