import { RoleAccess } from '@/shared/components/roleAccess';
import { Outlet } from 'react-router-dom';

export default function TeacherLayout() {
  return (
    <RoleAccess allowedRoles={['TEACHER']}>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </RoleAccess>
  );
}
