import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  FileText,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Course, Lesson, Review, Academy } from '../types';
import { useAuth } from '../context/AuthContext';
import { getLessons, getReviews, enrollInCourse, getEnrollment } from '../services/dataService';
import { ReviewModal } from '../components/ReviewModal';

interface CourseDetailViewProps {
  course: Course;
  academy?: Academy | null;
  onBack: () => void;
  onStartLearning: (course: Course, lessonId?: string) => void;
  onSelectAcademy: (academy: Academy) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  academy,
  onBack,
  onStartLearning,
  onSelectAcademy,
  onOpenAuth,
}) => {
  const { currentUser } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'overview' | 'instructor' | 'reviews'>('syllabus');
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [loadedLessons, loadedReviews] = await Promise.all([
          getLessons(course.id),
          getReviews(course.id),
        ]);
        if (isMounted) {
          setLessons(loadedLessons);
          setReviews(loadedReviews);
          if (loadedLessons.length > 0) {
            setExpandedLessonId(loadedLessons[0].id);
          }
        }

        if (currentUser) {
          const enrollment = await getEnrollment(currentUser.id, course.id);
          if (isMounted && enrollment) {
            setIsEnrolled(true);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [course.id, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      onOpenAuth('register');
      return;
    }

    setEnrolling(true);
    try {
      await enrollInCourse(
        { id: currentUser.id, email: currentUser.email, displayName: currentUser.displayName },
        course
      );
      setIsEnrolled(true);
      onStartLearning(course, lessons[0]?.id);
    } catch (err: any) {
      console.error('Enrollment error:', err);
      alert('Failed to enroll: ' + (err.message || 'Please try again'));
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  const totalMinutes = lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const totalHours = Math.round(totalMinutes / 60) || course.estimatedHours || 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Courses
        </button>
        <span>/</span>
        {academy && (
          <button
            onClick={() => onSelectAcademy(academy)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {academy.name}
          </button>
        )}
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {course.title}
        </span>
      </div>

      {/* Main Grid: Left Content (2 cols) & Right Sticky Card (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Title Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {course.category}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {course.level} Level
              </span>
              {academy && (
                <button
                  onClick={() => onSelectAcademy(academy)}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                  Hosted by {academy.name}
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.subtitle}
            </p>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({course.reviewCount} ratings)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{lessons.length} Modules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{totalHours} Total Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Author: {course.instructorName}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
            {[
              { id: 'syllabus', label: `Curriculum (${lessons.length})` },
              { id: 'overview', label: 'Objectives & Prerequisites' },
              { id: 'instructor', label: 'Instructor & Academy' },
              { id: 'reviews', label: `Ratings (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-md transition border-b-2 -mb-1 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 bg-white dark:bg-slate-900'
                    : 'text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Syllabus */}
          {activeTab === 'syllabus' && (
            <div className="space-y-3">
              {lessons.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                  No lessons published for this course yet.
                </div>
              ) : (
                lessons.map((lesson, idx) => {
                  const isExpanded = expandedLessonId === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition"
                    >
                      <div
                        onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                        className="p-4 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              {lesson.title}
                              {lesson.isFreePreview && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  Preview Available
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {lesson.durationMinutes} minutes
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {(isEnrolled || lesson.isFreePreview) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartLearning(course, lesson.id);
                              }}
                              className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition flex items-center gap-1"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              {isEnrolled ? 'Open' : 'Preview'}
                            </button>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                          <p>{lesson.description}</p>
                          {lesson.attachments && lesson.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                              <span className="text-slate-400">Attachments:</span>
                              {lesson.attachments.map((att, attIdx) => (
                                <span
                                  key={attIdx}
                                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3 text-slate-400" />
                                  {att.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Overview & Objectives */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Course Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  What You Will Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Instructor & Academy */}
          {activeTab === 'instructor' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {course.instructorName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Verified Instructor</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Technical practitioner at {academy?.name || 'Acadia Academy'}. Specializing in
                  scalable architecture, systems design, and hands-on developer training.
                </p>
              </div>

              {academy && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Academy
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {academy.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onSelectAcademy(academy)}
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
                    >
                      Academy Profile
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{academy.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Student Reviews
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(course.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {course.rating.toFixed(1)} out of 5
                    </span>
                    <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
                  </div>
                </div>

                {isEnrolled && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Leave Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                  No reviews submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.userName}`}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {rev.userName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rev.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Sticky Card */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm p-5 space-y-4">
            <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <PlayCircle className="w-10 h-10 text-white/90" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">Free</span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Full Curriculum Access
              </span>
            </div>

            {isEnrolled ? (
              <button
                onClick={() => onStartLearning(course, lessons[0]?.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                Continue Learning
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-md shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lessons.length} structured modules &amp; video walkthroughs</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Certificate of Completion on 100% progress</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Source code attachments &amp; lesson notes</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Direct student-instructor review channel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        course={course}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
