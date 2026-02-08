import './StudentList.css';
import Skeleton from '../../../components/ui/Skeleton';

type StudentItem = {
  id: string | number;
  name: string;
  rollNo: string;
  attendance: number;
};

type StudentsListProps = {
  title: string;
  isLoading?: boolean;
  students: StudentItem[];
};

const StudentsList = ({ title, isLoading = false, students }: StudentsListProps) => {
  return (
    <div className="studentsCard">
      <div className="studentsHeader">
        <h3>{title}</h3>
        <button className="viewAllBtn">View All</button>
      </div>

      {isLoading ? (
        <div className="studentsList">
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>
      ) : students.length === 0 ? (
        <div className="emptyState">No students found</div>
      ) : (
        <div className="studentsList">
          {students.map((student) => (
            <div key={student.id} className="studentRow">
              <div className="studentLeft">
                <div className="avatar">
                  {student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>

                <div className="studentInfo">
                  <div className="studentName">{student.name}</div>
                  <div className="studentRoll">
                    Roll No: {student.rollNo}
                  </div>
                </div>
              </div>

              <div className="studentAttendance">
                {student.attendance}%
                <span>Attendance</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;
