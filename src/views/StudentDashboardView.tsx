import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Course, Enrollment, ViewMode } from '../types';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../services/dataService';
import { CertificateModal } from '../components/CertificateModal';

interface StudentDashboardViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onResumeCourse: (course: Course) => void;
  onNavigate: (view: ViewMode) => void;
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
      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id}`}
              alt={currentUser?.displayName}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-500/50 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                  Student Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {currentUser?.displayName}!
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Continue your technical journey and master modular curricula.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <BookOpen className="w-4 h-4" />
            Discover New Courses
          </button>
        </div>

        {/* Metrics Ticker */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <p className="text-2xl font-black text-white">{enrollments.length}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
              Enrolled Courses
            </p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <p className="text-2xl font-black text-emerald-400">{completedCourses.length}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
              Completed Courses
            </p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <p className="text-2xl font-black text-indigo-400">{totalLessonsCompleted}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
              Lessons Mastered
            </p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <p className="text-2xl font-black text-amber-400">{completedCourses.length}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">
              Certificates Earned
            </p>
          </div>
        </div>
      </div>

      {/* Ongoing / In-Progress Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Courses in Progress ({inProgressCourses.length})
        </h2>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((enr) => {
              const matchedCourse = courses.find((c) => c.id === enr.courseId);
              return (
                <div
                  key={enr.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                      <img
                        src={enr.courseCover || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'}
                        alt={enr.courseTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/90 text-indigo-300">
                        {enr.academyName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-2">
                      {enr.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {enr.completedLessons?.length || 0} lessons finished
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-emerald-400">{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => matchedCourse && onSelectCourse(matchedCourse)}
                      className="text-xs text-slate-400 hover:text-white transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => matchedCourse && onResumeCourse(matchedCourse)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
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
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            You do not have any courses in progress right now.
            <div className="mt-3">
              <button
                onClick={() => onNavigate('courses')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completed Courses & Certificates */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Completed Courses &amp; Certificates ({completedCourses.length})
        </h2>

        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((enr) => (
              <div
                key={enr.id}
                className="bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                    <img
                      src={enr.courseCover}
                      alt={enr.courseTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40" />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Completed
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {enr.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Academy: {enr.academyName}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => setSelectedCertEnrollment(enr)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20"
                  >
                    <Award className="w-4 h-4" />
                    View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            Complete 100% of any course curriculum to unlock your verified Certificate of Completion!
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
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
