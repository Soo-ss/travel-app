import styles from "../AiRecommend.module.scss";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.option} ${selected ? styles.selected : ""}`}
      onClick={onClick}>
      {label}
    </button>
  );
}
