import { useEffect, useState } from 'react';

// import api from "@/app/providers/apiProvider";

type TeacherClass = {
  class: string;
  section: string;
  subjects: string[];
};
export const mockTeacher = {
  id: '1',
  name: 'Demo Teacher',
  email: 'teacher@example.com',
};
export default function TeacherDashboard() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   api
  //     .get("/academics/teacher/classes/")
  //     .then((res) => setClasses(res.data))
  //     .finally(() => setLoading(false));
  // }, []);

  if (loading) {
    return <div>Loading teacher UI...</div>;
  }
  const teacher = mockTeacher;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>

      {classes.length === 0 && <p className="text-gray-600">No classes assigned yet.</p>}

      {classes.map((item, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-gray-200 bg-white p-5">
          <div className="text-lg font-medium text-gray-900">
            {item.class} – {item.section}
          </div>

          <div className="text-sm text-gray-600">Subjects: {item.subjects.join(', ')}</div>

          <div className="flex gap-3 pt-3">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Take Attendance</button>

            <button className="rounded-md border border-gray-300 px-4 py-2 text-sm">Enter Marks</button>
          </div>
        </div>
      ))}
    </div>
  );
}
