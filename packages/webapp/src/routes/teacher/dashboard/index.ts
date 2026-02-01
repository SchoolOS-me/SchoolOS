import { lazy } from 'react';

export const TeacherRoutes = {
  path: '/teacher',
  component: lazy(() => import('./teacher.component')),
  children: [
    {
      path: '',
      component: lazy(() => import('./dashboard')),
    },
  ],
};
