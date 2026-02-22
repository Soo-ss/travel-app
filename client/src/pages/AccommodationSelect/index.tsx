import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AccommodationSelect.module.scss";
import { searchAccommodations } from "../../services/accommodation";
import type { AccommodationSummary } from "../../types/accommodation";

export default function AccommodationSelect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = params.get("destination") || "오사카";
  const checkIn = params.get("checkIn") || "2026-02-28";
  const checkOut = params.get("checkOut") || "2026-03-01";
  const guests = params.get("guests") || "2";
  const [hotels, setHotels] = useState<AccommodationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await searchAccommodations({
          destination,
          checkIn,
          checkOut,
          guests: Number(guests),
          sort: "recommended",
        });
        setHotels(response.items);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "숙소 목록 로딩에 실패했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [checkIn, checkOut, destination, guests]);

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>{destination} 숙소</h1>
          <button type="button">⌕</button>
        </header>

        <section className={styles.filterRow}>
          <button type="button" className={styles.blueBtn}>
            {checkIn.slice(5).replace("-", ".")} - {checkOut
              .slice(5)
              .replace("-", ".")} / {guests}명
          </button>
          <button type="button">필터</button>
          <button type="button">추천순</button>
        </section>

        {isLoading && <p className={styles.infoText}>숙소를 불러오는 중...</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <section className={styles.list}>
          {hotels.map((hotel) => (
            <article
              key={hotel.id}
              className={styles.card}
              onClick={() =>
                navigate(`/accommodation/detail/${hotel.id}`, {
                  state: {
                    destination,
                    checkIn,
                    checkOut,
                    guests,
                  },
                })
              }
            >
              <div className={styles.badge}>{hotel.tags[0] || "트리플 BEST"}</div>
              <div className={styles.cardBody}>
                <div>
                  <h2>{hotel.name}</h2>
                  <p>{hotel.subtitle}</p>
                  <span>{hotel.starRating}성급 · {hotel.district}</span>
                </div>
                <img src={hotel.thumbnailUrl} alt={hotel.name} />
              </div>
              <div className={styles.priceRow}>
                <strong>{hotel.priceKRW.toLocaleString("ko-KR")}원</strong>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
