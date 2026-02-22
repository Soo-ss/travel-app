import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { askTravelAI } from "./services/ai";
import Home from "./pages/Home";
import AiRecommend from "./pages/AiRecommend";
import AiResult from "./pages/AiResult";
import FlightSelect from "./pages/FlightSelect";
import FlightResult from "./pages/FlightResult";
import AccommodationMain from "./pages/AccommodationMain";
import AccommodationWorldSelect from "./pages/AccommodationWorldSelect";
import AccommodationDateSelect from "./pages/AccommodationDateSelect";
import AccommodationSelect from "./pages/AccommodationSelect";
import AccommodationDetail from "./pages/AccommodationDetail";
import { useAiStore } from "./stores/useAiStore";
import type { ItineraryPayload } from "./types/travel";

const ROUTES = {
  home: "/",
  accommodationMain: "/accommodation/main",
  accommodationWorldSelect: "/accommodation/world-select",
  accommodationDateSelect: "/accommodation/date-select",
  accommodationSelect: "/accommodation/select",
  accommodationDetail: "/accommodation/detail/:id",
  flightSelect: "/flight/select",
  flightResult: "/flight/result",
  recommend: "/ai/recommend",
  result: "/ai/result",
} as const;

const CITY_LABEL: Record<string, string> = {
  osaka: "오사카",
  tokyo: "도쿄",
  fukuoka: "후쿠오카",
  sapporo: "삿포로",
};

export default function App() {
  const navigate = useNavigate();
  const {
    setPromptData,
    setLoading,
    setResult,
    setError,
    status,
    errorMessage,
  } = useAiStore();

  const buildPromptMessage = (payload: ItineraryPayload): string =>
    [
      `${CITY_LABEL[payload.city] ?? payload.city} ${payload.durationLabel} 일정 추천 부탁해.`,
      `동행: ${payload.companions.join(", ") || "미정"}`,
      `스타일: ${payload.styles.join(", ") || "균형"}`,
      `일정 성향: ${payload.pace}`,
    ].join("\n");

  const handleSubmitRecommend = async (payload: ItineraryPayload) => {
    setPromptData(payload);
    setLoading();
    try {
      const response = await askTravelAI({
        message: buildPromptMessage(payload),
        itinerary: payload,
      });
      console.log(response);
      setResult(response);
      navigate(ROUTES.result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "추천 일정을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.";
      setError(message);
    }
  };

  return (
    <Routes>
      <Route
        path={ROUTES.home}
        element={
          <Home
            onStartRecommend={() => {
              navigate(ROUTES.recommend);
            }}
          />
        }
      />
      <Route
        path={ROUTES.accommodationMain}
        element={<AccommodationMain />}
      />
      <Route
        path={ROUTES.accommodationWorldSelect}
        element={<AccommodationWorldSelect />}
      />
      <Route
        path={ROUTES.accommodationDateSelect}
        element={<AccommodationDateSelect />}
      />
      <Route
        path={ROUTES.accommodationSelect}
        element={<AccommodationSelect />}
      />
      <Route
        path={ROUTES.accommodationDetail}
        element={<AccommodationDetail />}
      />
      <Route
        path={ROUTES.flightSelect}
        element={<FlightSelect />}
      />
      <Route
        path={ROUTES.flightResult}
        element={<FlightResult />}
      />
      <Route
        path={ROUTES.recommend}
        element={
          <AiRecommend
            isLoading={status === "loading"}
            errorMessage={errorMessage}
            onBack={() => {
              navigate(ROUTES.home);
            }}
            onSubmit={handleSubmitRecommend}
          />
        }
      />
      <Route
        path={ROUTES.result}
        element={
          <AiResult
            onBack={() => {
              navigate(ROUTES.home);
            }}
            onRetry={() => {
              navigate(ROUTES.recommend);
            }}
          />
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
