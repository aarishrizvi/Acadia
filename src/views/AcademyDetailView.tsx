import React from 'react';
import { ArrowLeft, BookOpen, Users, Star, ExternalLink, Globe, ArrowRight } from 'lucide-react';
import { Academy, Course } from '../types';

interface AcademyDetailViewProps {
  academy: Academy;
  courses: Course[];
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
  onNavigate: (path: string) => void;
}

export const AcademyDetailView: React.FC<AcademyDetailViewProps> = ({
  academy,
  courses,
  onBack,
  onSelectCourse,
}) => {
  const academyCourses = courses.filter((c) => c.academyId === academy.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Academies
      </button>

      {/* Academy Banner Hero */}
      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="h-48 sm:h-56 w-full relative bg-slate-100 dark:bg-slate-800">
          <img
            src={academy.coverImage}
            alt={academy.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-lg bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-800 p-1 shadow-md overflow-hidden shrink-0">
                <img
                  src={academy.logoImage}
                  alt={academy.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {academy.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  {academy.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {academy.tagline}
                </p>
              </div>
            </div>

            {academy.website && (
              <a
                href={academy.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                Website
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="md:col-span-2 space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
                About the Academy
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{academy.description}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-lg space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead Instructor</span>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                  {academy.instructorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{academy.instructorName}</p>
                  <p className="text-[10px] text-slate-400">{academy.instructorEmail || 'Verified Educator'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Offered */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Published Courses ({academyCourses.length})
        </h2>

        {academyCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academyCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-white">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.subtitle}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({course.reviewCount})</span>
                    </div>

                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      View Syllabus
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            This academy currently has no published courses.
          </div>
        )}
      </div>
    </div>
  );
};
