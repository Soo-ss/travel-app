import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./AccommodationDetail.module.scss";
import sampleImage from "../../assets/sapporo.jpg";
import { getAccommodationDetail } from "../../services/accommodation";
import type { AccommodationDetail as AccommodationDetailType } from "../../types/accommodation";

type HotelState = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export default function AccommodationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state as HotelState) || {};
  const [hotel, setHotel] = useState<AccommodationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const destination = state.destination || "오사카";
  const checkIn = state.checkIn || "2026-02-28";
  const checkOut = state.checkOut || "2026-03-01";
  const guests = state.guests || "2";

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setErrorMessage("숙소 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getAccommodationDetail(id);
        setHotel(response.item);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "숙소 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone}>
          <p className={styles.infoText}>상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!hotel || errorMessage) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone}>
          <p className={styles.errorText}>{errorMessage || "숙소 정보를 찾을 수 없습니다."}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => navigate("/accommodation/select")}
          >
            숙소 목록으로 돌아가기
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
          <div className={styles.icons}>⌖ ⋯</div>
        </header>

        <img
          src={hotel.images[0] || hotel.thumbnailUrl || sampleImage}
          alt={hotel.name}
          className={styles.hero}
        />

        <section className={styles.content}>
          <div className={styles.badges}>호텔 · {hotel.starRating}성급</div>
          <h1>{hotel.name}</h1>
          <p>
            {destination} {hotel.district} | 지도보기
          </p>
        </section>

        <section className={styles.actions}>
          <button type="button">저장하기</button>
          <button type="button">일정추가</button>
          <button type="button">리뷰쓰기</button>
          <button type="button">공유하기</button>
        </section>

        <footer className={styles.bottom}>
          <div>
            <p className={styles.discount}>쿠폰 받으면 최대 7% 할인</p>
            <strong>{hotel.priceKRW.toLocaleString("ko-KR")}원</strong>
            <p className={styles.meta}>
              {checkIn.slice(5).replace("-", ".")} - {checkOut
                .slice(5)
                .replace("-", ".")} · {guests}명
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/accommodation/select")}
          >
            객실 보기
          </button>
        </footer>
      </div>
    </div>
  );
}
