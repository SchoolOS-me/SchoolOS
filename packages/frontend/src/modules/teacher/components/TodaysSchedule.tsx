import './TodaysSchedule.css';
import Skeleton from '../../../components/ui/Skeleton';

type ScheduleItem = {
  id: string | number;
  time: string;
  subject: string;
  class: string;
  room: string;
  isNow: boolean;
};

type TodaysScheduleProps = {
  isLoading?: boolean;
  items: ScheduleItem[];
};

const TodaysSchedule = ({ isLoading = false, items }: TodaysScheduleProps) => {
  return (
    <div className="scheduleCard">
      <div className="scheduleHeader">
        <h3>Today's Schedule</h3>
      </div>

      {isLoading ? (
        <div className="scheduleList">
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
      ) : items.length === 0 ? (
        <div className="emptyState">No classes scheduled</div>
      ) : (
        <div className="scheduleList">
          {items.map((item) => (
            <div
              key={item.id}
              className={`scheduleItem ${
                item.isNow ? 'active' : ''
              }`}
            >
              <div className="time">{item.time}</div>

              <div className="details">
                <div className="subject">{item.subject}</div>
                <div className="meta">
                  {item.class} · {item.room}
                </div>
              </div>

              {item.isNow && (
                <span className="nowBadge">Now</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;
