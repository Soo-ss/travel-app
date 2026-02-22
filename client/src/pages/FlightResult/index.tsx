import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FlightResult.module.scss";
import { bookFlight } from "../../services/flight";
import type { FlightOption, FlightSearchResponse } from "../../types/flight";

type LocationState = FlightSearchResponse | null;

export default function FlightResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = (location.state as LocationState) || null;

  const [bookingTargetId, setBookingTargetId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const options = useMemo(() => data?.options ?? [], [data?.options]);

  const handleBook = async (flight: FlightOption) => {
    setBookingTargetId(flight.id);
    setBookingMessage(null);
    try {
      const result = await bookFlight({
        flightId: flight.id,
        customerName: "잠은보약",
        phone: "010-0000-0000",
      });
      setBookingMessage(`${result.message} (예약번호: ${result.bookingId})`);
    } catch (error) {
      setBookingMessage(
        error instanceof Error
          ? error.message
          : "예약 처리 중 문제가 발생했습니다.",
      );
    } finally {
      setBookingTargetId(null);
    }
  };

  if (!data) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone}>
          <p className={styles.empty}>검색 정보가 없습니다. 다시 검색해주세요.</p>
          <button
            type="button"
            className={styles.backToSearch}
            onClick={() => navigate("/flight/select")}
          >
            항공권 검색으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ←
          </button>
          <div>
            <h1>부산 PUS - 오사카 OSA</h1>
            <p>3.18(수) - 3.21(토) / 왕복</p>
          </div>
          <span />
        </header>

        <section className={styles.filters}>
          <button type="button" className={styles.activeFilter}>
            추천순
          </button>
          <button type="button">필터</button>
        </section>

        <section className={styles.resultHeader}>
          <h2>검색결과</h2>
          <p>{data.total}개, 왕복</p>
        </section>

        <section className={styles.list}>
          {options.map((flight) => (
            <article key={flight.id} className={styles.card}>
              {flight.recommendationTag && (
                <p className={styles.tag}># {flight.recommendationTag}</p>
              )}

              <div className={styles.row}>
                <strong>
                  {flight.outbound.departTime} - {flight.outbound.arriveTime}
                </strong>
                <span>{flight.outbound.durationText}</span>
              </div>
              <p className={styles.sub}>
                {flight.outbound.routeLabel}, {flight.outbound.airline}
              </p>

              <div className={styles.row}>
                <strong>
                  {flight.inbound.departTime} - {flight.inbound.arriveTime}
                </strong>
                <span>{flight.inbound.durationText}</span>
              </div>
              <p className={styles.sub}>
                {flight.inbound.routeLabel}, {flight.inbound.airline}
              </p>

              <p className={styles.seat}>{flight.seatsLeft}석 남음</p>
              <p className={styles.price}>
                {flight.priceKRW.toLocaleString("ko-KR")}원
              </p>
              <button
                type="button"
                className={styles.bookButton}
                disabled={bookingTargetId === flight.id}
                onClick={() => {
                  void handleBook(flight);
                }}
              >
                {bookingTargetId === flight.id ? "예약 중..." : "예약하기"}
              </button>
            </article>
          ))}
        </section>

        {bookingMessage && <div className={styles.toast}>{bookingMessage}</div>}
      </div>
    </div>
  );
}
