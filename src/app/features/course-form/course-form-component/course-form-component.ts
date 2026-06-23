import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course-service';


@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './course-form-component.html',
  styleUrl: './course-form-component.scss'
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
  ) { this.initForm(); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.courseId.set(id);
      const course = this.courseService.getCourseById(id);
      if (course) this.courseForm.patchValue(course);
      else this.router.navigate(['/']);
    }
  }

  private initForm() {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      instructor: ['', [Validators.required]],
      category: ['', [Validators.required]], // حقل القسم الجديد
      price: [0, [Validators.required, Validators.min(0)]], // حقل السعر الجديد
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
      // عند الإضافة نترك الـ Service تولد الـ id والـ createDate تلقائياً
      this.courseService.addCourse({
        ...this.courseForm.value,
        createDate: new Date().toISOString()
      });
    }
    this.router.navigate(['/']);
  }
}