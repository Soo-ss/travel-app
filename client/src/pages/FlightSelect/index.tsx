import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FlightSelect.module.scss";
import { searchFlights } from "../../services/flight";
import type { FlightSearchRequest } from "../../types/flight";

const INITIAL_QUERY: FlightSearchRequest = {
  origin: "PUS",
  destination: "OSA",
  departDate: "2026-03-18",
  returnDate: "2026-03-21",
  passengers: 2,
  seatClass: "economy",
};

export default function FlightSelect() {
  const navigate = useNavigate();
  const [query] = useState<FlightSearchRequest>(INITIAL_QUERY);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await searchFlights(query);
      navigate("/flight/result", {
        state: result,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "항공권 검색 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>쉽고 빠른 항공 예약</h1>
          <button type="button">☰</button>
        </header>

        <section className={styles.titleArea}>
          <h2>
            검색부터 발견까지 <br />
            쉽고 빠른 항공 예약
          </h2>
        </section>

        <section className={styles.formCard}>
          <Field label="출발지" value="부산 PUS" />
          <Field label="도착지" value="오사카 OSA" />
          <Field label="일정" value="3.18(수) - 3.21(토)" />
          <Field label="탑승객" value={`${query.passengers}명, 일반석`} />
        </section>

        <button
          type="button"
          className={styles.searchButton}
          disabled={isLoading}
          onClick={() => {
            void handleSearch();
          }}
        >
          {isLoading ? "검색 중..." : "항공권 검색"}
        </button>

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <section className={styles.promoSection}>
          <p className={styles.promoTitle}>언제 어디로 갈지 고민이라면?</p>
          <h3>한눈에 보는 항공 시세</h3>
          <p>전 세계 도시의 실시간 항공권 가격 보러가기</p>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
