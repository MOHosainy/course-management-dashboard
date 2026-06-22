// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-course-form-component',
//   imports: [],
//   templateUrl: './course-form-component.html',
//   styleUrl: './course-form-component.scss',
// })
// export class CourseFormComponent {}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { CourseService } from '../../core/services/course.service';
import { CourseService } from '../../../core/services/course-service';


@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode() ? 'Edit Course' : 'Create New Course' }}</h2>
      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
        
        <div class="form-group">
          <label>Course Name</label>
          <input type="text" formControlName="name" />
          @if (courseForm.get('name')?.touched && courseForm.get('name')?.invalid) {
            <small class="error">Course name is required (min 3 chars).</small>
          }
        </div>

        <div class="form-group">
          <label>Instructor</label>
          <input type="text" formControlName="instructor" />
          @if (courseForm.get('instructor')?.touched && courseForm.get('instructor')?.invalid) {
            <small class="error">Instructor name is required.</small>
          }
        </div>

        <div class="form-group">
          <label>Duration</label>
          <input type="text" formControlName="duration" placeholder="e.g. 30 hours" />
          @if (courseForm.get('duration')?.touched && courseForm.get('duration')?.invalid) {
            <small class="error">Duration is required.</small>
          }
        </div>

        <div class="form-group">
          <label>Status</label>
          <select formControlName="status">
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea formControlName="description" rows="4"></textarea>
          @if (courseForm.get('description')?.touched && courseForm.get('description')?.invalid) {
            <small class="error">Description must be at least 10 characters long.</small>
          }
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" routerLink="/">Cancel</button>
          <button type="submit" class="btn-submit" [disabled]="courseForm.invalid">Save Course</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 40px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: sans-serif; }
    h2 { color: #011627; margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; display: flex; flex-direction: column; }
    label { font-weight: bold; margin-bottom: 6px; color: #555; }
    input, select, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 15px; }
    input:focus, select:focus, textarea:focus { border-color: #2ec4b6; outline: none; }
    .error { color: #e71d36; font-size: 12px; margin-top: 4px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
    button { padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .btn-cancel { background: #e0e0e0; color: #333; }
    .btn-submit { background: #2ec4b6; color: white; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  courseId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {
    this.initForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.courseId.set(id);
      const course = this.courseService.getCourseById(id);
      if (course) {
        this.courseForm.patchValue(course);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  private initForm() {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      instructor: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      status: ['Draft', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    if (this.isEditMode()) {
      this.courseService.updateCourse(this.courseId()!, this.courseForm.value);
    } else {
      this.courseService.addCourse(this.courseForm.value);
    }
    this.router.navigate(['/']);
  }
}