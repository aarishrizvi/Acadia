import React, { useState } from 'react';
import { Search, Layers, BookOpen, Users, ExternalLink, GraduationCap, ArrowRight } from 'lucide-react';
import { Academy, ViewMode } from '../types';

interface AcademiesViewProps {
  academies: Academy[];
  onSelectAcademy: (academy: Academy) => void;
  onNavigate: (view: ViewMode) => void;
}

export const AcademiesView: React.FC<AcademiesViewProps> = ({
  academies,
  onSelectAcademy,
  onNavigate,
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
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Specialized Academies
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Browse world-class technical studios established and led by verified domain experts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('instructor_dashboard')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 self-start md:self-auto"
        >
          <GraduationCap className="w-4 h-4" />
          Create an Academy
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search academies by name, topic, or instructor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
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
        </div>
      </div>

      {/* Academies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((academy) => (
          <div
            key={academy.id}
            onClick={() => onSelectAcademy(academy)}
            className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={academy.coverImage}
                  alt={academy.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-indigo-300 border border-slate-700">
                  {academy.category}
                </span>
                <div className="absolute -bottom-4 left-5 w-14 h-14 rounded-xl bg-slate-900 border-2 border-slate-800 p-0.5 shadow-md">
                  <img
                    src={academy.logoImage}
                    alt={academy.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="p-6 pt-7 space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                  {academy.name}
                </h3>
                <p className="text-xs text-indigo-400 font-medium">{academy.tagline}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {academy.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    {academy.courseCount || 1} Courses
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    {academy.studentCount || 200}+ Students
                  </span>
                </div>

                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Enter Academy
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
