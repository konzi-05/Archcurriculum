import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  UserCheck,
  LogOut,
  Mail,
  Lock,
  Database,
  CloudCheck,
  ShieldCheck,
  KeyRound,
  UserPlus,
  LogIn
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginAnonymously,
  logoutFirebase
} from '../services/firebase';

interface AuthModalProps {
  user: User | null;
  onClose: () => void;
  onOpenDatabaseExport?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ user, onClose, onOpenDatabaseExport }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginAnonymously();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Guest Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutFirebase();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Account & Cloud Sync
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Firestore Database & Auth Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[38px] min-w-[38px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">

          {/* Database Connection Status Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-xs flex items-center space-x-1">
                <span>Firestore Cloud Sync Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block ml-1"></span>
              </div>
              <p className="text-[11px] opacity-90 leading-normal">
                Degree plans, credit targets & academic profiles persist securely across all devices.
              </p>
            </div>
          </div>

          {/* User Logged In State */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full border border-blue-400/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                  )}
                  <div className="truncate">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {user.displayName || (user.isAnonymous ? 'Guest Student' : 'Authenticated Student')}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                      {user.email || 'Anonymous Session ID: ' + user.uid.substring(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{user.isAnonymous ? 'Guest Mode (Cloud Linked)' : 'Verified Google/Email Auth'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">UID: {user.uid.substring(0, 6)}...</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDatabaseExport) onOpenDatabaseExport();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center space-x-2 min-h-[42px]"
                >
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Export Database for Final Year Project (FYP)</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center space-x-2 min-h-[42px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            /* User Unauthenticated State */
            <div className="space-y-4">
              
              {/* Mode Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(null); }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(null); }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700 transition-all shadow-2xs flex items-center justify-center space-x-2.5 min-h-[44px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-slate-400 font-semibold text-[10px] uppercase">
                  Or Email / Password
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Error Message Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-800 dark:text-amber-300">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span>Authentication Notice</span>
                  </div>
                  <p className="leading-relaxed opacity-95 text-[11px]">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-2 min-h-[42px]"
                >
                  {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{mode === 'signin' ? 'Sign In with Email' : 'Create New Account'}</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {mode === 'signin' ? 'Need an account? Sign Up' : 'Already registered? Sign In'}
                </button>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium hover:underline"
                >
                  Continue as Guest
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDatabaseExport) onOpenDatabaseExport();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-2 text-xs min-h-[38px]"
                >
                  <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Export Database for Final Year Project (FYP)</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Powered by Google Cloud Firestore & Firebase Security Rules
        </div>

      </div>
    </div>
  );
};
