import styles from "./CategoryMenu.module.scss";
import { useNavigate } from "react-router-dom";

interface Category {
  label: string;
  icon: string;
}

const categories: Category[] = [
  { label: "항공권", icon: "✈️" },
  { label: "숙소", icon: "🏨" },
  { label: "투어·티켓", icon: "🎟️" },
  { label: "렌터카·보험", icon: "🚗" },
  { label: "AI일정추천", icon: "🤖" },
];

export default function CategoryMenu() {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    if (label === "항공권") {
      navigate("/flight/select");
      return;
    }

    if (label === "숙소") {
      navigate("/accommodation/main");
    }
  };

  return (
    <div className={styles.wrapper}>
      {categories.map((item) => (
        <button
          key={item.label}
          type="button"
          className={styles.item}
          onClick={() => handleClick(item.label)}
        >
          <div className={styles.icon}>{item.icon}</div>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
