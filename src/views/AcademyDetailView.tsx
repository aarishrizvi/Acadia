import React from 'react';
import { ArrowLeft, BookOpen, Users, Star, ExternalLink, Globe, GraduationCap, ArrowRight } from 'lucide-react';
import { Academy, Course, ViewMode } from '../types';

interface AcademyDetailViewProps {
  academy: Academy;
  courses: Course[];
  onBack: () => void;
  onSelectCourse: (course: Course) => void;
  onNavigate: (view: ViewMode) => void;
}

export const AcademyDetailView: React.FC<AcademyDetailViewProps> = ({
  academy,
  courses,
  onBack,
  onSelectCourse,
  onNavigate,
}) => {
  const academyCourses = courses.filter((c) => c.academyId === academy.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Academies
      </button>

      {/* Academy Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src={academy.coverImage}
            alt={academy.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-slate-950 p-1 shadow-2xl overflow-hidden shrink-0">
                <img
                  src={academy.logoImage}
                  alt={academy.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {academy.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {academy.name}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-400 font-medium mt-1">
                  {academy.tagline}
                </p>
              </div>
            </div>

            {academy.website && (
              <a
                href={academy.website}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
              >
                <Globe className="w-4 h-4" />
                Academy Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-xs">
            <div className="md:col-span-2">
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">
                Mission &amp; Curriculum Philosophy
              </h3>
              <p className="text-slate-400 leading-relaxed">{academy.description}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Academy Lead</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center font-bold text-indigo-400">
                  {academy.instructorName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{academy.instructorName}</p>
                  <p className="text-[10px] text-slate-500">{academy.instructorEmail || 'Verified Instructor'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Offered */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Courses from {academy.name} ({academyCourses.length})
          </h2>
        </div>

        {academyCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academyCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-indigo-300 border border-slate-700">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{course.subtitle}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating.toFixed(1)}</span>
                      <span className="text-slate-500 font-normal">({course.reviewCount})</span>
                    </div>

                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      View Curriculum
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            This academy currently has no published courses.
          </div>
        )}
      </div>
    </div>
  );
};
