import './StudentList.css';
import { teacherStudents } from '../../../mock/teacherDashboard';
import Skeleton from '../../../components/ui/Skeleton';

const isLoading = false;

const StudentsList = () => {
  return (
    <div className="studentsCard">
      <div className="studentsHeader">
        <h3>Grade 8-A Students</h3>
        <button className="viewAllBtn">View All</button>
      </div>

      {isLoading ? (
        <div className="studentsList">
          <Skeleton height={48} />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </div>
      ) : teacherStudents.length === 0 ? (
        <div className="emptyState">No students found</div>
      ) : (
        <div className="studentsList">
          {teacherStudents.map((student) => (
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
