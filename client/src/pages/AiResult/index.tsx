import { useMemo, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  useJsApiLoader,
} from "@react-google-maps/api";
import styles from "./AiResult.module.scss";
import sampleImage from "../../assets/sapporo.jpg";
import { useAiStore } from "../../stores/useAiStore";
import type { LatLng, ScheduleType } from "../../types/travel";

interface Props {
  onBack?: () => void;
  onRetry?: () => void;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;
const DEFAULT_ROUTE = [{ lat: 34.6937, lng: 135.5023 }];
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" } as const;

function GoogleRouteMap({ route }: { route: LatLng[] }) {
  const points = route.length > 0 ? route : DEFAULT_ROUTE;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? "",
  });

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={styles.mapArea}>
        <div className={styles.mapFallback}>
          VITE_GOOGLE_MAPS_API_KEY를 설정해 주세요.
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.mapArea}>
        <div className={styles.mapFallback}>
          구글 지도를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapArea}>
      {!isLoaded ? (
        <div className={styles.mapFallback}>지도를 불러오는 중...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={points[0]}
          zoom={11}
          options={{
            disableDefaultUI: true,
            gestureHandling: "greedy",
            clickableIcons: false,
          }}
        >
          {points.map((point, index) => (
            <MarkerF
              key={`${point.lat}-${point.lng}-${index}`}
              position={point}
              label={String(index + 1)}
            />
          ))}
          {points.length > 1 ? (
            <PolylineF
              path={points}
              options={{
                strokeColor: "#6D7DFE",
                strokeOpacity: 0.9,
                strokeWeight: 3,
              }}
            />
          ) : null}
        </GoogleMap>
      )}
    </div>
  );
}

const CITY_LABEL: Record<string, string> = {
  osaka: "오사카",
  tokyo: "도쿄",
  fukuoka: "후쿠오카",
  sapporo: "삿포로",
};

function toBadgeColor(type: ScheduleType): "purple" | "pink" | "mint" {
  if (type === "food") return "pink";
  if (type === "hotel" || type === "move") return "mint";
  return "purple";
}

export default function AiResult({ onBack, onRetry }: Props) {
  const { city, days, insight, schedules, route } = useAiStore();
  const [currentDay, setCurrentDay] = useState(1);

  const dayCount = days || Object.keys(schedules).length || 1;
  const cityLabel = CITY_LABEL[city] ?? city ?? "추천 도시";
  const dayTabs = Array.from({ length: dayCount }, (_, index) => index + 1);
  const plans = useMemo(
    () => schedules[currentDay] || [],
    [currentDay, schedules],
  );

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="이전으로"
            onClick={onBack}
          >
            ×
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="공유하기"
          >
            ↗
          </button>
        </header>

        <section className={styles.titleArea}>
          <h1>
            {cityLabel}, {Math.max(dayCount - 1, 0)}박 {dayCount}일{" "}
            <span>추천일정</span>입니다.
          </h1>
          <p>
            {insight || "LIFESHORT이 알려준 맞춤일정으로 여행을 떠나보세요."}
          </p>
        </section>

        <GoogleRouteMap route={route} />

        <nav className={styles.dayTabs} aria-label="일정 탭">
          {dayTabs.map((day) => (
            <button
              key={day}
              type="button"
              className={day === currentDay ? styles.activeTab : styles.tab}
              onClick={() => setCurrentDay(day)}
            >
              Day {day}
            </button>
          ))}
        </nav>

        <section className={styles.timeline}>
          {plans.length === 0 ? (
            <div className={styles.emptyBox}>해당 일차 일정이 아직 없어요.</div>
          ) : (
            plans.map((item) => (
              <article key={item.id} className={styles.timelineRow}>
                <span
                  className={`${styles.badge} ${styles[toBadgeColor(item.type)]}`}
                >
                  {item.id}
                </span>
                <div className={styles.card}>
                  <img src={sampleImage} alt={item.title} />
                  <div className={styles.cardBody}>
                    <h2>{item.title}</h2>
                    <p className={styles.meta}>{item.subtitle}</p>
                    <hr />
                    <p className={styles.desc}>
                      <strong>추천</strong> {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <section className={styles.feedback}>
          <p className={styles.emoji}>💖</p>
          <h3>추천일정이 마음에 드세요?</h3>
          <p>
            추천받은 일정을 내 일정으로 담으면 언제든 확인하고 편집할 수 있어요!
          </p>
        </section>

        <footer className={styles.bottomArea}>
          <button type="button" className={styles.primaryButton}>
            ⤓ 내 일정으로 담기
          </button>
          <div className={styles.secondaryRow}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onRetry}
            >
              ↻ 새로운 추천받기
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onBack}
            >
              ⌂ 다시하기
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
