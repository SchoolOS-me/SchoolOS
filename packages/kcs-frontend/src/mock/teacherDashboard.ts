export const teacherStats = [
  { label: 'Students', value: '120' },
  { label: 'Classes', value: '8' },
  { label: 'Attendance', value: '96%' },
  { label: 'Pending Marks', value: '14' }
];

export const recentClasses = [
  {
    id: 1,
    subject: 'Mathematics',
    className: 'Class 8A',
    time: '09:00 - 09:45',
    room: 'Room 204',
  },
  {
    id: 2,
    subject: 'Science',
    className: 'Class 7B',
    time: '10:00 - 10:45',
    room: 'Lab 1',
  },
  {
    id: 3,
    subject: 'English',
    className: 'Class 9C',
    time: '11:00 - 11:45',
    room: 'Room 301',
  },
];

export const weeklyTimetable = [
  {
    day: 'Monday',
    classes: [
      { time: '09:00 - 09:45', subject: 'Math', className: '8A' },
      { time: '10:00 - 10:45', subject: 'Science', className: '7B' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { time: '09:00 - 09:45', subject: 'English', className: '9C' },
      { time: '11:00 - 11:45', subject: 'Math', className: '8A' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { time: '10:00 - 10:45', subject: 'Science', className: '7B' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { time: '09:00 - 09:45', subject: 'Math', className: '8A' },
      { time: '11:00 - 11:45', subject: 'English', className: '9C' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { time: '10:00 - 10:45', subject: 'Science', className: '7B' },
    ],
  },
];

export const teacherStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    rollNo: '001',
    attendance: 95.5,
  },
  {
    id: '2',
    name: 'Bob Smith',
    rollNo: '002',
    attendance: 92.3,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    rollNo: '003',
    attendance: 89.8,
  },
];

export const todaysSchedule = [
  {
    id: '1',
    time: '09:00 AM',
    subject: 'Mathematics',
    class: 'Grade 8-A',
    room: 'Room 101',
    isNow: false,
  },
  {
    id: '2',
    time: '10:30 AM',
    subject: 'Mathematics',
    class: 'Grade 8-A',
    room: 'Room 101',
    isNow: true,
  },
  {
    id: '3',
    time: '12:00 PM',
    subject: 'Science',
    class: 'Grade 9-B',
    room: 'Room 204',
    isNow: false,
  },
];
