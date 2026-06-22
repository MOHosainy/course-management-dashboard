// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard-component',
//   imports: [],
//   templateUrl: './dashboard-component.html',
//   styleUrl: './dashboard-component.scss',
// })
// export class DashboardComponent {}



import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { CourseService } from '../../core/services/course.service';
// import { TableComponent } from '../../shared/components/table/table.component';
// import { ModalComponent } from '../../shared/components/modal/modal.component';
// import { CourseFilter, Course } from '../../core/models/course.model';
import { CourseService } from '../../core/services/course-service';
import { TableComponent } from '../../shared/components/tables/table-component/table-component';
import { ModalComponent } from '../../shared/components/model/modal-component/modal-component';
import { CourseFilter,Course } from '../../core/models/course';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableComponent, ModalComponent],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Course Management Dashboard</h1>
        <button class="btn-add" (click)="navigateToAdd()">+ Add New Course</button>
      </div>

      <div class="toolbar">
        <input type="text" placeholder="Search by name or instructor..." (input)="onSearch($event)" />
        
        <select (change)="onFilterChange($event)">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <app-table 
        [data]="courseService.getCourses()()"
        (onView)="viewCourse($event)"
        (onEdit)="editCourse($event)"
        (onDelete)="openDeleteModal($event)"
        (onSort)="handleSort($event)">
      </app-table>

      <app-modal 
        [isOpen]="isModalOpen()"
        title="Confirm Deletion"
        message="Are you sure you want to delete this course? This action cannot be undone."
        (onConfirm)="confirmDelete()"
        (onCancel)="closeModal()">
      </app-modal>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 30px; max-width: 1200px; margin: 0 auto; font-family: sans-serif; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    h1 { color: #011627; margin: 0; }
    .btn-add { background: #2ec4b6; color: white; border: none; padding: 12px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; }
    .toolbar { display: flex; gap: 15px; margin-bottom: 20px; }
    .toolbar input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; }
    .toolbar select { padding: 10px; border: 1px solid #ccc; border-radius: 6px; background: white; width: 150px; }
  `]
})
export class DashboardComponent {
  isModalOpen = signal(false);
  courseIdToDelete = signal<string | null>(null);

  constructor(public courseService: CourseService, private router: Router) {}

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