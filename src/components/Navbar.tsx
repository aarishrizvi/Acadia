import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Compass,
  LayoutDashboard,
  ShieldAlert,
  UserCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode, data?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, loginWithGoogle, logout, switchRole, loginAsDemoUser } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
    if (role === 'student') onNavigate('student_dashboard');
    else if (role === 'instructor') onNavigate('instructor_dashboard');
    else if (role === 'admin') onNavigate('admin_dashboard');
  };

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'instructor':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'student':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white">ACADIA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  LMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-tight -mt-0.5">
                Academy &amp; Course Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('courses')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentView === 'courses'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Courses
            </button>

            <button
              onClick={() => onNavigate('academies')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentView === 'academies'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Academies
            </button>

            {/* Student learning portal */}
            <button
              onClick={() => onNavigate('student_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentView === 'student_dashboard'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              My Learning
            </button>

            {/* Instructor Studio */}
            <button
              onClick={() => onNavigate('instructor_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentView === 'instructor_dashboard'
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Instructor Studio
            </button>

            {/* Admin Portal (highlighted if admin, or accessible for testing) */}
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                currentView === 'admin_dashboard'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition ${getRoleBadgeColor(
                  currentUser?.role
                )}`}
                title="Switch view perspective"
              >
                <span className="uppercase text-[10px] tracking-wider">Role:</span>
                <span className="capitalize">{currentUser?.role || 'Student'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Perspective
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      currentUser?.role === 'student' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Student (Learner)</span>
                    </div>
                    {currentUser?.role === 'student' && <span className="text-[10px]">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('instructor')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      currentUser?.role === 'instructor' ? 'text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Instructor (Academy)</span>
                    </div>
                    {currentUser?.role === 'instructor' && <span className="text-[10px]">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      currentUser?.role === 'admin' ? 'text-rose-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Platform Admin</span>
                    </div>
                    {currentUser?.role === 'admin' && <span className="text-[10px]">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile & Auth Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full transition"
                >
                  <span className="text-xs text-slate-200 font-medium max-w-[120px] truncate">
                    {currentUser.displayName}
                  </span>
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn text-slate-200">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white truncate">{currentUser.displayName}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('student_dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      My Enrolled Courses
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('instructor_dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                      Instructor Studio
                    </button>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        loginWithGoogle().catch(() => {});
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center gap-2 text-indigo-400"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Link / Sign in with Google
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800 flex items-center gap-2 text-rose-400"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Reset Session / Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleRoleChange(currentUser?.role === 'instructor' ? 'student' : 'instructor')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getRoleBadgeColor(
                currentUser?.role
              )}`}
            >
              {currentUser?.role}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => {
              onNavigate('courses');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Explore Courses
          </button>
          <button
            onClick={() => {
              onNavigate('academies');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            Academies
          </button>
          <button
            onClick={() => {
              onNavigate('student_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            My Learning
          </button>
          <button
            onClick={() => {
              onNavigate('instructor_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            Instructor Studio
          </button>
          <button
            onClick={() => {
              onNavigate('admin_dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Admin Portal
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Viewing as:</span>
            <div className="flex gap-1">
              {(['student', 'instructor', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 text-xs rounded capitalize ${
                    currentUser?.role === r ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
