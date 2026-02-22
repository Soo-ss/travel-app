import styles from "./NoticeBar.module.scss";

export default function NoticeBar() {
  return (
    <div className={styles.notice}>
      <span className={styles.badge}>공지</span>
      <span>[놀유니버스] 트리플 캐시 서비스 종료 및 ...</span>
    </div>
  );
}
