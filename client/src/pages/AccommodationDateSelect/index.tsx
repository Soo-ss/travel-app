import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./AccommodationDateSelect.module.scss";

function toDate(input: string): Date {
  const [year, month, day] = input.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AccommodationDateSelect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = params.get("destination") || "오사카";
  const guests = params.get("guests") || "2";
  const checkIn = params.get("checkIn") || "2026-02-28";
  const checkOut = params.get("checkOut") || "2026-03-01";
  const [range, setRange] = useState<DateRange | undefined>({
    from: toDate(checkIn),
    to: toDate(checkOut),
  });

  const applyDate = () => {
    const nextCheckIn = range?.from ? toYMD(range.from) : checkIn;
    const nextCheckOut = range?.to ? toYMD(range.to) : nextCheckIn;

    navigate(
      `/accommodation/main?destination=${encodeURIComponent(
        destination,
      )}&checkIn=${nextCheckIn}&checkOut=${nextCheckOut}&guests=${guests}`,
    );
  };

  return (
    <div className={styles.screen}>
      <div className={styles.phone}>
        <header className={styles.topBar}>
          <button type="button" onClick={() => navigate(-1)}>
            ×
          </button>
          <div>
            <h1>일정선택</h1>
            <p>숙소를 검색하실 일정을 선택해주세요.</p>
          </div>
        </header>

        <section className={styles.pickerWrap}>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(nextRange: DateRange | undefined) => setRange(nextRange)}
            numberOfMonths={2}
            weekStartsOn={0}
            className={styles.picker}
          />
        </section>

        <button type="button" className={styles.confirm} onClick={applyDate}>
          {destination} | {(range?.from ? toYMD(range.from) : checkIn).slice(5)}~
          {(range?.to ? toYMD(range.to) : checkOut).slice(5)} / 숙소검색
        </button>
      </div>
    </div>
  );
}
