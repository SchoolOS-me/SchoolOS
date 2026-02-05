import './TodaysSchedule.css';
import Skeleton from '../../../components/ui/Skeleton';
import { todaysSchedule } from '../../../mock/teacherDashboard';

const isLoading = false;

const TodaysSchedule = () => {
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
      ) : todaysSchedule.length === 0 ? (
        <div className="emptyState">No classes scheduled</div>
      ) : (
        <div className="scheduleList">
          {todaysSchedule.map((item) => (
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
