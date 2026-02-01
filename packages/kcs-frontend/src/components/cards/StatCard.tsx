import './StatCard.css';

type Props = {
  label: string;
  value: string;
};

const StatCard = ({ label, value }: Props) => {
  return (
    <div className="statCard">
      <div className="statValue">{value}</div>
      <div className="statLabel">{label}</div>
    </div>
  );
};

export default StatCard;
