


import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Course } from '../../../core/models/course.model';
import { Course } from '../../../../core/models/course';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th (click)="sort('name')">Course Name ↕</th>
            <th (click)="sort('instructor')">Instructor ↕</th>
            <th>Duration</th>
            <th (click)="sort('status')">Status ↕</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (course of paginatedData(); track course.id) {
            <tr>
              <td><strong>{{ course.name }}</strong></td>
              <td>{{ course.instructor }}</td>
              <td>{{ course.duration }}</td>
              <td>
                <span [class]="'badge ' + course.status.toLowerCase()">{{ course.status }}</span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-view" (click)="onView.emit(course.id)">👁 View</button>
                  <button class="btn-edit" (click)="onEdit.emit(course.id)">✏️ Edit</button>
                  <button class="btn-delete" (click)="onDelete.emit(course.id)">🗑 Delete</button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" style="text-align: center; padding: 20px;">No courses found.</td>
            </tr>
          }
        </tbody>
      </table>

      @if (totalPages() > 1) {
        <div class="pagination">
          <button [disabled]="currentPage() === 1" (click)="changePage(currentPage() - 1)">Previous</button>
          <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
          <button [disabled]="currentPage() === totalPages()" (click)="changePage(currentPage() + 1)">Next</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container { width: 100%; overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; text-align: left; font-family: sans-serif; }
    th, td { padding: 14px 20px; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; cursor: pointer; user-select: none; color: #555; }
    th:hover { background: #f1f3f5; }
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .active { background: #e8f5e9; color: #2e7d32; }
    .draft { background: #fff3e0; color: #ef6c00; }
    .archived { background: #ffebee; color: #c62828; }
    .actions { display: flex; gap: 8px; }
    .actions button { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;}
    .btn-view { background: #e3f2fd; color: #1565c0; }
    .btn-edit { background: #fff8e1; color: #f9a825; }
    .btn-delete { background: #ffebee; color: #c62828; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-top: 1px solid #eee; }
    .pagination button { padding: 6px 12px; border: 1px solid #ccc; background: white; cursor: pointer; border-radius: 4px; }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class TableComponent {
  // هنا حولنا الـ input لـ Signal input عشان نراقب التغييرات اللي بتحصل عليه فوراً وبكفاءة أعلى
  @Input() set data(value: Course[]) {
    this._data.set(value);
    this.currentPage.set(1); // أول ما الداتا تتغير (سيرش أو فلتر)، صَفّر الصفحة فوراً وهات الأولى
  }
  get data(): Course[] {
    return this._data();
  }
  
  private _data = signal<Course[]>([]);

  @Output() onView = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<keyof Course>();

  currentPage = signal<number>(1);
  pageSize = 3; 

  totalPages = computed(() => Math.ceil(this._data().length / this.pageSize));

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this._data().slice(start, start + this.pageSize);
  });

  sort(key: keyof Course) {
    this.onSort.emit(key);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}