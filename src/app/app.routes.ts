

import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard-component/dashboard-component';
export const routes: Routes = [
  {
    path: '',
    
    loadComponent: () =>import('./features/dashboard-component/dashboard-component').then(m => m.DashboardComponent)
  },
  {
    path: 'courses/new',
    loadComponent: () =>   import('./features/course-form/course-form-component/course-form-component').then(m => m.CourseFormComponent)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/course-detail/course-detail-component/course-detail-component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./features/course-form/course-form-component/course-form-component').then(m => m.CourseFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];