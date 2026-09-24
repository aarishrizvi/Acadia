import React, { useState } from 'react';
import {
  GraduationCap,
  Compass,
  Layers,
  BookOpen,
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'instructor') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    onNavigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Primary Navigation */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  ACADIA
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                  Academy Network
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button
                onClick={() => onNavigate('/courses')}
                className={`px-3 py-1.5 rounded-md transition ${
                  isActive('/courses')
                    ? 'text-indigo-600 font-semibold bg-indigo-50/60'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Explore Courses
              </button>

              <button
                onClick={() => onNavigate('/academies')}
                className={`px-3 py-1.5 rounded-md transition ${
                  isActive('/academies')
                    ? 'text-indigo-600 font-semibold bg-indigo-50/60'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Academies
              </button>

              {/* Authenticated Role-Specific Link (Only for the verified role) */}
              {currentUser?.role === 'student' && (
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    isActive('/dashboard')
                      ? 'text-indigo-600 font-semibold bg-indigo-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Learning
                </button>
              )}

              {currentUser?.role === 'instructor' && (
                <button
                  onClick={() => onNavigate('/studio')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    isActive('/studio')
                      ? 'text-indigo-600 font-semibold bg-indigo-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Instructor Studio
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('/admin')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    isActive('/admin')
                      ? 'text-rose-600 font-semibold bg-rose-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Portal
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={() => onOpenAuth('register', 'instructor')}
                  className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Teach on Acadia
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                >
                  <img
                    src={
                      currentUser.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        currentUser.displayName
                      )}`
                    }
                    alt={currentUser.displayName}
                    className="w-7 h-7 rounded-md object-cover bg-slate-100"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 max-w-[130px] truncate leading-tight">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-tight">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 animate-fadeIn text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">
                        {currentUser.displayName}
                      </p>
                      <p className="text-slate-500 truncate text-[11px]">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {currentUser.role} Account
                      </span>
                    </div>

                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('/dashboard');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        My Learning Dashboard
                      </button>
                    )}

                    {currentUser.role === 'instructor' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('/studio');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        Instructor Studio
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('/admin');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <Shield className="w-4 h-4 text-rose-600" />
                        Admin Portal
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-sm transition"
                >
                  Join for Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-medium animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('/courses');
            }}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700"
          >
            Explore Courses
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('/academies');
            }}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700"
          >
            Academies
          </button>

          {currentUser?.role === 'student' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/dashboard');
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-indigo-600 font-semibold"
            >
              My Learning Dashboard
            </button>
          )}

          {currentUser?.role === 'instructor' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/studio');
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-amber-600 font-semibold"
            >
              Instructor Studio
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/admin');
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-rose-600 font-semibold"
            >
              Admin Portal
            </button>
          )}

          <div className="pt-3 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  Signed in as {currentUser.displayName} ({currentUser.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold border border-slate-300 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold bg-indigo-600 text-white rounded-md"
                >
                  Join for Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};