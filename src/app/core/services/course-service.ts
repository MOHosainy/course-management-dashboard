import { Injectable, signal, computed } from '@angular/core';
import { Course, CourseFilter } from '../models/course';
import { ToastService } from '../services/toast';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private STORAGE_KEY = 'dashboard_courses_v5'; 

  private initialMockData: Course[] = [
    { 
      id: '1', 
      name: 'Angular Masterclass', 
      instructor: 'Ahmed Ali', 
      duration: '30h', 
      status: 'Active', 
      description: 'Learn Angular from zero to hero.', 
      category: 'Development', 
      price: 99.99, 
      createDate: new Date('2026-01-10').toISOString(),
      createdAt: new Date('2026-01-10').toISOString() 
    },
    { 
      id: '2', 
      name: 'React for Beginners', 
      instructor: 'Sara Omar', 
      duration: '20h', 
      status: 'Draft', 
      description: 'Introduction to React functional components.', 
      category: 'Development', 
      price: 49.99, 
      createDate: new Date('2026-02-15').toISOString(),
      createdAt: new Date('2026-02-15').toISOString() 
    },
    { 
      id: '3', 
      name: 'Node.js Advanced API', 
      instructor: 'John Doe', 
      duration: '45h', 
      status: 'Archived', 
      description: 'Build scalable REST APIs with Express.', 
      category: 'Development', 
      price: 129.99, 
      createDate: new Date('2025-11-05').toISOString(),
      createdAt: new Date('2025-11-05').toISOString() 
    },


{ 
      id: '4', 
      name: 'UI/UX Design Fundamentals', 
      instructor: 'Nour Kamel', 
      duration: '15h', 
      status: 'Active', 
      description: 'Master Figma, wireframing, prototyping, and visual design rules.', 
      category: 'Design', 
      price: 79.99, 
      createDate: new Date('2026-03-01').toISOString(),
      createdAt: new Date('2026-03-01').toISOString() 
    },
    { 
      id: '5', 
      name: 'Digital Marketing 101', 
      instructor: 'Moataz Hassan', 
      duration: '25h', 
      status: 'Active', 
      description: 'Learn SEO, SEM, Social Media marketing, and Google Ads.', 
      category: 'Marketing', 
      price: 39.99, 
      createDate: new Date('2026-04-12').toISOString(),
      createdAt: new Date('2026-04-12').toISOString() 
    },


  ];

  private coursesSignal = signal<Course[]>(this.loadFromStorage());

  searchQuery = signal<string>('');
  statusFilter = signal<CourseFilter>('All');
  
  sortKey = signal<keyof Course>('id'); 
sortDirection = signal<'asc' | 'desc'>('asc'); 

  constructor(private toastService: ToastService) {}

  filteredCourses = computed(() => {
    let list = [...this.coursesSignal()];

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(c => c.name.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query));
    }

    const status = this.statusFilter();
    if (status !== 'All') {
      list = list.filter(c => c.status === status);
    }

    const key = this.sortKey();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';
      if (aValue < bValue) return -1 * dir;
      if (aValue > bValue) return 1 * dir;
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

 

  addCourse(course: Omit<Course, 'id' | 'createDate' | 'createdAt'>) {
    const nowIsoString = new Date().toISOString();
    
    const currentCourses = this.coursesSignal();
    
    let nextId = '1';
    if (currentCourses.length > 0) {
      const maxId = Math.max(...currentCourses.map(c => Number(c.id) || 0));
      nextId = (maxId + 1).toString();
    }

    const newCourse: Course = {
      ...course,
      id: nextId, 
      createDate: nowIsoString,
      createdAt: nowIsoString
    };
    
    this.coursesSignal.update(courses => {
      const updated = [...courses, newCourse];
      this.saveToStorage(updated);
      return updated;
    });
    this.toastService.show('Course created successfully!', 'success');
  }




  updateCourse(id: string, updatedData: Partial<Course>) {
    this.coursesSignal.update(courses => {
      const updated = courses.map(c => c.id === id ? { ...c, ...updatedData } : c);
      this.saveToStorage(updated);
      return updated;
    });
    this.toastService.show('Course updated successfully!', 'success');
  }

  // [3] الـ DELETE: الحذف وإعادة الحفظ
  deleteCourse(id: string) {
    this.coursesSignal.update(courses => {
      const updated = courses.filter(c => c.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
    this.toastService.show('Course deleted successfully!', 'danger');
  }

  private saveToStorage(courses: Course[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(courses));
  }

  private loadFromStorage(): Course[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Course[];
    }
    this.saveToStorage(this.initialMockData);
    return this.initialMockData;
  }
}