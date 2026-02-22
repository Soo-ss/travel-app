import styles from "./TravelCard.module.scss";

interface Props {
  image: string;
  title: string;
  location: string;
}

export default function TravelCard({ image, title, location }: Props) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} />

      <div className={styles.overlay}>
        <h3>{title}</h3>
        <p>{location}</p>
      </div>
    </div>
  );
}
