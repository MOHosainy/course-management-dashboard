
import { Injectable, signal, computed } from '@angular/core';
import { Course, CourseFilter } from '../models/course';
import { ToastService } from '../services/toast';

@Injectable({ providedIn: 'root' })
export class CourseService {
  // Mock Data Initializer
  private coursesSignal = signal<Course[]>([
    { id: '1', name: 'Angular Masterclass', instructor: 'Ahmed Ali', duration: '30h', status: 'Active', description: 'Learn Angular from zero to hero.', createdAt: new Date('2026-01-10') },
    { id: '2', name: 'React for Beginners', instructor: 'Sara Omar', duration: '20h', status: 'Draft', description: 'Introduction to React functional components.', createdAt: new Date('2026-02-15') },
    { id: '3', name: 'Node.js Advanced API', instructor: 'John Doe', duration: '45h', status: 'Archived', description: 'Build scalable REST APIs with Express.', createdAt: new Date('2025-11-05') },
    { id: '4', name: 'Introduction to TypeScript', instructor: 'Maged Kamel', duration: '12h', status: 'Active', description: 'Master types, interfaces, and generics.', createdAt: new Date('2026-03-01') }
  ]);

  // State Management for filters/search
  searchQuery = signal<string>('');
  statusFilter = signal<CourseFilter>('All');
  sortKey = signal<keyof Course>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor(private toastService: ToastService) {}

  // Computed signal to get filtered, searched, and sorted courses
  filteredCourses = computed(() => {
    let list = [...this.coursesSignal()];

    // Search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(c => c.name.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query));
    }

    // Status filter
    const status = this.statusFilter();
    if (status !== 'All') {
      list = list.filter(c => c.status === status);
    }

    // Sorting
    const key = this.sortKey();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (a[key] < b[key]) return -1 * dir;
      if (a[key] > b[key]) return 1 * dir;
      return 0;
    });

    return list;
  });

  getCourses() {
    return this.filteredCourses;
  }

  getCourseById(id: string): Course | undefined {
    return this.coursesSignal().find(c => c.id === id);
  }

  addCourse(course: Omit<Course, 'id' | 'createdAt'>) {
    const newCourse: Course = {
      ...course,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    this.coursesSignal.update(courses => [...courses, newCourse]);
    this.toastService.show('Course created successfully!', 'success');
  }

  updateCourse(id: string, updatedData: Partial<Course>) {
    this.coursesSignal.update(courses =>
      courses.map(c => c.id === id ? { ...c, ...updatedData } : c)
    );
    this.toastService.show('Course updated successfully!', 'success');
  }

  deleteCourse(id: string) {
    this.coursesSignal.update(courses => courses.filter(c => c.id !== id));
    this.toastService.show('Course deleted successfully!', 'danger');
  }
}