import './RecentClasses.css';

type RecentClassItem = {
  id: number | string;
  subject: string;
  className: string;
  time: string;
  room: string;
};

type RecentClassesProps = {
  items: RecentClassItem[];
};

const RecentClasses = ({ items }: RecentClassesProps) => {
  return (
    <div className="recent-classes">
      <h2 className="recent-classes__title">Today’s Classes</h2>

      <ul className="recent-classes__list">
        {items.map((item) => (
          <li key={item.id} className="recent-classes__item">
            <div className="recent-classes__info">
              <div className="recent-classes__subject">{item.subject}</div>
              <div className="recent-classes__meta">
                {item.className} · {item.room}
              </div>
            </div>

            <div className="recent-classes__time">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentClasses;
