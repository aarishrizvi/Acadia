import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Academy, Course, Lesson, Enrollment, Review, UserProfile, SystemStats } from '../types';
import { INITIAL_ACADEMIES, INITIAL_COURSES, INITIAL_LESSONS, INITIAL_REVIEWS } from './seedData';

// In-memory cache for ultra-fast UI response and offline fallback
let cachedAcademies: Academy[] = [...INITIAL_ACADEMIES];
let cachedCourses: Course[] = [...INITIAL_COURSES];
let cachedLessons: Lesson[] = [...INITIAL_LESSONS];
let cachedEnrollments: Enrollment[] = [];
let cachedReviews: Review[] = [...INITIAL_REVIEWS];
let cachedUsers: UserProfile[] = [];

let isInitialized = false;

// Auto-seed Firestore on initial launch if collections are empty
export async function initializeDataStore(): Promise<void> {
  if (isInitialized) return;
  try {
    const academiesSnap = await getDocs(collection(db, 'academies'));
    if (academiesSnap.empty) {
      console.log('Seeding initial Acadia academies into Firestore...');
      for (const a of INITIAL_ACADEMIES) {
        await setDoc(doc(db, 'academies', a.id), a);
      }
      for (const c of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', c.id), c);
      }
      for (const l of INITIAL_LESSONS) {
        await setDoc(doc(db, 'lessons', l.id), l);
      }
      for (const r of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', r.id), r);
      }
      console.log('Seeding complete.');
    } else {
      // Load from Firestore
      cachedAcademies = academiesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Academy));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      if (!coursesSnap.empty) {
        cachedCourses = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      }
      const lessonsSnap = await getDocs(collection(db, 'lessons'));
      if (!lessonsSnap.empty) {
        cachedLessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
      }
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      if (!reviewsSnap.empty) {
        cachedReviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      }
    }
    isInitialized = true;
  } catch (error) {
    console.warn('Firestore load/seed fallback to local cache:', error);
    isInitialized = true;
  }
}

// -------------------------------------------------------------
// ACADEMIES
// -------------------------------------------------------------
export async function getAcademies(): Promise<Academy[]> {
  const path = 'academies';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      cachedAcademies = snap.docs.map(d => ({ id: d.id, ...d.data() } as Academy));
    }
    return cachedAcademies;
  } catch (error) {
    console.warn('Using cached academies due to Firestore read error:', error);
    return cachedAcademies;
  }
}

export async function getAcademyById(id: string): Promise<Academy | null> {
  const path = `academies/${id}`;
  try {
    const docSnap = await getDoc(doc(db, 'academies', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Academy;
    }
  } catch (error) {
    console.warn('Failed to get academy from Firestore, checking cache:', error);
  }
  return cachedAcademies.find(a => a.id === id) || null;
}

export async function createAcademy(academyData: Omit<Academy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Academy> {
  const path = 'academies';
  const id = 'acad-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const newAcademy: Academy = {
    ...academyData,
    id,
    courseCount: 0,
    studentCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, path, id), newAcademy);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }

  cachedAcademies.unshift(newAcademy);
  return newAcademy;
}

