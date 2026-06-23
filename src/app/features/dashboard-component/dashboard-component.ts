import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CourseService } from '../../core/services/course-service';
import { TableComponent } from '../../shared/components/tables/table-component/table-component';
import { ModalComponent } from '../../shared/components/model/modal-component/modal-component';
import { CourseFilter,Course } from '../../core/models/course';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableComponent, ModalComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss'
})
export class DashboardComponent implements OnInit {
  isModalOpen = signal(false);
  courseIdToDelete = signal<string | null>(null);

  constructor(public courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.courseService.statusFilter.set('All');
    this.courseService.searchQuery.set('');
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.courseService.searchQuery.set(val);
  }

  onFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as CourseFilter;
    this.courseService.statusFilter.set(val);
  }

  handleSort(key: keyof Course) {
    const currentDirection = this.courseService.sortDirection();
    this.courseService.sortKey.set(key);
    this.courseService.sortDirection.set(currentDirection === 'asc' ? 'desc' : 'asc');
  }

  navigateToAdd() { this.router.navigate(['/courses/new']); }
  viewCourse(id: string) { this.router.navigate(['/courses', id]); }
  editCourse(id: string) { this.router.navigate(['/courses', id, 'edit']); }

  openDeleteModal(id: string) {
    this.courseIdToDelete.set(id);
    this.isModalOpen.set(true);
  }

  confirmDelete() {
    const id = this.courseIdToDelete();
    if (id) {
      this.courseService.deleteCourse(id);
    }
    this.closeModal();
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.courseIdToDelete.set(null);
  }
}