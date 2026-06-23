import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from './core/services/course-service';

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
    loadComponent: () => import('./features/course-detail/course-detail-component/course-detail-component').then(m => m.CourseDetailComponent),
    canActivate: [(route) => {
      const id = route.paramMap.get('id');
      const hasCourse = !!inject(CourseService).getCourseById(id || '');
      return hasCourse ? true : inject(Router).createUrlTree(['/']);
    }]
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./features/course-form/course-form-component/course-form-component').then(m => m.CourseFormComponent),
    canActivate: [(route) => {
      const id = route.paramMap.get('id');
      const hasCourse = !!inject(CourseService).getCourseById(id || '');
      return hasCourse ? true : inject(Router).createUrlTree(['/']);
    }]
  },
  {
    path: '**',
    redirectTo: ''
  }
];