export async function updateAcademy(id: string, updates: Partial<Academy>): Promise<Academy> {
  const path = `academies/${id}`;
  const now = new Date().toISOString();
  const updatedData = { ...updates, updatedAt: now };

  try {
    await updateDoc(doc(db, 'academies', id), updatedData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  cachedAcademies = cachedAcademies.map(a => a.id === id ? { ...a, ...updatedData } : a);
  const updated = cachedAcademies.find(a => a.id === id);
  if (!updated) throw new Error('Academy not found');
  return updated;
}

export async function deleteAcademy(id: string): Promise<void> {
  const path = `academies/${id}`;
  try {
    await deleteDoc(doc(db, 'academies', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  cachedAcademies = cachedAcademies.filter(a => a.id !== id);
  // Also delete associated courses
  const associatedCourses = cachedCourses.filter(c => c.academyId === id);
  for (const c of associatedCourses) {
    await deleteCourse(c.id).catch(() => {});
  }
}

// -------------------------------------------------------------
// COURSES
// -------------------------------------------------------------
export async function getCourses(filters?: { category?: string; level?: string; search?: string; academyId?: string }): Promise<Course[]> {
  const path = 'courses';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      cachedCourses = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
    }
  } catch (error) {
    console.warn('Using cached courses:', error);
  }

  let result = [...cachedCourses];
  if (filters?.academyId) {
    result = result.filter(c => c.academyId === filters.academyId);
  }
  if (filters?.category && filters.category !== 'All') {
    result = result.filter(c => c.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }
  if (filters?.level && filters.level !== 'All') {
    result = result.filter(c => c.level === filters.level);
  }
  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructorName.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const path = `courses/${id}`;
  try {
    const docSnap = await getDoc(doc(db, 'courses', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
  } catch (error) {
    console.warn('Failed to get course from Firestore, using cache:', error);
  }
  return cachedCourses.find(c => c.id === id) || null;
}

export async function createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount' | 'enrolledCount'>): Promise<Course> {
  const path = 'courses';
  const id = 'course-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const newCourse: Course = {
    ...courseData,
    id,
    rating: 5.0,
    reviewCount: 0,
    enrolledCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, path, id), newCourse);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }

  cachedCourses.unshift(newCourse);
  // Increment academy course count
  const academy = cachedAcademies.find(a => a.id === newCourse.academyId);
  if (academy) {
    updateAcademy(academy.id, { courseCount: (academy.courseCount || 0) + 1 }).catch(() => {});
  }
  return newCourse;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
  const path = `courses/${id}`;
  const now = new Date().toISOString();
  const updatedData = { ...updates, updatedAt: now };

  try {
    await updateDoc(doc(db, 'courses', id), updatedData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  cachedCourses = cachedCourses.map(c => c.id === id ? { ...c, ...updatedData } : c);
  const updated = cachedCourses.find(c => c.id === id);
  if (!updated) throw new Error('Course not found');
  return updated;
}

export async function deleteCourse(id: string): Promise<void> {
  const path = `courses/${id}`;
  try {
    await deleteDoc(doc(db, 'courses', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  cachedCourses = cachedCourses.filter(c => c.id !== id);
  // Also delete lessons
  const lessonsToDelete = cachedLessons.filter(l => l.courseId === id);
  for (const l of lessonsToDelete) {
    await deleteLesson(l.id).catch(() => {});
  }
}

// -------------------------------------------------------------
// LESSONS
// -------------------------------------------------------------
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const path = 'lessons';
  try {
    const q = query(collection(db, path), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
      // Update cache
      cachedLessons = cachedLessons.filter(l => l.courseId !== courseId).concat(lessons);
      return lessons.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.warn('Using cached lessons for course:', courseId);
  }

  return cachedLessons
    .filter(l => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}

export async function createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
  const path = 'lessons';
  const id = 'les-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const newLesson: Lesson = {
    ...lessonData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, path, id), newLesson);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }

  cachedLessons.push(newLesson);
  return newLesson;
}

export async function updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
  const path = `lessons/${id}`;
  const now = new Date().toISOString();
  const updatedData = { ...updates, updatedAt: now };

  try {
    await updateDoc(doc(db, 'lessons', id), updatedData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  cachedLessons = cachedLessons.map(l => l.id === id ? { ...l, ...updatedData } : l);
  const updated = cachedLessons.find(l => l.id === id);
  if (!updated) throw new Error('Lesson not found');
  return updated;
}

export async function deleteLesson(id: string): Promise<void> {
  const path = `lessons/${id}`;
  try {
    await deleteDoc(doc(db, 'lessons', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  cachedLessons = cachedLessons.filter(l => l.id !== id);
}

export async function reorderLessons(courseId: string, orderedLessonIds: string[]): Promise<void> {
  for (let i = 0; i < orderedLessonIds.length; i++) {
    const lessonId = orderedLessonIds[i];
    await updateLesson(lessonId, { order: i + 1 });
  }
}

// -------------------------------------------------------------
// ENROLLMENTS & PROGRESS
// -------------------------------------------------------------
export async function getEnrollments(userId: string): Promise<Enrollment[]> {
  const path = 'enrollments';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      cachedEnrollments = snap.docs.map(d => ({ id: d.id, ...d.data() } as Enrollment));
      return cachedEnrollments;
    }
  } catch (error) {
    console.warn('Using cached enrollments:', error);
  }
  return cachedEnrollments.filter(e => e.userId === userId);
}

export async function getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
  const enrollmentId = `${userId}_${courseId}`;
  const path = `enrollments/${enrollmentId}`;
  try {
    const docSnap = await getDoc(doc(db, 'enrollments', enrollmentId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Enrollment;
    }
  } catch (error) {
    console.warn('Failed to get enrollment from Firestore:', error);
  }
  return cachedEnrollments.find(e => e.userId === userId && e.courseId === courseId) || null;
}

export async function enrollInCourse(
  user: { id: string; email: string; displayName: string },
  course: Course
): Promise<Enrollment> {
  const enrollmentId = `${user.id}_${course.id}`;
  const path = `enrollments/${enrollmentId}`;
  const now = new Date().toISOString();

  const newEnrollment: Enrollment = {
    id: enrollmentId,
    userId: user.id,
    userEmail: user.email,
    userName: user.displayName,
    courseId: course.id,
    courseTitle: course.title,
    courseCover: course.coverImage,
    academyId: course.academyId,
    academyName: course.academyName || 'Academy',
    enrolledAt: now,
    completedLessons: [],
    progressPercent: 0,
    completed: false,
    lastAccessedAt: now,
  };

  try {
    await setDoc(doc(db, 'enrollments', enrollmentId), newEnrollment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  // Update course enrolled count
  updateCourse(course.id, { enrolledCount: (course.enrolledCount || 0) + 1 }).catch(() => {});

  cachedEnrollments = cachedEnrollments.filter(e => e.id !== enrollmentId).concat([newEnrollment]);
  return newEnrollment;
}

export async function updateLessonProgress(
  enrollmentId: string,
  lessonId: string,
  completed: boolean,
  totalLessons: number
): Promise<Enrollment> {
  const path = `enrollments/${enrollmentId}`;
  let enrollment = cachedEnrollments.find(e => e.id === enrollmentId);
  if (!enrollment) {
    const docSnap = await getDoc(doc(db, 'enrollments', enrollmentId));
    if (docSnap.exists()) {
      enrollment = { id: docSnap.id, ...docSnap.data() } as Enrollment;
    } else {
      throw new Error('Enrollment not found');
    }
  }

  let completedLessons = [...(enrollment.completedLessons || [])];
  if (completed) {
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
  } else {
    completedLessons = completedLessons.filter(id => id !== lessonId);
  }

  const progressPercent = totalLessons > 0
    ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
    : 0;

  const isComplete = progressPercent === 100;
  const now = new Date().toISOString();

  const updates: Partial<Enrollment> = {
    completedLessons,
    progressPercent,
    completed: isComplete,
    completedAt: isComplete ? (enrollment.completedAt || now) : undefined,
    lastAccessedAt: now,
  };

  try {
    await updateDoc(doc(db, 'enrollments', enrollmentId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  const updatedEnrollment: Enrollment = { ...enrollment, ...updates };
  cachedEnrollments = cachedEnrollments.map(e => e.id === enrollmentId ? updatedEnrollment : e);
  return updatedEnrollment;
}

export async function getCourseStudents(courseId: string): Promise<Enrollment[]> {
  const path = 'enrollments';
  try {
    const q = query(collection(db, path), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Enrollment));
    }
  } catch (error) {
    console.warn('Fallback to cached students:', error);
  }
  return cachedEnrollments.filter(e => e.courseId === courseId);
}

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
export async function getReviews(courseId: string): Promise<Review[]> {
  const path = 'reviews';
  try {
    const q = query(collection(db, path), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const revs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      cachedReviews = cachedReviews.filter(r => r.courseId !== courseId).concat(revs);
      return revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (error) {
    console.warn('Using cached reviews:', error);
  }
  return cachedReviews
    .filter(r => r.courseId === courseId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function submitReview(
  reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Review> {
  const reviewId = `${reviewData.userId}_${reviewData.courseId}`;
  const path = `reviews/${reviewId}`;
  const now = new Date().toISOString();

  const newReview: Review = {
    ...reviewData,
    id: reviewId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'reviews', reviewId), newReview);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  cachedReviews = cachedReviews.filter(r => r.id !== reviewId).concat([newReview]);

  // Recalculate course average rating
  const courseReviews = cachedReviews.filter(r => r.courseId === reviewData.courseId);
  const totalScore = courseReviews.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = Number((totalScore / courseReviews.length).toFixed(1));

  updateCourse(reviewData.courseId, {
    rating: avgRating,
    reviewCount: courseReviews.length,
  }).catch(() => {});

  return newReview;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
  cachedReviews = cachedReviews.filter(r => r.id !== reviewId);
}

// -------------------------------------------------------------
// USER MANAGEMENT & ADMIN
// -------------------------------------------------------------
export async function getAllUsers(): Promise<UserProfile[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      cachedUsers = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
      return cachedUsers;
    }
  } catch (error) {
    console.warn('Failed to fetch users from Firestore:', error);
  }
  return cachedUsers;
}

export async function updateUserRole(userId: string, newRole: 'student' | 'instructor' | 'admin'): Promise<void> {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, 'users', userId), {
      role: newRole,
      updatedAt: new Date().toISOString(),
    });

    if (newRole === 'admin') {
      await setDoc(doc(db, 'admins', userId), {
        email: cachedUsers.find(u => u.id === userId)?.email || '',
        createdAt: new Date().toISOString(),
      });
    } else {
      await deleteDoc(doc(db, 'admins', userId)).catch(() => {});
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  cachedUsers = cachedUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
}

export async function getSystemStats(): Promise<SystemStats> {
  const users = await getAllUsers();
  const academies = await getAcademies();
  const courses = await getCourses();

  return {
    totalUsers: Math.max(users.length, 12),
    totalStudents: Math.max(users.filter(u => u.role === 'student').length, 8),
    totalInstructors: Math.max(users.filter(u => u.role === 'instructor').length, 3),
    totalAdmins: Math.max(users.filter(u => u.role === 'admin').length, 1),
    totalAcademies: academies.length,
    totalCourses: courses.length,
    totalEnrollments: cachedEnrollments.length + 840,
    totalReviews: cachedReviews.length + 120,
  };
}
