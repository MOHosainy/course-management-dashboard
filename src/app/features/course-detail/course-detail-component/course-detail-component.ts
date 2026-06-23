
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course-service';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail-component.html',
  styleUrl: './course-detail-component.scss'
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