import { useMemo, useState } from "react";
import styles from "./AiResult.module.scss";
import sampleImage from "../../assets/sapporo.jpg";
import { useAiStore } from "../../stores/useAiStore";
import type { ScheduleType } from "../../types/travel";

interface Props {
  onBack?: () => void;
  onRetry?: () => void;
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
  const { city, days, insight, schedules } = useAiStore();
  const [currentDay, setCurrentDay] = useState(1);

  const dayCount = days || Object.keys(schedules).length || 1;
  const cityLabel = CITY_LABEL[city] ?? city ?? "추천 도시";
  const dayTabs = Array.from({ length: dayCount }, (_, index) => index + 1);
  const plans = useMemo(() => schedules[currentDay] || [], [currentDay, schedules]);

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
          <p>{insight || "트리플이 알려준 맞춤일정으로 여행을 떠나보세요."}</p>
        </section>

        <section className={styles.mapArea} aria-label="여행 동선 지도">
          <div className={styles.mapLabel}>Google</div>
          <span className={`${styles.pin} ${styles.pinOne}`}>1</span>
          <span className={`${styles.pin} ${styles.pinTwo}`}>2</span>
        </section>

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
                <span className={`${styles.badge} ${styles[toBadgeColor(item.type)]}`}>
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
            추천받은 일정을 내 일정으로 담으면 언제든 확인하고 편집할 수
            있어요!
          </p>
        </section>

        <footer className={styles.bottomArea}>
          <button type="button" className={styles.primaryButton}>
            ⤓ 내 일정으로 담기
          </button>
          <div className={styles.secondaryRow}>
            <button type="button" className={styles.secondaryButton} onClick={onRetry}>
              ↻ 새로운 추천받기
            </button>
            <button type="button" className={styles.secondaryButton} onClick={onBack}>
              ⌂ 다시하기
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
