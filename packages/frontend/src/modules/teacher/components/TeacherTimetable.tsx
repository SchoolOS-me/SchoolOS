import './TeacherTimetable.css';

type TimetableDay = {
  day: string;
  classes: Array<{ time: string; subject: string; className: string }>;
};

type TeacherTimetableProps = {
  timetable: TimetableDay[];
};

const TeacherTimetable = ({ timetable }: TeacherTimetableProps) => {
  return (
    <div className="teacher-timetable">
      <h2 className="teacher-timetable__title">Weekly Schedule</h2>

      <div className="teacher-timetable__days">
        {timetable.map((day) => (
          <div key={day.day} className="teacher-timetable__day">
            <div className="teacher-timetable__day-name">
              {day.day}
            </div>

            <ul className="teacher-timetable__classes">
              {day.classes.map((item, index) => (
                <li key={index} className="teacher-timetable__class">
                  <div className="teacher-timetable__subject">
                    {item.subject}
                  </div>
                  <div className="teacher-timetable__meta">
                    {item.className} · {item.time}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTimetable;
