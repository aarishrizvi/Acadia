import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Star,
  Users,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Academy, Course, ViewMode } from '../types';

interface LandingPageProps {
  academies: Academy[];
  courses: Course[];
  onNavigate: (view: ViewMode, data?: any) => void;
  onSelectCourse: (course: Course) => void;
  onSelectAcademy: (academy: Academy) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  academies,
  courses,
  onNavigate,
  onSelectCourse,
  onSelectAcademy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('courses', { search: searchQuery });
    }
  };

  const featuredCourses = courses.slice(0, 3);
  const featuredAcademies = academies.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-indigo-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white">Next-Gen LMS:</span>
          <span>Connecting Instructors, Academies &amp; Learners</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Master Modern Tech at{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            World-Class Academies
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ACADIA connects elite instructors and ambitious students through structured academies, verified curricula, interactive video lessons, and verifiable certifications.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TypeScript, Design Systems, Agentic AI, Kubernetes..."
              className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
            >
              Explore
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('courses')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 group"
          >
            Browse All Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('instructor_dashboard')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold rounded-xl text-sm transition flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            Instructor Studio
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-slate-800 bg-slate-900/60 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">4+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Specialized Academies
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">5+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Comprehensive Courses
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">1,400+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Active Learners
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">4.9 / 5</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Average Rating
            </div>
          </div>
        </div>
      </section>

      {/* The Acadia Structure / Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-400 font-bold mb-2">
            The Educational Ecosystem
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            How Acadia Works End-to-End
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            A cohesive architecture connecting domain instructors, custom academies, curated courses, sequential lessons, student mastery, and verifiable progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instructor &amp; Academy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Domain leaders establish dedicated Academies with brand identities, syllabi, requirements, and focused educational disciplines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Courses &amp; Rich Lessons</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curricula are divided into sequential lessons featuring high-definition video walkthroughs, markdown notes, code snippets, and attachments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Progress &amp; Certification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students track module completion in real time. Reaching 100% generates a verified Certificate of Completion with unique ID.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Academies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold mb-1">
              Top Academies
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Learn From Leading Specialized Studios
            </h2>
          </div>
          <button
            onClick={() => onNavigate('academies')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            View all academies <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAcademies.map((academy) => (
            <div
              key={academy.id}
              onClick={() => onSelectAcademy(academy)}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition duration-300 flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={academy.coverImage}
                  alt={academy.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-indigo-300 border border-slate-700">
                  {academy.category}
                </span>
                <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-800 p-0.5 shadow-md">
                  <img
                    src={academy.logoImage}
                    alt={academy.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                    {academy.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {academy.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    {academy.courseCount || 1} Course{academy.courseCount === 1 ? '' : 's'}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    {academy.studentCount || 100}+ Learners
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold mb-1">
              Curated Courses
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending Technical Curricula
            </h2>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            Explore all {courses.length} courses <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl transition duration-300 flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-emerald-300 border border-slate-700">
                  {course.category}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                  {course.level}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 mb-1">
                    {course.academyName}
                  </p>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {course.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({course.reviewCount})</span>
                  </div>

                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                    Free Instant Enrollment
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400 mb-2 block">
              For Educators &amp; Engineers
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Create Your Own Academy and Share Your Technical Expertise
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Launch dedicated courses, organize modular lessons with rich code snippets, track student enrollments, and award verifiable certificates.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('instructor_dashboard')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition"
              >
                Open Instructor Studio
              </button>
              <button
                onClick={() => onNavigate('academies')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition"
              >
                Explore Academies
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
