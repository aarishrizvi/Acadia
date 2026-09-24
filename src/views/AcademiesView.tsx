import React, { useState } from 'react';
import { Search, Layers, BookOpen, Users, ExternalLink, GraduationCap, ArrowRight } from 'lucide-react';
import { Academy } from '../types';

interface AcademiesViewProps {
  academies: Academy[];
  onSelectAcademy: (academy: Academy) => void;
  onNavigate: (path: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'instructor') => void;
}

export const AcademiesView: React.FC<AcademiesViewProps> = ({
  academies,
  onSelectAcademy,
  onNavigate,
  onOpenAuth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Software Engineering', 'Design & UI/UX', 'Artificial Intelligence', 'Cloud & DevOps'];

  const filtered = academies.filter((a) => {
    const matchCat = selectedCategory === 'All' || a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      !searchTerm.trim() ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Specialized Academies & Studios
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Browse verified technical academies established and operated by experienced practitioners.
          </p>
        </div>

        <button
          onClick={() => onOpenAuth('register', 'instructor')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md text-xs shadow-sm transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <GraduationCap className="w-4 h-4" />
          Apply to Launch Academy
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search academies by name, category, or instructor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Academies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((academy) => (
          <div
            key={academy.id}
            onClick={() => onSelectAcademy(academy)}
            className="cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={academy.coverImage}
                  alt={academy.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {academy.category}
                </span>
                <div className="absolute -bottom-3 left-4 w-12 h-12 rounded-lg bg-white border border-slate-200 p-0.5 shadow-md">
                  <img
                    src={academy.logoImage}
                    alt={academy.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>

              <div className="p-5 pt-6 space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  {academy.name}
                </h3>
                <p className="text-xs text-indigo-600 font-medium">
                  {academy.tagline}
                </p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {academy.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {academy.courseCount || 1} Courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {academy.studentCount || 200}+ Learners
                  </span>
                </div>

                <span className="font-semibold text-indigo-600 flex items-center gap-1">
                  View Academy
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};