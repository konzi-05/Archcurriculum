import React from 'react';
import { User } from 'firebase/auth';
import { GraduationCap, Sparkles, MessageSquare, Compass, SlidersHorizontal, BookOpen, Sun, Moon, HelpCircle, Database, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recommendations' | 'curriculum' | 'career' | 'planner';
  setActiveTab: (tab: 'recommendations' | 'curriculum' | 'career' | 'planner') => void;
  onOpenProfile: () => void;
  onOpenCounselor: () => void;
  onOpenWalkthrough: () => void;
  onOpenAuth: () => void;
  currentUser: User | null;
  selectedPlanCount: number;
  totalCredits: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenCounselor,
  onOpenWalkthrough,
  onOpenAuth,
  currentUser,
  selectedPlanCount,
  totalCredits,
  theme,
  onToggleTheme
}) => {
  return (
    <>
      <header className="h-16 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 sticky top-0 z-30 shrink-0 backdrop-blur-md shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm shadow-blue-200 dark:shadow-none shrink-0 border border-blue-400/30">
                <img src="/favicon.svg" alt="Curriculum Architect Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-xs sm:text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  CURRICULUM <span className="text-blue-600 dark:text-blue-400 font-extrabold">ARCHITECT</span>
                </h1>
                <span className="hidden min-[400px]:inline-block text-[9px] sm:text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 sm:px-2.5 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800 uppercase font-bold">
                  B.Tech IT
                </span>
              </div>
            </div>

            {/* Navigation Tabs - Desktop */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                id="tab-recommendations"
                onClick={() => setActiveTab('recommendations')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'recommendations'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommendations</span>
              </button>

              <button
                id="tab-curriculum"
                onClick={() => setActiveTab('curriculum')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'curriculum'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Curriculum Map</span>
              </button>

              <button
                id="tab-career"
                onClick={() => setActiveTab('career')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'career'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Career & Skills</span>
              </button>

              <button
                id="tab-planner"
                onClick={() => setActiveTab('planner')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  activeTab === 'planner'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Semester Planner</span>
                {selectedPlanCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-white font-bold text-[10px]">
                    {selectedPlanCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Action Tools */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              
              {/* Light / Dark Mode Toggle */}
              <button
                id="btn-theme-toggle"
                onClick={onToggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px]"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              <button
                id="btn-ai-counselor"
                onClick={onOpenCounselor}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-indigo-200 dark:shadow-none min-h-[38px] sm:min-h-[42px]"
                title="Academic & Career Counselor"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Counselor</span>
              </button>

              <button
                id="btn-cloud-account"
                onClick={onOpenAuth}
                className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 min-h-[38px] sm:min-h-[42px]"
                title="Firebase Auth & Cloud Database Sync"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden min-[500px]:inline font-bold">
                  {currentUser ? (currentUser.displayName?.split(' ')[0] || 'Account') : 'Cloud Sync'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              </button>

              <button
                id="btn-edit-profile"
                onClick={onOpenProfile}
                className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs min-h-[38px] sm:min-h-[42px]"
              >
                Profile
              </button>

              <button
                id="btn-app-walkthrough"
                onClick={onOpenWalkthrough}
                className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-xs min-h-[38px] sm:min-h-[42px]"
                title="App Walkthrough & Demo"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden lg:inline">Walkthrough</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-lg px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1 text-center">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[44px] ${
              activeTab === 'recommendations'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Match</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[44px] ${
              activeTab === 'curriculum'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Curriculum</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[44px] ${
              activeTab === 'career'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative min-h-[44px] ${
              activeTab === 'planner'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60'
                : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 mb-0.5" />
              {selectedPlanCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-cyan-500 text-white font-bold text-[9px]">
                  {selectedPlanCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Planner</span>
          </button>
        </div>
      </div>
    </>
  );
};

