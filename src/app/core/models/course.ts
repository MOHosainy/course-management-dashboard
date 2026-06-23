export interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: string; 
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  // createdAt: Date;
  category: string;    
  price: number;       
  createDate: string;  
  createdAt?: string;
}

export type CourseFilter = 'All' | 'Active' | 'Draft' | 'Archived';