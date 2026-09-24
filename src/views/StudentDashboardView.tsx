import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { Course, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../services/dataService';
import { CertificateModal } from '../components/CertificateModal';

interface StudentDashboardViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onResumeCourse: (course: Course) => void;
  onNavigate: (path: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  courses,
  onSelectCourse,
  onResumeCourse,
  onNavigate,
}) => {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCertEnrollment, setSelectedCertEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchEnrollments() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const enrs = await getEnrollments(currentUser.id);
        if (isMounted) setEnrollments(enrs);
      } catch (e) {
        console.error('Failed to load enrollments:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEnrollments();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const completedCourses = enrollments.filter((e) => e.completed || e.progressPercent === 100);
  const inProgressCourses = enrollments.filter((e) => !e.completed && e.progressPercent < 100);

  const totalLessonsCompleted = enrollments.reduce(
    (acc, e) => acc + (e.completedLessons?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      {/* Student Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                currentUser?.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  currentUser?.displayName || 'User'
                )}`
              }
              alt={currentUser?.displayName}
              className="w-14 h-14 rounded-lg border border-slate-200 object-cover"
            />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Student Learning Portal
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Welcome back, {currentUser?.displayName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track your active curricula, lesson progress, and verified completion credentials.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/courses')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explore More Courses
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{enrollments.length}</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">
              Enrolled Courses
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">
              {completedCourses.length}
            </p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">
              Completed
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">
              {totalLessonsCompleted}
            </p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">
              Lessons Finished
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-500">{completedCourses.length}</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">
              Certificates
            </p>
          </div>
        </div>
      </div>

      {/* Ongoing / In-Progress Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            In-Progress Courses ({inProgressCourses.length})
          </h2>
        </div>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((enr) => {
              const matchedCourse = courses.find((c) => c.id === enr.courseId);
              return (
                <div
                  key={enr.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 transition"
                >
                  <div>
                    <div className="relative aspect-video rounded-md overflow-hidden mb-3 bg-slate-100">
                      <img
                        src={enr.courseCover}
                        alt={enr.courseTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {enr.academyName}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {enr.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {enr.completedLessons?.length || 0} modules completed
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-indigo-600">
                          {enr.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => matchedCourse && onSelectCourse(matchedCourse)}
                      className="text-xs text-slate-500 hover:text-slate-900 transition"
                    >
                      Syllabus
                    </button>
                    <button
                      onClick={() => matchedCourse && onResumeCourse(matchedCourse)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Resume
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-xs">
            You do not have any active course enrollments yet.
            <div className="mt-3">
              <button
                onClick={() => onNavigate('/courses')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500 transition"
              >
                Browse Course Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completed Courses & Certificates */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Completed Courses & Earned Certificates ({completedCourses.length})
        </h2>

        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((enr) => (
              <div
                key={enr.id}
                className="bg-white border border-amber-200 rounded-lg p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="relative aspect-video rounded-md overflow-hidden mb-3 bg-slate-100">
                    <img src={enr.courseCover} alt={enr.courseTitle} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Completed
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {enr.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Academy: {enr.academyName}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedCertEnrollment(enr)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5" />
                    View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-500 text-xs">
            Complete all modules of any course to earn your verified Certificate of Completion.
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertEnrollment && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCertEnrollment(null)}
          studentName={currentUser?.displayName || 'Learner'}
          courseTitle={selectedCertEnrollment.courseTitle}
          academyName={selectedCertEnrollment.academyName}
          completionDate={
            selectedCertEnrollment.completedAt
              ? new Date(selectedCertEnrollment.completedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : undefined
          }
        />
      )}
    </div>
  );
};