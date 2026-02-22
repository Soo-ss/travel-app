import styles from "./HomeWeb.module.scss";

export default function SearchSection() {
  return (
    <section className={styles.searchSection}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        어디로 떠나시나요?
      </div>

      <ul className={styles.categoryRow}>
        <li>✈️ 항공권</li>
        <li>🏨 숙소</li>
        <li>🎟 투어·티켓</li>
        <li>🧳 패키지</li>
      </ul>

      <div className={styles.banner}>
        <span className={styles.tag}>제주</span>
        렌터카 최저가 예약 & 다양한 혜택까지 →
      </div>

      <div className={styles.magazineHeader}>
        <h3>트리플 매거진</h3>
        <button type="button">더보기</button>
      </div>

      <article className={styles.magazineCard} />
    </section>
  );
}
