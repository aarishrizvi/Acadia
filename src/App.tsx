/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { AcademiesView } from './views/AcademiesView';
import { AcademyDetailView } from './views/AcademyDetailView';
import { LearningPlayerView } from './views/LearningPlayerView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { InstructorDashboardView } from './views/InstructorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { Course, Academy, ViewMode, Enrollment } from './types';
import { getAcademies, getCourses, getEnrollments } from './services/dataService';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

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

  const handleNavigate = (view: ViewMode, data?: any) => {
    setCurrentView(view);
    if (data?.search !== undefined) {
      setSearchQuery(data.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    const parentAcad = academies.find((a) => a.id === course.academyId) || null;
    setSelectedAcademy(parentAcad);
    setCurrentView('course_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAcademy = (academy: Academy) => {
    setSelectedAcademy(academy);
    setCurrentView('academy_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = (course: Course, lessonId?: string) => {
    setSelectedCourse(course);
    setSelectedLessonId(lessonId);
    setCurrentView('learning_player');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar is present on all views except learning_player for maximum focus */}
      {currentView !== 'learning_player' && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            academies={academies}
            courses={courses}
            onNavigate={handleNavigate}
            onSelectCourse={handleSelectCourse}
            onSelectAcademy={handleSelectAcademy}
          />
        )}

        {currentView === 'courses' && (
          <CoursesView
            courses={courses}
            initialSearch={searchQuery}
            onSelectCourse={handleSelectCourse}
            onNavigate={handleNavigate}
            enrolledCourseIds={enrolledCourseIds}
          />
        )}

        {currentView === 'course_detail' && selectedCourse && (
          <CourseDetailView
            course={selectedCourse}
            academy={selectedAcademy}
            onBack={() => handleNavigate('courses')}
            onStartLearning={handleStartLearning}
            onSelectAcademy={handleSelectAcademy}
          />
        )}

        {currentView === 'academies' && (
          <AcademiesView
            academies={academies}
            onSelectAcademy={handleSelectAcademy}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'academy_detail' && selectedAcademy && (
          <AcademyDetailView
            academy={selectedAcademy}
            courses={courses}
            onBack={() => handleNavigate('academies')}
            onSelectCourse={handleSelectCourse}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'learning_player' && selectedCourse && (
          <LearningPlayerView
            course={selectedCourse}
            initialLessonId={selectedLessonId}
            onBack={() => handleSelectCourse(selectedCourse)}
          />
        )}

        {currentView === 'student_dashboard' && (
          <StudentDashboardView
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onResumeCourse={(c) => handleStartLearning(c)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'instructor_dashboard' && <InstructorDashboardView />}

        {currentView === 'admin_dashboard' && <AdminDashboardView />}
      </main>

      {/* Footer is displayed on standard views */}
      {currentView !== 'learning_player' && <Footer onNavigate={handleNavigate} />}
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
