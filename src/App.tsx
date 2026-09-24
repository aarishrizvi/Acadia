/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AccessDenied } from './components/AccessDenied';
import { LandingPage } from './views/LandingPage';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { AcademiesView } from './views/AcademiesView';
import { AcademyDetailView } from './views/AcademyDetailView';
import { LearningPlayerView } from './views/LearningPlayerView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { InstructorDashboardView } from './views/InstructorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { Course, Academy, Enrollment, UserProfile } from './types';
import { getAcademies, getCourses, getEnrollments } from './services/dataService';

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAcademyId, setSelectedAcademyId] = useState<string | null>(null);
  const [learningLessonId, setLearningLessonId] = useState<string | undefined>(undefined);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<'student' | 'instructor'>('student');

  // Handle URL history state & back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load platform data
  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      const [allAcademies, allCourses] = await Promise.all([
        getAcademies(),
        getCourses(),
      ]);
      setAcademies(allAcademies);
      setCourses(allCourses);

      if (currentUser) {
        const enrs = await getEnrollments(currentUser.id);
        setEnrolledCourseIds(enrs.map((e) => e.courseId));
      }
    } catch (err) {
      console.error('Error fetching global platform data:', err);
    }
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', role: 'student' | 'instructor' = 'student') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    // Automatically redirect based on authenticated user's real role
    if (profile.role === 'admin') {
      navigateTo('/admin');
    } else if (profile.role === 'instructor') {
      navigateTo('/studio');
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    navigateTo(`/courses/${course.id}`);
  };

  const handleSelectAcademy = (academy: Academy) => {
    setSelectedAcademyId(academy.id);
    navigateTo(`/academies/${academy.id}`);
  };

  const handleStartLearning = (course: Course, lessonId?: string) => {
    setSelectedCourseId(course.id);
    setLearningLessonId(lessonId);
    navigateTo(`/learn/${course.id}`);
  };

  // Derive active entities based on currentPath
  const activeCourse = useMemo(() => {
    if (currentPath.startsWith('/courses/') || currentPath.startsWith('/learn/')) {
      const id = currentPath.split('/')[2];
      return courses.find((c) => c.id === id) || courses.find((c) => c.id === selectedCourseId) || null;
    }
    return courses.find((c) => c.id === selectedCourseId) || null;
  }, [currentPath, courses, selectedCourseId]);

  const activeAcademy = useMemo(() => {
    if (currentPath.startsWith('/academies/')) {
      const id = currentPath.split('/')[2];
      return academies.find((a) => a.id === id) || academies.find((a) => a.id === selectedAcademyId) || null;
    }
    if (activeCourse) {
      return academies.find((a) => a.id === activeCourse.academyId) || null;
    }
    return academies.find((a) => a.id === selectedAcademyId) || null;
  }, [currentPath, academies, activeCourse, selectedAcademyId]);

  const isLearningPlayerView = currentPath.startsWith('/learn/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      {!isLearningPlayerView && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Verifying session credentials...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Public: Landing Page */}
            {currentPath === '/' && (
              <LandingPage
                academies={academies}
                courses={courses}
                onNavigate={navigateTo}
                onSelectCourse={handleSelectCourse}
                onSelectAcademy={handleSelectAcademy}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {/* Public: Courses Directory */}
            {currentPath === '/courses' && (
              <CoursesView
                courses={courses}
                onSelectCourse={handleSelectCourse}
                onNavigate={navigateTo}
                enrolledCourseIds={enrolledCourseIds}
              />
            )}

            {/* Public: Course Detail */}
            {currentPath.startsWith('/courses/') && activeCourse && (
              <CourseDetailView
                course={activeCourse}
                academy={activeAcademy}
                onBack={() => navigateTo('/courses')}
                onStartLearning={handleStartLearning}
                onSelectAcademy={handleSelectAcademy}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {/* Public: Academies Directory */}
            {currentPath === '/academies' && (
              <AcademiesView
                academies={academies}
                onSelectAcademy={handleSelectAcademy}
                onNavigate={navigateTo}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {/* Public: Academy Detail */}
            {currentPath.startsWith('/academies/') && activeAcademy && (
              <AcademyDetailView
                academy={activeAcademy}
                courses={courses}
                onBack={() => navigateTo('/academies')}
                onSelectCourse={handleSelectCourse}
                onNavigate={navigateTo}
              />
            )}

            {/* Protected Route: Student Dashboard (/dashboard) */}
            {currentPath === '/dashboard' && (
              currentUser ? (
                currentUser.role === 'instructor' ? (
                  <AccessDenied
                    requiredRole="student"
                    onNavigateHome={() => navigateTo('/studio')}
                    onOpenAuth={handleOpenAuth}
                  />
                ) : (
                  <StudentDashboardView
                    courses={courses}
                    onSelectCourse={handleSelectCourse}
                    onResumeCourse={(c) => handleStartLearning(c)}
                    onNavigate={navigateTo}
                  />
                )
              ) : (
                <AccessDenied
                  requiredRole="student"
                  onNavigateHome={() => navigateTo('/courses')}
                  onOpenAuth={handleOpenAuth}
                />
              )
            )}

            {/* Protected Route: Instructor Studio (/studio) */}
            {currentPath === '/studio' && (
              currentUser ? (
                currentUser.role === 'instructor' || currentUser.role === 'admin' ? (
                  <InstructorDashboardView />
                ) : (
                  <AccessDenied
                    requiredRole="instructor"
                    onNavigateHome={() => navigateTo('/dashboard')}
                    onOpenAuth={handleOpenAuth}
                  />
                )
              ) : (
                <AccessDenied
                  requiredRole="instructor"
                  onNavigateHome={() => navigateTo('/courses')}
                  onOpenAuth={handleOpenAuth}
                />
              )
            )}

            {/* Strictly Protected Route: Admin Portal (/admin) */}
            {currentPath === '/admin' && (
              currentUser && currentUser.role === 'admin' ? (
                <AdminDashboardView />
              ) : (
                <AccessDenied
                  requiredRole="admin"
                  onNavigateHome={() => navigateTo('/courses')}
                  onOpenAuth={handleOpenAuth}
                />
              )
            )}

            {/* Course Learning Player (/learn/:courseId) */}
            {currentPath.startsWith('/learn/') && activeCourse && (
              currentUser ? (
                <LearningPlayerView
                  course={activeCourse}
                  initialLessonId={learningLessonId}
                  onBack={() => handleSelectCourse(activeCourse)}
                />
              ) : (
                <AccessDenied
                  requiredRole="student"
                  onNavigateHome={() => navigateTo(`/courses/${activeCourse.id}`)}
                  onOpenAuth={handleOpenAuth}
                />
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {!isLearningPlayerView && <Footer onNavigate={navigateTo} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
