import styles from "./FloatingButton.module.scss";
import { CalendarPlus } from "lucide-react";

interface Props {
  onClick?: () => void;
}

export default function FloatingButton({ onClick }: Props) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <CalendarPlus size={18} />
      여행 일정짜기
    </button>
  );
}
