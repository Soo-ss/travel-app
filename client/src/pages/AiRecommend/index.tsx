import { useMemo, useState } from "react";
import styles from "./AiRecommend.module.scss";
import StepHeader from "./components/StepHeader.tsx";
import OptionButton from "./components/OptionButton.tsx";
import BottomButton from "./components/BottomButton.tsx";
import type { ItineraryPayload } from "../../types/travel";

interface Props {
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onSubmit: (payload: ItineraryPayload) => void | Promise<void>;
}

type AnswersState = {
  city: string[];
  duration: string[];
  companions: string[];
  styles: string[];
  pace: string[];
};

const INITIAL_ANSWERS: AnswersState = {
  city: [],
  duration: [],
  companions: [],
  styles: [],
  pace: [],
};

const CITY_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "도쿄", value: "tokyo" },
  { label: "후쿠오카", value: "fukuoka" },
  { label: "오사카", value: "osaka" },
  { label: "삿포로", value: "sapporo" },
];

function toDays(duration: string): number {
  if (duration.includes("당일")) return 1;
  const matched = duration.match(/(\d+)박\s*(\d+)일/);
  if (!matched) return 2;
  return Number(matched[2]);
}

export default function AiRecommend({
  isLoading = false,
  errorMessage,
  onBack,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<AnswersState>(INITIAL_ANSWERS);

  const toggleSelect = (value: string, multi = false) => {
    if (!multi) {
      setSelected([value]);
    } else {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    }
  };

  const nextStep = async () => {
    if (isLoading) return;

    const nextAnswers: AnswersState = { ...answers };

    if (step === 1) nextAnswers.city = selected;
    if (step === 2) nextAnswers.duration = selected;
    if (step === 3) nextAnswers.companions = selected;
    if (step === 4) nextAnswers.styles = selected;
    if (step === 5) nextAnswers.pace = selected;

    setAnswers(nextAnswers);

    if (step < 5) {
      setStep((prev) => prev + 1);
      setSelected([]);
      return;
    }

    const durationLabel = nextAnswers.duration[0] ?? "2박 3일";
    const payload: ItineraryPayload = {
      city: nextAnswers.city[0] ?? "osaka",
      durationLabel,
      days: toDays(durationLabel),
      companions: nextAnswers.companions,
      styles: nextAnswers.styles,
      pace: nextAnswers.pace[0] ?? "널널한 일정 선호",
    };

    await onSubmit(payload);
  };

  const buttonLabel = useMemo(
    () =>
      step === 5 ? (isLoading ? "추천 생성 중..." : "추천 일정 받기") : "다음",
    [step, isLoading],
  );

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <StepHeader
              step={1}
              title="떠나고 싶은 도시는?"
              subtitle="도시 1곳을 선택해주세요."
              icon="🌍"
            />
            <Section title="일본">
              <div className={styles.optionGrid}>
                {CITY_OPTIONS.map((city) => (
                  <OptionButton
                    key={city.value}
                    label={city.label}
                    selected={selected.includes(city.value)}
                    onClick={() => toggleSelect(city.value)}
                  />
                ))}
              </div>
            </Section>
          </>
        );

      case 2:
        return (
          <>
            <StepHeader
              step={2}
              title="여행 기간은?"
              subtitle="원하는 기간을 선택해 주세요."
              icon="📅"
            />
            <div className={styles.optionGrid}>
              {[
                "당일치기",
                "1박 2일",
                "2박 3일",
                "3박 4일",
                "4박 5일",
                "5박 6일",
              ].map((item) => (
                <OptionButton
                  key={item}
                  label={item}
                  selected={selected.includes(item)}
                  onClick={() => toggleSelect(item)}
                />
              ))}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <StepHeader
              step={3}
              title="누구와 떠나나요?"
              subtitle="다중 선택이 가능해요."
              icon="😎"
            />
            <div className={styles.optionGrid}>
              {[
                "혼자",
                "친구와",
                "연인과",
                "배우자와",
                "아이와",
                "부모님과",
                "기타",
              ].map((item) => (
                <OptionButton
                  key={item}
                  label={item}
                  selected={selected.includes(item)}
                  onClick={() => toggleSelect(item, true)}
                />
              ))}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <StepHeader
              step={4}
              title="내가 선호하는 여행 스타일은?"
              subtitle="다중 선택이 가능해요."
              icon="📷"
            />
            <div className={styles.optionGrid}>
              {[
                "체험·액티비티",
                "SNS 핫플레이스",
                "자연과 함께",
                "유명 관광지는 필수",
                "여유롭게 힐링",
                "문화·예술·역사",
                "여행지 느낌 물씬",
                "쇼핑은 열정적으로",
                "관광보다 먹방",
              ].map((item) => (
                <OptionButton
                  key={item}
                  label={item}
                  selected={selected.includes(item)}
                  onClick={() => toggleSelect(item, true)}
                />
              ))}
            </div>
          </>
        );

      case 5:
        return (
          <>
            <StepHeader
              step={5}
              title="선호하는 여행 일정은?"
              subtitle="선택해주신 스타일로 일정을 만들어드려요."
              icon="🗺️"
            />
            <div className={styles.optionGrid}>
              {["빼곡한 일정 선호", "널널한 일정 선호"].map((item) => (
                <OptionButton
                  key={item}
                  label={item}
                  selected={selected.includes(item)}
                  onClick={() => toggleSelect(item)}
                />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.container}>
      {onBack && (
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← 홈으로
        </button>
      )}
      {renderContent()}
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
      <BottomButton
        label={buttonLabel}
        disabled={selected.length === 0 || isLoading}
        onClick={() => {
          void nextStep();
        }}
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <div>{children}</div>
    </>
  );
}
