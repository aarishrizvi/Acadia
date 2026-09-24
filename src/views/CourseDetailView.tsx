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
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Course, Lesson, Review, Academy, ViewMode } from '../types';
import { useAuth } from '../context/AuthContext';
import { getLessons, getReviews, enrollInCourse, getEnrollment } from '../services/dataService';
import { ReviewModal } from '../components/ReviewModal';

interface CourseDetailViewProps {
  course: Course;
  academy?: Academy | null;
  onBack: () => void;
  onStartLearning: (course: Course, lessonId?: string) => void;
  onSelectAcademy: (academy: Academy) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  academy,
  onBack,
  onStartLearning,
  onSelectAcademy,
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
      alert('Please sign in or select a demo user profile from the top right navigation to enroll.');
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
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-white transition px-2 py-1 rounded bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Courses
        </button>
        <span>/</span>
        {academy && (
          <button
            onClick={() => onSelectAcademy(academy)}
            className="hover:text-indigo-300 transition"
          >
            {academy.name}
          </button>
        )}
        <span>/</span>
        <span className="text-slate-300 font-medium truncate max-w-xs">{course.title}</span>
      </div>

      {/* Main Grid: Left Content (2 cols) & Right Sticky Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Title Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {course.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {course.level} Level
              </span>
              {academy && (
                <button
                  onClick={() => onSelectAcademy(academy)}
                  className="text-xs font-semibold text-emerald-400 hover:underline px-2"
                >
                  Hosted by {academy.name}
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              {course.subtitle}
            </p>

            {/* Quick Metrics Ticker */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-500 font-normal">({course.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{lessons.length} Structured Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{totalHours} Total Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-sky-400" />
                <span>Instructor: {course.instructorName}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            {[
              { id: 'syllabus', label: `Curriculum (${lessons.length})` },
              { id: 'overview', label: 'Overview & Objectives' },
              { id: 'instructor', label: 'Academy & Instructor' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition border-b-2 -mb-1 ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-indigo-500 bg-slate-900/60'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Curriculum / Syllabus */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Course Syllabus</h3>
                <span className="text-xs text-slate-400">
                  {lessons.length} Modules &bull; {totalHours} Hours
                </span>
              </div>

              {lessons.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No lessons published for this course yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => {
                    const isExpanded = expandedLessonId === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition"
                      >
                        <div
                          onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                {lesson.title}
                                {lesson.isFreePreview && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                    Free Preview
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">{lesson.durationMinutes} minutes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {(isEnrolled || lesson.isFreePreview) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartLearning(course, lesson.id);
                                }}
                                className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition flex items-center gap-1"
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
                          <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                            <p className="text-slate-400">{lesson.description}</p>
                            {lesson.attachments && lesson.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                                <span className="text-slate-500">Includes attachments:</span>
                                {lesson.attachments.map((att, attIdx) => (
                                  <span
                                    key={attIdx}
                                    className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[11px] text-indigo-300 flex items-center gap-1"
                                  >
                                    <FileText className="w-3 h-3" />
                                    {att.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Overview & Objectives */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-3">About This Course</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* What you'll learn */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">What You Will Master</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-3">Prerequisites &amp; Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Academy & Instructor */}
          {activeTab === 'instructor' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xl font-bold text-indigo-400">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{course.instructorName}</h3>
                    <p className="text-xs text-indigo-400 font-medium">Verified Domain Instructor</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Principal practitioner and educator at {academy?.name || 'Acadia'}. Specializing in modern scalable engineering, system performance, and hands-on developer training.
                </p>
              </div>

              {academy && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Parent Academy</span>
                      <h4 className="text-base font-bold text-white">{academy.name}</h4>
                    </div>
                    <button
                      onClick={() => onSelectAcademy(academy)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                    >
                      View Academy
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">{academy.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Student Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(course.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white">{course.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({reviews.length} reviews)</span>
                  </div>
                </div>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Write a Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No reviews submitted yet. Be the first to share your thoughts!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.userId}`}
                            alt={rev.userName}
                            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{rev.userName}</p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sticky Enrollment Card */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 text-slate-200">
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                  <PlayCircle className="w-8 h-8 fill-white/80 text-transparent" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-white">Free</div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Instant Access
                </span>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => onStartLearning(course, lessons[0]?.id)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </button>
              )}

              <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Access to all {lessons.length} curriculum lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Certificate of Completion on 100% progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Downloadable source attachments &amp; notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Full lifetime access across all devices</span>
                </div>
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
