import { Router } from "express";
import { createChatCompletion } from "../services/openai";
import { buildTravelPrompt } from "../services/prompt";
import { logger } from "../utils/logger";

const router = Router();

type ScheduleType = "spot" | "food" | "hotel" | "move";

type ScheduleItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: ScheduleType;
};

type ItineraryRequest = {
  city?: CityCode;
  days?: number;
  companions?: string[];
  styles?: string[];
  pace?: string;
  durationLabel?: string;
};

type ItineraryResult = {
  city: string;
  days: number;
  route: Array<{ lat: number; lng: number }>;
  schedules: Record<number, ScheduleItem[]>;
};

type StructuredResult = ItineraryResult & {
  insight?: string;
};

type CityCode = "osaka" | "tokyo" | "fukuoka" | "sapporo";

const CITY_CENTER_BY_CODE: Record<CityCode, { lat: number; lng: number }> = {
  osaka: { lat: 34.6937, lng: 135.5023 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  fukuoka: { lat: 33.5902, lng: 130.4017 },
  sapporo: { lat: 43.0618, lng: 141.3545 },
};

const CITY_LABEL_BY_CODE: Record<CityCode, string> = {
  osaka: "오사카",
  tokyo: "도쿄",
  fukuoka: "후쿠오카",
  sapporo: "삿포로",
};

function extractJson(text: string): StructuredResult | null {
  const normalized = text.trim();
  const fenced = normalized.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : normalized;

  try {
    return JSON.parse(candidate) as StructuredResult;
  } catch {
    return null;
  }
}

function resolveCityCenter(cityCode: CityCode) {
  return CITY_CENTER_BY_CODE[cityCode];
}

function normalizeCityCode(city: unknown): CityCode {
  if (typeof city !== "string") return "osaka";
  if (city in CITY_CENTER_BY_CODE) return city as CityCode;
  return "osaka";
}

function fallbackItinerary(input: ItineraryRequest): ItineraryResult {
  const city = normalizeCityCode(input.city);
  const days = Math.max(1, Math.min(7, input.days || 3));
  const center = resolveCityCenter(city);
  const cityLabel = CITY_LABEL_BY_CODE[city];
  const route = Array.from({ length: days }, (_, idx) => ({
    lat: Number((center.lat + idx * 0.011).toFixed(6)),
    lng: Number((center.lng + idx * 0.011).toFixed(6)),
  }));

  const schedules: Record<number, ScheduleItem[]> = {};
  for (let day = 1; day <= days; day += 1) {
    schedules[day] = [
      {
        id: day * 10 + 1,
        title: `${cityLabel} 대표 관광지`,
        subtitle: "관광명소",
        description: `${day}일차 오전에 방문하기 좋은 핵심 관광 코스입니다.`,
        type: "spot",
      },
      {
        id: day * 10 + 2,
        title: `${cityLabel} 로컬 맛집`,
        subtitle: "식당",
        description: "현지에서 평이 좋은 식당을 점심 일정으로 추천합니다.",
        type: "food",
      },
      {
        id: day * 10 + 3,
        title: `${cityLabel} 숙소`,
        subtitle: "호텔",
        description:
          "이동 동선을 고려해 접근성이 좋은 숙소를 기준으로 선택했습니다.",
        type: "hotel",
      },
    ];
  }

  return { city, days, route, schedules };
}

router.post("/insight", async (req, res) => {
  try {
    const message = String(req.body?.message || "");
    const itinerary = (req.body?.itinerary || {}) as ItineraryRequest;

    const prompt = buildTravelPrompt({
      userMessage: message,
      travelContext: JSON.stringify(itinerary),
    });

    const completion = await createChatCompletion(prompt);
    const rawContent = completion.choices[0].message.content || "";
    const parsed = extractJson(rawContent);
    const safeItinerary = parsed || fallbackItinerary(itinerary);
    const cityLabel =
      CITY_LABEL_BY_CODE[safeItinerary.city as CityCode] ?? safeItinerary.city;
    const responseInsight =
      parsed?.insight ||
      `요청 조건 기준으로 ${cityLabel} ${safeItinerary.days}일 추천 일정을 만들었어요.`;

    logger.debug("Generated travel insight response", {
      city: safeItinerary.city,
      days: safeItinerary.days,
      parsed: Boolean(parsed),
    });

    res.json({
      insight: responseInsight,
      itinerary: safeItinerary,
    });
  } catch (error) {
    logger.error("Failed to handle /api/travel/insight request", error);
    const fallback = fallbackItinerary(req.body?.itinerary || {});
    res.status(200).json({
      insight: "AI 응답을 정리하는 중 문제가 있어 기본 추천 일정을 보여드려요.",
      itinerary: fallback,
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

export default router;
