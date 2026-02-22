import styles from "./BottomNav.module.scss";

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      <button>
        <span>🏠</span>
        국내여행
      </button>

      <button className={styles.center}>💼</button>

      <button>
        <span>🌍</span>
        해외여행
      </button>
    </nav>
  );
}
