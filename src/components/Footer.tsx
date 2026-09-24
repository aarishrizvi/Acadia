import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">ACADIA</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Technical academy network connecting experienced software engineers, designers, and systems architects with ambitious learners.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <span className="p-1.5 rounded bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer">
                <Twitter className="w-3.5 h-3.5" />
              </span>
              <span className="p-1.5 rounded bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer">
                <Github className="w-3.5 h-3.5" />
              </span>
              <span className="p-1.5 rounded bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer">
                <Linkedin className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Academies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Partner Academies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/academies')} className="hover:text-slate-900 transition">
                  Hyperion Code Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/academies')} className="hover:text-slate-900 transition">
                  Vanguard Design Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/academies')} className="hover:text-slate-900 transition">
                  Aether AI Research Guild
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/academies')} className="hover:text-slate-900 transition">
                  Apex Cloud & DevOps
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Catalog & Learning
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-slate-900 transition">
                  Course Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/academies')} className="hover:text-slate-900 transition">
                  Browse Academies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-slate-900 transition">
                  Verified Technical Certifications
                </button>
              </li>
            </ul>
          </div>

          {/* Quality Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Educational Integrity
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              All curricula feature instructor-authored lessons, downloadable source code, and cryptographically verified Certificates of Completion.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
              <Shield className="w-3.5 h-3.5" />
              <span>Production-Grade Architecture</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ACADIA Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};