import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../../core/models/course';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-component.html',
  styleUrl: './table-component.scss'
})
export class TableComponent {
  @Input() set data(value: Course[]) {
    const previousLength = this._data().length;
    this._data.set(value);
    
    if (value.length !== previousLength) {
      this.currentPage.set(1); 
    }
  }
  get data(): Course[] { return this._data(); }
  private _data = signal<Course[]>([]);

  @Output() onView = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<keyof Course>();

  currentPage = signal<number>(1);
  pageSize = 2; 

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