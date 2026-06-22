import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// import { CourseService } from '../../core/services/course-service';
import { CourseService } from '../../../core/services/course-service';
// import { Course } from '../../core/models/course.model';
import { Course } from '../../../core/models/course';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (course(); as c) {
      <div class="detail-container">
        <div class="card">
          <div class="card-header">
            <h2>{{ c.name }}</h2>
            <span [class]="'badge ' + c.status.toLowerCase()">{{ c.status }}</span>
          </div>
          <hr />
          <div class="card-body">
            <p><strong>Instructor:</strong> {{ c.instructor }}</p>
            <p><strong>Duration:</strong> {{ c.duration }}</p>
            <p><strong>Created At:</strong> {{ c.createdAt | date:'longDate' }}</p>
            <p class="desc"><strong>Description:</strong><br>{{ c.description }}</p>
          </div>
          <div class="card-actions">
            <button class="btn-back" routerLink="/">← Back Dashboard</button>
            <button class="btn-edit" (click)="goToEdit(c.id)">✏️ Edit Course</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-container { padding: 40px; display: flex; justify-content: center; font-family: sans-serif;}
    .card { background: white; border-radius: 12px; width: 100%; max-width: 700px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 30px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    h2 { color: #011627; margin: 0; }
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
    .active { background: #e8f5e9; color: #2e7d32; }
    .draft { background: #fff3e0; color: #ef6c00; }
    .archived { background: #ffebee; color: #c62828; }
    hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
    .card-body p { margin: 12px 0; font-size: 16px; color: #333; }
    .desc { background: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; }
    .card-actions { display: flex; justify-content: space-between; margin-top: 30px; }
    button { padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    .btn-back { background: #011627; color: white; }
    .btn-edit { background: #ff9f1c; color: white; }
  `]
})
export class CourseDetailComponent implements OnInit {
  course = signal<Course | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.course.set(this.courseService.getCourseById(id));
      if (!this.course()) this.router.navigate(['/']);
    }
  }

  goToEdit(id: string) {
    this.router.navigate(['/courses', id, 'edit']);
  }
}