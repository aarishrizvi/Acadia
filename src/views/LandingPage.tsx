import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Users,
  Award,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Academy, Course } from '../types';

interface LandingPageProps {
  academies: Academy[];
  courses: Course[];
  onNavigate: (path: string) => void;
  onSelectCourse: (course: Course) => void;
  onSelectAcademy: (academy: Academy) => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'instructor') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  academies,
  courses,
  onNavigate,
  onSelectCourse,
  onSelectAcademy,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/courses');
    }
  };

  const featuredCourses = courses.slice(0, 3);
  const featuredAcademies = academies.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-slate-800 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified Technical Academy Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Learn from elite software studios and industry academies.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Master distributed architecture, modern full-stack development, applied machine
                learning, and design systems through structured curricula created by practicing
                senior engineers.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center shadow-lg rounded-lg overflow-hidden">
                  <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by topic (e.g. TypeScript, Kubernetes, AI Agents)..."
                    className="w-full pl-10 pr-28 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/courses')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'student')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition"
                >
                  Join as Learner
                </button>
              </div>
            </div>

            {/* Right Column: Platform Metrics Card */}
            <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Acadia Platform Standards
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="text-2xl font-black text-white">{academies.length || 4}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verified Academies</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="text-2xl font-black text-indigo-400">{courses.length || 5}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Specialized Courses</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="text-2xl font-black text-emerald-400">1,400+</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active Learners</p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                  <p className="text-2xl font-black text-amber-400">4.9 ★</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average Rating</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive lesson markdown notes &amp; source code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verifiable Certificate of Completion for every course</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real instructor student progress monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Curated Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Popular Technical Courses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View all courses <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white">
                    {course.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {course.academyName}
                  </p>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Instructor: <span className="font-medium">{course.instructorName}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded">
                    Free Enrollment
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leading Academies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Institutions &amp; Studios
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Explore Academies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/academies')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            All academies <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredAcademies.map((academy) => (
            <div
              key={academy.id}
              onClick={() => onSelectAcademy(academy)}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={academy.logoImage}
                    alt={academy.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {academy.name}
                    </h3>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {academy.category}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {academy.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>{academy.courseCount || 1} Courses</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Visit Studio &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works: The LMS Pipeline */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              LMS Learning Pathway
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              How ACADIA Delivers Real Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              From enrollment to verified certification, follow a structured educational workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Instructor &amp; Academy Creation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Expert educators establish dedicated academies, curate structured course modules,
                and attach code blueprints.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sequential Lessons &amp; Progress
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Students access focused video walkthroughs, read markdown technical notes, and mark
                modules as completed with real-time percentage tracking.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-3">
              <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verifiable Certification &amp; Reviews
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Completing 100% generates a credential-backed Certificate of Completion and enables
                students to publish course ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Become an Instructor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Publish Courses and Build Your Academy on ACADIA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gain access to the Instructor Studio to author structured lessons, manage student
              rosters, track curriculum completion, and build a verified following.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('register', 'instructor')}
            className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-lg shadow-sm transition whitespace-nowrap"
          >
            Apply as Instructor
          </button>
        </div>
      </section>
    </div>
  );
};
