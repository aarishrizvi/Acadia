import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, Heart, Shield, Sparkles } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-black tracking-wider text-white">ACADIA</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The next-generation online academy platform connecting expert instructors with aspiring developers, designers, and systems architects.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
                <Github className="w-4 h-4" />
              </span>
              <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Academies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Featured Academies</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('academies')} className="hover:text-white transition">Hyperion Code Labs</button></li>
              <li><button onClick={() => onNavigate('academies')} className="hover:text-white transition">Vanguard Design Studio</button></li>
              <li><button onClick={() => onNavigate('academies')} className="hover:text-white transition">Aether AI Research Guild</button></li>
              <li><button onClick={() => onNavigate('academies')} className="hover:text-white transition">Apex Cloud &amp; DevOps</button></li>
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">LMS Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('courses')} className="hover:text-white transition">Course Discovery</button></li>
              <li><button onClick={() => onNavigate('student_dashboard')} className="hover:text-white transition">Student Portal</button></li>
              <li><button onClick={() => onNavigate('instructor_dashboard')} className="hover:text-white transition">Instructor Studio</button></li>
              <li><button onClick={() => onNavigate('admin_dashboard')} className="hover:text-white transition">System Administration</button></li>
            </ul>
          </div>

          {/* Quality Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Verified Excellence</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All courses feature verified curricula, interactive code snippets, and cryptographically verifiable Certificates of Completion.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1.5 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              <span>Production-Grade Architecture</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ACADIA Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
