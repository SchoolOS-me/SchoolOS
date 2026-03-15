import "./DashboardSkeleton.css";

type DashboardSkeletonProps = {
  variant?: "dashboard" | "table";
};

const DashboardSkeleton = ({ variant = "dashboard" }: DashboardSkeletonProps) => {
  if (variant === "table") {
    return (
      <div className="dashboard-skeleton dashboard-skeleton--table" aria-hidden="true">
        <div className="dashboard-skeleton__title" />
        <div className="dashboard-skeleton__subtitle" />
        <div className="dashboard-skeleton__toolbar">
          <div className="dashboard-skeleton__search" />
          <div className="dashboard-skeleton__filter" />
          <div className="dashboard-skeleton__filter" />
        </div>
        <div className="dashboard-skeleton__table">
          <div className="dashboard-skeleton__thead" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="dashboard-skeleton__row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-skeleton" aria-hidden="true">
      <div className="dashboard-skeleton__title" />
      <div className="dashboard-skeleton__subtitle" />
      <div className="dashboard-skeleton__stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="dashboard-skeleton__stat" />
        ))}
      </div>
      <div className="dashboard-skeleton__content">
        <div className="dashboard-skeleton__panel dashboard-skeleton__panel--wide" />
        <div className="dashboard-skeleton__panel" />
      </div>
      <div className="dashboard-skeleton__table">
        <div className="dashboard-skeleton__thead" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="dashboard-skeleton__row" />
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
