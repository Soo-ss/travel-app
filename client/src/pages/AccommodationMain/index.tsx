import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AccommodationMain.module.scss";

function formatDateLabel(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "2.28~3.1";
  return `${checkIn.slice(5).replace("-", ".")}~${checkOut
    .slice(5)
    .replace("-", ".")}`;
}

export default function AccommodationMain() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const destination = params.get("destination") || "오사카";
  const checkIn = params.get("checkIn") || "2026-02-28";
  const checkOut = params.get("checkOut") || "2026-03-01";
  const guests = params.get("guests") || "2";

  const searchSummary = useMemo(
    () => `${destination}, ${formatDateLabel(checkIn, checkOut)}, ${guests}인`,
    [checkIn, checkOut, destination, guests],
  );

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ←
          </button>
          <button type="button">☰</button>
        </header>

        <h1 className={styles.title}>
          호텔부터 펜션까지
          <br />
          최저가 숙소 예약
        </h1>

        <section className={styles.searchArea}>
          <button
            type="button"
            className={styles.summaryButton}
            onClick={() =>
              navigate(
                `/accommodation/world-select?destination=${encodeURIComponent(
                  destination,
                )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
              )
            }
          >
            {searchSummary}
          </button>
          <button
            type="button"
            className={styles.iconSquare}
            onClick={() =>
              navigate(
                `/accommodation/world-select?destination=${encodeURIComponent(
                  destination,
                )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
              )
            }
          >
            ▦
          </button>
        </section>

        <button
          type="button"
          className={styles.dateButton}
          onClick={() =>
            navigate(
              `/accommodation/date-select?destination=${encodeURIComponent(
                destination,
              )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
            )
          }
        >
          일정 선택
        </button>

        <button
          type="button"
          className={styles.searchButton}
          onClick={() =>
            navigate(
              `/accommodation/select?destination=${encodeURIComponent(
                destination,
              )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
            )
          }
        >
          숙소 검색
        </button>

        <section className={styles.banner}>
          <p>#얼리버드혜택 #최대8%할인</p>
          <h2>유럽 여행 특가 숙소 모음</h2>
        </section>

        <section className={styles.chips}>
          {["서울", "제주", "부산", "강릉", "오사카", "후쿠오카", "다낭"].map(
            (city) => (
              <button key={city} type="button">
                {city}
              </button>
            ),
          )}
        </section>
      </div>
    </div>
  );
}
