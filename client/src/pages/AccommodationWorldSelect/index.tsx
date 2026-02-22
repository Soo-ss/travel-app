import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AccommodationWorldSelect.module.scss";

const CITIES = ["오사카", "후쿠오카", "다낭", "나트랑", "홍콩"];

export default function AccommodationWorldSelect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const checkIn = params.get("checkIn") || "2026-02-28";
  const checkOut = params.get("checkOut") || "2026-03-01";
  const guests = params.get("guests") || "2";

  const moveToMain = (destination: string) => {
    navigate(
      `/accommodation/main?destination=${encodeURIComponent(
        destination,
      )}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
    );
  };

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>전세계 도시, 숙소 검색</h1>
          <button type="button">⌕</button>
        </header>

        <section className={styles.block}>
          <div className={styles.blockTitle}>
            <h2>인기 검색어</h2>
            <span>전체도시</span>
          </div>
          <div className={styles.chips}>
            {CITIES.map((city) => (
              <button key={city} type="button" onClick={() => moveToMain(city)}>
                {city}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.block}>
          <h2>최근 본 숙소</h2>
          <article className={styles.recentCard}>
            <div className={styles.thumb} />
            <div>
              <strong>소테츠 그랜드 프레사 ...</strong>
              <p>2.28(토) - 3.1(일) | 2명</p>
            </div>
          </article>
        </section>

        <section className={styles.block}>
          <h2>최근 검색</h2>
          <button type="button" className={styles.recentSearch} onClick={() => moveToMain("오사카")}>
            <strong>오사카</strong>
            <p>오사카(현) | 2.28.(토) - 3.1.(일) | 2명</p>
          </button>
        </section>
      </div>
    </div>
  );
}
