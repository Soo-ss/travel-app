import styles from "./CouponBanner.module.scss";

export default function CouponBanner() {
  return (
    <div className={styles.banner}>
      <h3>제주 면세점 최대 2만원 할인</h3>
      <p>트리플 회원 전용 할인 쿠폰 받기</p>
    </div>
  );
}
