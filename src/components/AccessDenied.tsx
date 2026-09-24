import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedProps {
  requiredRole: 'admin' | 'instructor' | 'student';
  onNavigateHome: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole,
  onNavigateHome,
  onOpenAuth,
}) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8 text-center text-slate-900 dark:text-slate-100">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
          HTTP 403 &bull; Access Denied
        </span>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-3 text-slate-900 dark:text-white">
          {requiredRole === 'admin'
            ? 'Administrative Authorization Required'
            : requiredRole === 'instructor'
            ? 'Instructor Authorization Required'
            : 'Authentication Required'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {currentUser ? (
            <>
              You are authenticated as <strong className="text-slate-700 dark:text-slate-200">{currentUser.displayName}</strong> with role{' '}
              <span className="capitalize font-semibold text-slate-800 dark:text-slate-100">'{currentUser.role}'</span>. This area is strictly restricted to verified{' '}
              <span className="capitalize font-semibold text-rose-600 dark:text-rose-400">{requiredRole}</span> accounts.
            </>
          ) : (
            <>You must be signed in with an authorized {requiredRole} account to view this destination.</>
          )}
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Catalog
          </button>

          {!currentUser && (
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
