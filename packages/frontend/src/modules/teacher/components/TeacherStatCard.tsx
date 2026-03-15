import type { ReactNode } from "react";
import "./TeacherStatCard.css";

type TrendVariant = "positive" | "negative" | "neutral";

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  trend: string;
  trendVariant?: TrendVariant;
};

const TeacherStatCard = ({
  label,
  value,
  icon,
  trend,
  trendVariant = "neutral",
}: Props) => {
  return (
    <div className="teacherStatCard">
      <div className="teacherStatCard__row">
        <span className="teacherStatCard__label">{label}</span>
        <span className="teacherStatCard__icon">{icon}</span>
      </div>
      <div className="teacherStatCard__value">{value}</div>
      <div className={`teacherStatCard__trend is-${trendVariant}`}>
        {trend}
      </div>
    </div>
  );
};

export default TeacherStatCard;
