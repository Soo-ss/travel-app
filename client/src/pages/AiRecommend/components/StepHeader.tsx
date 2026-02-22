import styles from "../AiRecommend.module.scss";

interface Props {
  step: number;
  title: string;
  subtitle: string;
  icon: string;
}

export default function StepHeader({ step, title, subtitle, icon }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.progress}>{step}/5</div>
      <div className={styles.icon}>{icon}</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
