import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Volume2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  BookOpen,
  Award,
  Sparkles,
  Menu,
  X,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { Course, Lesson, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getLessons,
  getEnrollment,
  enrollInCourse,
  updateLessonProgress
} from '../services/dataService';
import { CertificateModal } from '../components/CertificateModal';
import confetti from 'canvas-confetti';

interface LearningPlayerViewProps {
  course: Course;
  initialLessonId?: string;
  onBack: () => void;
}

export const LearningPlayerView: React.FC<LearningPlayerViewProps> = ({
  course,
  initialLessonId,
  onBack,
}) => {
  const { currentUser } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'attachments' | 'notepad'>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load curriculum and enrollment
  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      try {
        const loadedLessons = await getLessons(course.id);
        if (!isMounted) return;
        setLessons(loadedLessons);

        let active = loadedLessons.find((l) => l.id === initialLessonId) || loadedLessons[0] || null;
        setCurrentLesson(active);

        if (currentUser) {
          let enr = await getEnrollment(currentUser.id, course.id);
          if (!enr) {
            // Auto-enroll if not yet enrolled
            enr = await enrollInCourse(
              { id: currentUser.id, email: currentUser.email, displayName: currentUser.displayName },
              course
            );
          }
          if (isMounted) setEnrollment(enr);
        }
      } catch (err) {
        console.error('Failed to initialize learning player:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [course.id, initialLessonId, currentUser]);

  // Load saved personal notes for this lesson
  useEffect(() => {
    if (currentLesson) {
      const key = `acadia_notes_${course.id}_${currentLesson.id}`;
      setPersonalNotes(localStorage.getItem(key) || '');
    }
  }, [currentLesson?.id]);

  const handleSaveNotes = (val: string) => {
    setPersonalNotes(val);
    if (currentLesson) {
      localStorage.setItem(`acadia_notes_${course.id}_${currentLesson.id}`, val);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons?.includes(lessonId) || false;
  };

  const handleToggleCompletion = async () => {
    if (!currentLesson || !enrollment) return;
    const currentlyDone = isLessonCompleted(currentLesson.id);
    const updated = await updateLessonProgress(
      enrollment.id,
      currentLesson.id,
      !currentlyDone,
      lessons.length
    );
    setEnrollment(updated);

    if (!currentlyDone && updated.progressPercent === 100) {
      // 100% completion celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      setCertificateOpen(true);
    }
  };

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) setCurrentLesson(lessons[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) setCurrentLesson(lessons[currentIndex + 1]);
  };

  if (loading || !currentLesson) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading learning player &amp; curriculum...</p>
        </div>
      </div>
    );
  }

  const progress = enrollment?.progressPercent || 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Player Navigation Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Course</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {course.title}
            </h2>
            <p className="text-[10px] text-slate-400">
              Module {currentIndex + 1} of {lessons.length}: {currentLesson.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">{progress}%</span>
          </div>

          {/* Certificate Button if 100% */}
          {progress === 100 && (
            <button
              onClick={() => setCertificateOpen(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition animate-pulse"
            >
              <Award className="w-3.5 h-3.5" />
              Certificate
            </button>
          )}

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Toggle Curriculum Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Lesson Content & Right Collapsible Curriculum */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Lesson Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player Box */}
          <div className="w-full bg-black aspect-video max-h-[55vh] flex items-center justify-center relative group select-none">
            {currentLesson.videoUrl && currentLesson.videoUrl.includes('youtube.com') ? (
              <iframe
                src={`${currentLesson.videoUrl}?autoplay=0`}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
                <img
                  src={course.coverImage}
                  alt={currentLesson.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative z-10 text-center space-y-3 p-4">
                  <div
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white flex items-center justify-center mx-auto shadow-2xl transition hover:scale-105"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </div>
                  <p className="text-sm font-bold text-white">{currentLesson.title}</p>
                  <p className="text-xs text-slate-400">
                    High-Definition Technical Walkthrough &bull; {currentLesson.durationMinutes} min
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Actions Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Lesson {currentIndex + 1}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {currentLesson.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">{currentLesson.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleCompletion}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  isLessonCompleted(currentLesson.id)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isLessonCompleted(currentLesson.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lesson Content Tabs */}
          <div className="p-4 sm:p-6 flex-1 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 -mb-1 flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Lesson Notes &amp; Code
              </button>
              <button
                onClick={() => setActiveTab('attachments')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 -mb-1 flex items-center gap-1.5 ${
                  activeTab === 'attachments'
                    ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Resources ({currentLesson.attachments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('notepad')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 -mb-1 flex items-center gap-1.5 ${
                  activeTab === 'notepad'
                    ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                My Private Notes
              </button>
            </div>

            {/* Tab 1: Formatted Lesson Notes */}
            {activeTab === 'notes' && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed space-y-4">
                <div className="prose prose-invert max-w-none">
                  {currentLesson.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('## ')) {
                      return (
                        <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                          {para.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (para.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-sm font-bold text-indigo-300 mt-3 mb-1">
                          {para.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (para.startsWith('```')) {
                      const cleanCode = para.replace(/```[a-z]*\n?/g, '');
                      return (
                        <pre
                          key={i}
                          className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto my-3"
                        >
                          <code>{cleanCode}</code>
                        </pre>
                      );
                    }
                    return (
                      <p key={i} className="text-slate-300 text-xs sm:text-sm">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Attachments */}
            {activeTab === 'attachments' && (
              <div className="space-y-3">
                {currentLesson.attachments && currentLesson.attachments.length > 0 ? (
                  currentLesson.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{att.name}</p>
                          <p className="text-[10px] text-slate-500">{att.size || 'Downloadable file'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Downloaded resource: ${att.name}`);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
                    No attachments uploaded for this module.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Notepad */}
            {activeTab === 'notepad' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Notes are stored automatically and associated with this specific lesson.
                </p>
                <textarea
                  rows={8}
                  value={personalNotes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  placeholder="Record your thoughts, code ideas, questions, or key takeaways..."
                  className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
                />
              </div>
            )}
          </div>

          {/* Bottom Lesson Step Footer */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between mt-auto">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Lesson
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Module {currentIndex + 1} / {lessons.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Collapsible Curriculum Drawer */}
        {sidebarOpen && (
          <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-10 animate-fadeIn">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Course Syllabus ({lessons.length})
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {lessons.map((lesson, idx) => {
                const isActive = lesson.id === currentLesson.id;
                const isDone = isLessonCompleted(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer select-none transition ${
                      isActive
                        ? 'bg-indigo-950/50 border-l-4 border-indigo-500 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] text-slate-500 font-mono">Module {idx + 1}</span>
                        <span className="text-[10px] text-slate-500">{lesson.durationMinutes}m</span>
                      </div>
                      <p
                        className={`text-xs font-medium truncate mt-0.5 ${
                          isActive ? 'text-indigo-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        studentName={currentUser?.displayName || 'Learner'}
        courseTitle={course.title}
        academyName={course.academyName || 'Acadia Academy'}
      />
    </div>
  );
};
