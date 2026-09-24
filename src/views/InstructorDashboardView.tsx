import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Plus,
  Users,
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  FileText,
  Video,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Academy, Course, Lesson, Enrollment, Review, CourseLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  getAcademies,
  createAcademy,
  updateAcademy,
  deleteAcademy,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseStudents,
  getReviews,
} from '../services/dataService';

export const InstructorDashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'academies' | 'lessons' | 'students' | 'reviews'>('courses');
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState<Enrollment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [academyModalOpen, setAcademyModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState<Academy | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Academy Form State
  const [academyName, setAcademyName] = useState('');
  const [academyTagline, setAcademyTagline] = useState('');
  const [academyCategory, setAcademyCategory] = useState('Software Engineering');
  const [academyDescription, setAcademyDescription] = useState('');
  const [academyCover, setAcademyCover] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80');
  const [academyLogo, setAcademyLogo] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80');
  const [academyWebsite, setAcademyWebsite] = useState('');

  // Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Software Engineering');
  const [courseLevel, setCourseLevel] = useState<CourseLevel>('Intermediate');
  const [courseHours, setCourseHours] = useState(10);
  const [courseCover, setCourseCover] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseAcademyId, setCourseAcademyId] = useState('');
  const [courseObjectives, setCourseObjectives] = useState('Build scalable systems\nMaster clean code');
  const [courseRequirements, setCourseRequirements] = useState('Basic JavaScript\nComputer with Node.js');
  const [coursePublished, setCoursePublished] = useState(true);

  // Lesson Form State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonDuration, setLessonDuration] = useState(25);
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [lessonIsPreview, setLessonIsPreview] = useState(false);

  useEffect(() => {
    loadInstructorData();
  }, [currentUser]);

  const loadInstructorData = async () => {
    setLoading(true);
    try {
      const [allAcademies, allCourses] = await Promise.all([
        getAcademies(),
        getCourses(),
      ]);
      setAcademies(allAcademies);
      setCourses(allCourses);

      if (allCourses.length > 0) {
        setSelectedCourseForLessons(allCourses[0]);
        const les = await getLessons(allCourses[0].id);
        setLessons(les);
        const studs = await getCourseStudents(allCourses[0].id);
        setSelectedCourseStudents(studs);
        const revs = await getReviews(allCourses[0].id);
        setReviews(revs);
      }
    } catch (err) {
      console.error('Error loading instructor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourseForLessons = async (c: Course) => {
    setSelectedCourseForLessons(c);
    const [les, studs, revs] = await Promise.all([
      getLessons(c.id),
      getCourseStudents(c.id),
      getReviews(c.id),
    ]);
    setLessons(les);
    setSelectedCourseStudents(studs);
    setReviews(revs);
  };

  // Academy Handlers
  const openNewAcademyModal = () => {
    setEditingAcademy(null);
    setAcademyName('');
    setAcademyTagline('');
    setAcademyCategory('Software Engineering');
    setAcademyDescription('');
    setAcademyCover('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80');
    setAcademyLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80');
    setAcademyWebsite('');
    setAcademyModalOpen(true);
  };

  const openEditAcademyModal = (a: Academy) => {
    setEditingAcademy(a);
    setAcademyName(a.name);
    setAcademyTagline(a.tagline);
    setAcademyCategory(a.category);
    setAcademyDescription(a.description);
    setAcademyCover(a.coverImage);
    setAcademyLogo(a.logoImage);
    setAcademyWebsite(a.website || '');
    setAcademyModalOpen(true);
  };

  const handleSaveAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAcademy) {
        const updated = await updateAcademy(editingAcademy.id, {
          name: academyName,
          tagline: academyTagline,
          category: academyCategory,
          description: academyDescription,
          coverImage: academyCover,
          logoImage: academyLogo,
          website: academyWebsite,
        });
        setAcademies(academies.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await createAcademy({
          name: academyName,
          tagline: academyTagline,
          category: academyCategory,
          description: academyDescription,
          coverImage: academyCover,
          logoImage: academyLogo,
          website: academyWebsite,
          instructorId: currentUser?.id || 'inst-user',
          instructorName: currentUser?.displayName || 'Instructor',
          instructorEmail: currentUser?.email,
          featured: false,
        });
        setAcademies([created, ...academies]);
      }
      setAcademyModalOpen(false);
    } catch (err: any) {
      alert('Error saving academy: ' + (err.message || err));
    }
  };

  const handleDeleteAcademy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this academy? All associated courses will also be removed.')) return;
    await deleteAcademy(id);
    setAcademies(academies.filter((a) => a.id !== id));
    setCourses(courses.filter((c) => c.academyId !== id));
  };

  // Course Handlers
  const openNewCourseModal = () => {
    setEditingCourse(null);
    setCourseTitle('');
    setCourseSubtitle('');
    setCourseCategory('Software Engineering');
    setCourseLevel('Intermediate');
    setCourseHours(12);
    setCourseCover('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80');
    setCourseDescription('');
    setCourseAcademyId(academies[0]?.id || '');
    setCourseObjectives('Master core architectural patterns\nImplement reliable data layers');
    setCourseRequirements('Basic programming literacy\nWeb development fundamentals');
    setCoursePublished(true);
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (c: Course) => {
    setEditingCourse(c);
    setCourseTitle(c.title);
    setCourseSubtitle(c.subtitle);
    setCourseCategory(c.category);
    setCourseLevel(c.level);
    setCourseHours(c.estimatedHours);
    setCourseCover(c.coverImage);
    setCourseDescription(c.description);
    setCourseAcademyId(c.academyId);
    setCourseObjectives(c.learningObjectives.join('\n'));
    setCourseRequirements(c.requirements.join('\n'));
    setCoursePublished(c.published);
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentAcademy = academies.find((a) => a.id === courseAcademyId) || academies[0];
    const objectivesArray = courseObjectives.split('\n').map((s) => s.trim()).filter(Boolean);
    const reqsArray = courseRequirements.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse.id, {
          title: courseTitle,
          subtitle: courseSubtitle,
          category: courseCategory,
          level: courseLevel,
          estimatedHours: courseHours,
          coverImage: courseCover,
          description: courseDescription,
          academyId: parentAcademy?.id || editingCourse.academyId,
          academyName: parentAcademy?.name || editingCourse.academyName,
          learningObjectives: objectivesArray,
          requirements: reqsArray,
          published: coursePublished,
        });
        setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCourse({
          title: courseTitle,
          slug: courseTitle.toLowerCase().replace(/\s+/g, '-'),
          subtitle: courseSubtitle,
          category: courseCategory,
          level: courseLevel,
          estimatedHours: courseHours,
          price: 0,
          coverImage: courseCover,
          description: courseDescription,
          academyId: parentAcademy?.id || 'academy-1',
          academyName: parentAcademy?.name || 'Acadia Academy',
          instructorId: currentUser?.id || 'inst-user',
          instructorName: currentUser?.displayName || 'Instructor',
          learningObjectives: objectivesArray,
          requirements: reqsArray,
          published: coursePublished,
          featured: false,
        });
        setCourses([created, ...courses]);
        if (!selectedCourseForLessons) setSelectedCourseForLessons(created);
      }
      setCourseModalOpen(false);
    } catch (err: any) {
      alert('Error saving course: ' + (err.message || err));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its lessons?')) return;
    await deleteCourse(id);
    setCourses(courses.filter((c) => c.id !== id));
    if (selectedCourseForLessons?.id === id) {
      const remaining = courses.filter((c) => c.id !== id);
      setSelectedCourseForLessons(remaining[0] || null);
    }
  };

  const handleTogglePublish = async (c: Course) => {
    const updated = await updateCourse(c.id, { published: !c.published });
    setCourses(courses.map((item) => (item.id === c.id ? updated : item)));
  };

  // Lesson Handlers
  const openNewLessonModal = () => {
    if (!selectedCourseForLessons) return;
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDescription('');
    setLessonContent(`## Introduction & Core Concepts\n\nWelcome to this lesson module.\n\n### Key Principles\n- Principle 1\n- Principle 2\n\n\`\`\`typescript\n// Example snippet\nconsole.log("Hello from Acadia LMS!");\n\`\`\``);
    setLessonDuration(25);
    setLessonVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    setLessonIsPreview(false);
    setLessonModalOpen(true);
  };

  const openEditLessonModal = (l: Lesson) => {
    setEditingLesson(l);
    setLessonTitle(l.title);
    setLessonDescription(l.description);
    setLessonContent(l.content);
    setLessonDuration(l.durationMinutes);
    setLessonVideoUrl(l.videoUrl);
    setLessonIsPreview(l.isFreePreview || false);
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLessons) return;

    try {
      if (editingLesson) {
        const updated = await updateLesson(editingLesson.id, {
          title: lessonTitle,
          description: lessonDescription,
          content: lessonContent,
          durationMinutes: lessonDuration,
          videoUrl: lessonVideoUrl,
          isFreePreview: lessonIsPreview,
        });
        setLessons(lessons.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const nextOrder = lessons.length + 1;
        const created = await createLesson({
          courseId: selectedCourseForLessons.id,
          academyId: selectedCourseForLessons.academyId,
          order: nextOrder,
          title: lessonTitle,
          description: lessonDescription,
          content: lessonContent,
          durationMinutes: lessonDuration,
          videoUrl: lessonVideoUrl,
          isFreePreview: lessonIsPreview,
          attachments: [
            { name: `${lessonTitle.replace(/\s+/g, '_')}_Cheatsheet.pdf`, url: '#', size: '1.2 MB' },
          ],
        });
        setLessons([...lessons, created]);
      }
      setLessonModalOpen(false);
    } catch (err: any) {
      alert('Error saving lesson: ' + (err.message || err));
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    await deleteLesson(id);
    setLessons(lessons.filter((l) => l.id !== id));
  };

  const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const newLessons = [...lessons];
    const temp = newLessons[index];
    newLessons[index] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    newLessons.forEach((l, i) => (l.order = i + 1));
    setLessons(newLessons);

    await Promise.all([
      updateLesson(newLessons[index].id, { order: index + 1 }),
      updateLesson(newLessons[targetIndex].id, { order: targetIndex + 1 }),
    ]);
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Instructor Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-slate-900 mt-0.5">
            Curriculum &amp; Academy Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academies, author courses, organize lesson content, and monitor student progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openNewAcademyModal}
            className="px-3.5 py-2 bg-white bg-slate-800 hover:bg-slate-50 hover:bg-slate-700 text-slate-700 text-slate-500 border border-slate-300 border-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Academy
          </button>
          <button
            onClick={openNewCourseModal}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Course
          </button>
        </div>
      </div>

      {/* Metrics Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-900 text-slate-900">{academies.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-1">Academies</p>
        </div>
        <div className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-indigo-600 text-indigo-600">{courses.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-1">Active Courses</p>
        </div>
        <div className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-600 text-emerald-600">{totalStudents}</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-1">Learners</p>
        </div>
        <div className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-500">4.9 ★</p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 border-slate-200 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
          { id: 'academies', label: `Academies (${academies.length})`, icon: Layers },
          { id: 'lessons', label: `Curriculum Builder (${lessons.length})`, icon: FileText },
          { id: 'students', label: `Student Roster (${selectedCourseStudents.length})`, icon: Users },
          { id: 'reviews', label: `Student Reviews (${reviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-md transition border-b-2 -mb-1 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-indigo-600 text-indigo-600 border-indigo-600 bg-white bg-white'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Courses Management */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 text-slate-900 uppercase tracking-wider">
              Authored Courses
            </h2>
            <button
              onClick={openNewCourseModal}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="relative aspect-video rounded-md overflow-hidden mb-3 bg-slate-100 bg-slate-800">
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course.category}
                    </span>
                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        course.published
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">{course.academyName}</p>
                  <h3 className="text-sm font-bold text-slate-900 text-slate-900 mt-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 text-slate-400 mt-1 line-clamp-2">
                    {course.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {course.enrolledCount} Students
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating.toFixed(1)} ({course.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleSelectCourseForLessons(course);
                      setActiveTab('lessons');
                    }}
                    className="text-xs text-indigo-600 text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    Edit Curriculum <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditCourseModal(course)}
                      className="p-1.5 rounded bg-slate-100 bg-slate-800 hover:bg-slate-200 hover:bg-slate-700 text-slate-600 text-slate-300"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 rounded bg-slate-100 bg-slate-800 hover:bg-rose-50 hover:bg-rose-50 text-slate-600 text-rose-400"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Academies Management */}
      {activeTab === 'academies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 text-slate-900 uppercase tracking-wider">
              Academy Profiles
            </h2>
            <button
              onClick={openNewAcademyModal}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              New Academy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academies.map((academy) => (
              <div
                key={academy.id}
                className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={academy.logoImage}
                      alt={academy.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 border-slate-700"
                    />
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 bg-slate-800 text-indigo-600 text-indigo-600">
                        {academy.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 text-slate-900 mt-1">
                        {academy.name}
                      </h3>
                      <p className="text-xs text-slate-500">{academy.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {academy.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 border-slate-200">
                    <span>Courses: {courses.filter((c) => c.academyId === academy.id).length}</span>
                    <span>Students: {academy.studentCount || 250}+</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditAcademyModal(academy)}
                    className="px-3 py-1.5 rounded bg-slate-100 bg-slate-800 text-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-200 hover:bg-slate-700 transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => handleDeleteAcademy(academy.id)}
                    className="px-3 py-1.5 rounded bg-slate-100 bg-slate-800 text-rose-600 text-rose-400 text-xs font-semibold hover:bg-rose-50 hover:bg-rose-50 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Curriculum / Lessons Builder & Reordering */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="bg-white bg-white border border-slate-200 border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold uppercase">Active Course:</span>
              <select
                value={selectedCourseForLessons?.id || ''}
                onChange={(e) => {
                  const found = courses.find((c) => c.id === e.target.value);
                  if (found) handleSelectCourseForLessons(found);
                }}
                className="bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 text-slate-900 text-slate-900 text-xs font-bold rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openNewLessonModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Module / Lesson
            </button>
          </div>

          <div className="space-y-2">
            {lessons.length > 0 ? (
              lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-4 hover:border-slate-300 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMoveLesson(idx, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 rounded bg-slate-100 bg-slate-800 hover:bg-slate-200 hover:bg-slate-700 disabled:opacity-20 text-slate-500"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveLesson(idx, 'down')}
                        disabled={idx === lessons.length - 1}
                        className="p-0.5 rounded bg-slate-100 bg-slate-800 hover:bg-slate-200 hover:bg-slate-700 disabled:opacity-20 text-slate-500"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-7 h-7 rounded bg-slate-100 bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 text-slate-300">
                      {lesson.order || idx + 1}
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 text-slate-900 flex items-center gap-2">
                        {lesson.title}
                        {lesson.isFreePreview && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 bg-emerald-50 text-emerald-700 text-emerald-700 border border-emerald-200 border-emerald-800">
                            Preview
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {lesson.durationMinutes} min &bull; {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditLessonModal(lesson)}
                      className="p-1.5 rounded bg-slate-100 bg-slate-800 hover:bg-slate-200 hover:bg-slate-700 text-slate-600 text-slate-300"
                      title="Edit Lesson"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-1.5 rounded bg-slate-100 bg-slate-800 hover:bg-rose-50 hover:bg-rose-50 text-rose-600 text-rose-400"
                      title="Delete Lesson"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white bg-white rounded-lg border border-slate-200 border-slate-200 text-slate-500 text-xs">
                No lessons added yet. Click "Add Module / Lesson" to structure the curriculum.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Students Roster */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 text-slate-900 uppercase tracking-wider">
              Enrolled Students ({selectedCourseStudents.length})
            </h2>
            <span className="text-xs text-slate-500">
              For: <span className="font-semibold text-slate-700 text-slate-300">{selectedCourseForLessons?.title}</span>
            </span>
          </div>

          <div className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 border-slate-200">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Enrollment Date</th>
                  <th className="p-3.5">Curriculum Progress</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 divide-slate-100 text-slate-700 text-slate-300">
                {selectedCourseStudents.length > 0 ? (
                  selectedCourseStudents.map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-50 hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 bg-indigo-50 text-indigo-600 text-indigo-600 font-bold flex items-center justify-center text-xs">
                            {stud.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-slate-900">{stud.userName}</p>
                            <p className="text-[11px] text-slate-400">{stud.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {new Date(stud.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span>{stud.completedLessons?.length || 0} modules</span>
                            <span className="font-bold text-indigo-600 text-indigo-600">
                              {stud.progressPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${stud.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        {stud.completed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 bg-emerald-50 text-emerald-700 text-emerald-700 border border-emerald-200 border-emerald-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 bg-indigo-50 text-indigo-700 text-indigo-700 border border-indigo-200 border-indigo-800">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                      No learners currently enrolled in this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 text-slate-900 uppercase tracking-wider">
            Student Feedback &amp; Ratings
          </h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white bg-white border border-slate-200 border-slate-200 rounded-lg p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 text-slate-900">{rev.userName}</p>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-300 text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 text-slate-500">{rev.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white bg-white rounded-lg border border-slate-200 border-slate-200 text-slate-500 text-xs">
              No reviews received for this course yet.
            </div>
          )}
        </div>
      )}

      {/* Modals for Academy, Course, Lesson */}
      {academyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white bg-white border border-slate-200 border-slate-200 rounded-lg shadow-xl p-6 text-slate-900 text-slate-900">
            <button
              onClick={() => setAcademyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 text-slate-900 mb-4">
              {editingAcademy ? 'Edit Academy Profile' : 'Establish New Academy'}
            </h3>
            <form onSubmit={handleSaveAcademy} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Academy Name</label>
                <input
                  type="text"
                  required
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={academyTagline}
                  onChange={(e) => setAcademyTagline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Category</label>
                <select
                  value={academyCategory}
                  onChange={(e) => setAcademyCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Design & UI/UX">Design &amp; UI/UX</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={academyDescription}
                  onChange={(e) => setAcademyDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAcademyModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 bg-slate-800 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-md shadow-sm"
                >
                  Save Academy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white bg-white border border-slate-200 border-slate-200 rounded-lg shadow-xl p-6 text-slate-900 text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCourseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 text-slate-900 mb-4">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Host Academy</label>
                  <select
                    value={courseAcademyId}
                    onChange={(e) => setCourseAcademyId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                  >
                    {academies.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Difficulty Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as CourseLevel)}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={courseSubtitle}
                  onChange={(e) => setCourseSubtitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={courseHours}
                    onChange={(e) => setCourseHours(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={courseCover}
                    onChange={(e) => setCourseCover(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={coursePublished}
                  onChange={(e) => setCoursePublished(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <label htmlFor="pubCheck" className="text-xs text-slate-600 text-slate-400">
                  Publish to technical catalog immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 border-slate-200">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 bg-slate-800 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-md shadow-sm"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white bg-white border border-slate-200 border-slate-200 rounded-lg shadow-xl p-6 text-slate-900 text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setLessonModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 text-slate-900 mb-4">
              {editingLesson ? 'Edit Lesson' : 'Add Curriculum Module'}
            </h3>
            <form onSubmit={handleSaveLesson} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">
                    Video URL / Embed
                  </label>
                  <input
                    type="text"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">Summary</label>
                <input
                  type="text"
                  required
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-slate-300 mb-1">
                  Lesson Markdown Notes &amp; Code
                </label>
                <textarea
                  rows={6}
                  required
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 bg-slate-800 border border-slate-300 border-slate-700 rounded-md text-xs font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="previewCheck"
                  checked={lessonIsPreview}
                  onChange={(e) => setLessonIsPreview(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <label htmlFor="previewCheck" className="text-xs text-slate-600 text-slate-400">
                  Allow Free Preview
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 border-slate-200">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 bg-slate-800 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-md shadow-sm"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
