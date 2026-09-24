import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, BookOpen, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { Course, CourseLevel, ViewMode } from '../types';

interface CoursesViewProps {
  courses: Course[];
  initialSearch?: string;
  onSelectCourse: (course: Course) => void;
  onNavigate: (view: ViewMode) => void;
  enrolledCourseIds?: string[];
}

const CATEGORIES = [
  'All',
  'Software Engineering',
  'Design & UI/UX',
  'Artificial Intelligence',
  'Cloud & DevOps'
];

const LEVELS: ('All' | CourseLevel)[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  initialSearch = '',
  onSelectCourse,
  onNavigate,
  enrolledCourseIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | CourseLevel>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          c.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
        const matchesSearch =
          !searchTerm.trim() ||
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.academyName && c.academyName.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesLevel && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default popular
        return b.enrolledCount - a.enrolledCount;
      });
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore Technical Courses
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Discover comprehensive curricula built by leading practitioners across specialized academies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses, instructors, or technical concepts..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="popular">Most Enrolled</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSearchTerm('');
              }}
              className="text-xs text-rose-400 hover:underline px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-indigo-300 border border-slate-700">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                      {course.level}
                    </span>
                    {isEnrolled && (
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Enrolled
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-medium text-slate-400 mb-1">
                      {course.academyName}
                    </p>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {course.subtitle}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {course.estimatedHours} Hours
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {course.instructorName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-500 font-normal">({course.reviewCount})</span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {isEnrolled ? 'Continue' : 'View Details'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No courses found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to explore all available courses.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
