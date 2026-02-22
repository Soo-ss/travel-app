import styles from "../AiRecommend.module.scss";

interface Props {
  disabled: boolean;
  label?: string;
  onClick: () => void;
}

export default function BottomButton({ disabled, label = "다음", onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.bottomBtn} ${disabled ? styles.disabled : ""}`}
      disabled={disabled}
      onClick={onClick}>
      {label}
    </button>
  );
}
