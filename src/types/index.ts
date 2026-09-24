export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Academy {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  coverImage: string;
  logoImage: string;
  website?: string;
  instructorId: string;
  instructorName: string;
  instructorEmail?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
  courseCount?: number;
  studentCount?: number;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  academyId: string;
  academyName?: string;
  instructorId: string;
  instructorName: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  estimatedHours: number;
  price: number;
  coverImage: string;
  learningObjectives: string[];
  requirements: string[];
  published: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LessonAttachment {
  name: string;
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  academyId?: string;
  order: number;
  title: string;
  description: string;
  content: string;
  durationMinutes: number;
  videoUrl: string;
  attachments?: LessonAttachment[];
  isFreePreview?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  courseCover: string;
  academyId: string;
  academyName: string;
  enrolledAt: string;
  completedLessons: string[]; // array of lesson IDs
  progressPercent: number;
  completed: boolean;
  completedAt?: string;
  lastAccessedAt?: string;
}

export interface Review {
  id: string;
  courseId: string;
  academyId?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
  totalAcademies: number;
  totalCourses: number;
  totalEnrollments: number;
  totalReviews: number;
}

export type ViewMode =
  | 'home'
  | 'academies'
  | 'academy_detail'
  | 'courses'
  | 'course_detail'
  | 'learning_player'
  | 'student_dashboard'
  | 'instructor_dashboard'
  | 'admin_dashboard';
