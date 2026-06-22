// export interface Course {}
export interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: string; // e.g., '40 hours'
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  createdAt: Date;
}

export type CourseFilter = 'All' | 'Active' | 'Draft' | 'Archived';