import type { ReactNode } from "react";
import StatCard from "../../../components/cards/StatCard";
import "./SuperAdminStatCard.css";

type TrendVariant = "positive" | "negative" | "neutral";

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  trend: string;
  trendVariant?: TrendVariant;
};

const SuperAdminStatCard = ({
  label,
  value,
  icon,
  trend,
  trendVariant = "neutral",
}: Props) => {
  return (
    <div className="superAdminStatCard">
      <div className="superAdminStatTop">
        <StatCard label={label} value={value} />
        <span className="superAdminStatIcon">{icon}</span>
      </div>
      <div className={`superAdminStatTrend is-${trendVariant}`}>{trend}</div>
    </div>
  );
};

export default SuperAdminStatCard;
