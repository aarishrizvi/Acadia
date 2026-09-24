import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, BookOpen, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { Course, CourseLevel } from '../types';

interface CoursesViewProps {
  courses: Course[];
  initialSearch?: string;
  onSelectCourse: (course: Course) => void;
  onNavigate: (path: string) => void;
  enrolledCourseIds?: string[];
}

const CATEGORIES = [
  'All Categories',
  'Software Engineering',
  'Design & UI/UX',
  'Artificial Intelligence',
  'Cloud & DevOps',
];

const LEVELS: ('All Levels' | CourseLevel)[] = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  initialSearch = '',
  onSelectCourse,
  enrolledCourseIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState<'All Levels' | CourseLevel>('All Levels');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesCategory =
          selectedCategory === 'All Categories' ||
          c.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesLevel = selectedLevel === 'All Levels' || c.level === selectedLevel;
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
        return b.enrolledCount - a.enrolledCount;
      });
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Technical Course Directory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Showing {filteredCourses.length} of {courses.length} courses across all partner academies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses, instructors, keywords..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Most Enrolled</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white">
                      {course.category}
                    </span>
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course.level}
                    </span>
                    {isEnrolled && (
                      <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Enrolled
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {course.academyName}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.estimatedHours} Hours
                      </span>
                      <span>&bull;</span>
                      <span>By {course.instructorName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                    </div>

                    <span className="font-semibold text-indigo-600 flex items-center gap-1">
                      {isEnrolled ? 'Resume Course' : 'View Course'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg p-8">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setSelectedLevel('All Levels');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-200 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};