import styles from "./HomeWeb.module.scss";
import Hero from "./Hero";
import SearchSection from "./SearchSection";
import BottomNav from "../BottomNav";

export default function HomeWeb() {
  return (
    <main className={styles.container}>
      <Hero />
      <SearchSection />
      <BottomNav />
    </main>
  );
}
