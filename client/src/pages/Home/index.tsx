import styles from "./Home.module.scss";
import Header from "./components/Header";
import CategoryMenu from "./components/CategoryMenu";
import TravelCard from "./components/TravelCard";
import NoticeBar from "./components/NoticeBar";
import CouponBanner from "./components/CouponBanner";
import FloatingButton from "./components/FloatingButton";

import jeju981 from "../../assets/images/jeju981.png";
import chicken from "../../assets/images/chicken.jpg";

interface Props {
  onStartRecommend?: () => void;
}

export default function Home({ onStartRecommend }: Props) {
  return (
    <div className={styles.container}>
      <Header />
      <CategoryMenu />

      <section className={styles.section}>
        <h2 className={styles.title}>
          <span className={styles.highlight}>잠은보약님</span>, 여행의 설렘이
          느껴지는
          <br />
          다양한 여행지 소식을 모아왔어요
        </h2>

        <div className={styles.cardWrapper}>
          <TravelCard
            title="'9.81 파크' 리뷰"
            location="제주"
            image={jeju981}
          />
          <TravelCard
            title="제주 여행 필수 코스, 재래 시장의 매력"
            location="제주"
            image={chicken}
          />
        </div>
      </section>

      <NoticeBar />
      <CouponBanner />
      <FloatingButton onClick={onStartRecommend} />
    </div>
  );
}
