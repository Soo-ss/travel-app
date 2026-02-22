import styles from "./Header.module.scss";
import { CalendarPlus, Search, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>TRIPLE</h1>

      <div className={styles.icons}>
        <CalendarPlus size={20} />
        <Search size={20} />
        <Menu size={20} />
      </div>
    </header>
  );
}
