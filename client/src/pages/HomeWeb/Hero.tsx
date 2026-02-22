import styles from "./HomeWeb.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <header className={styles.header}>
        <h1 className={styles.logo}>TRIPLE</h1>

        <div className={styles.headerIcons}>
          <button className={styles.plus} aria-label="Add">
            +
          </button>

          <button className={styles.menu} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>

          <span className={styles.dot} />
        </div>
      </header>

      <div className={styles.heroContent}>
        <h2>
          요즘 대세 여행지,
          <br />
          나트랑에 간다면
        </h2>

        <p>꼭 가야 할 하이라이트 명소</p>

        <button className={styles.cta}>지금 살펴보기 →</button>
      </div>
    </section>
  );
}
