import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { AcademicProgrammeRules } from '../types/curriculum';
import { 
  Sparkles, 
  MessageSquare, 
  Compass, 
  SlidersHorizontal, 
  BookOpen, 
  Sun, 
  Moon, 
  HelpCircle, 
  Database, 
  FileCode, 
  User as UserIcon,
  ChevronDown,
  Layers,
  CheckCircle2,
  ExternalLink,
  Bot,
  GraduationCap,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'recommendations' | 'curriculum' | 'career' | 'planner';
  setActiveTab: (tab: 'recommendations' | 'curriculum' | 'career' | 'planner') => void;
  programmeRules?: AcademicProgrammeRules;
  onOpenProgrammeRules?: () => void;
  onOpenProfile: () => void;
  onOpenCounselor: () => void;
  onOpenWalkthrough: () => void;
  onOpenAuth: () => void;
  onOpenDatabaseExport?: () => void;
  onOpenSiwesPortal?: () => void;
  onOpenCompliance?: () => void;
  onOpenIntroPage?: () => void;
  currentUser: User | null;
  selectedPlanCount: number;
  totalCredits: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  programmeRules,
  onOpenProgrammeRules,
  onOpenProfile,
  onOpenCounselor,
  onOpenWalkthrough,
  onOpenAuth,
  onOpenDatabaseExport,
  onOpenSiwesPortal,
  onOpenCompliance,
  onOpenIntroPage,
  currentUser,
  selectedPlanCount,
  totalCredits,
  theme,
  onToggleTheme
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="h-16 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 sticky top-0 z-30 shrink-0 backdrop-blur-md shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-2">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs shrink-0 border border-blue-400/30">
                <img src="/favicon.svg" alt="Curriculum Architect Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xs sm:text-sm lg:text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  CURRICULUM <span className="text-blue-600 dark:text-blue-400">ARCHITECT</span>
                </h1>
                
                {/* Clickable Programme & Handbook Configuration Pill */}
                {onOpenProgrammeRules && (
                  <button
                    onClick={onOpenProgrammeRules}
                    className="hidden sm:inline-flex items-center space-x-1 text-[10px] bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800 uppercase font-bold transition-all shadow-2xs"
                    title="Click to configure Programme Rules & Semester Unit Limits"
                  >
                    <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span>{programmeRules ? `${programmeRules.institutionShortCode} • ${programmeRules.schoolShortCode}` : 'FUTMinna • SICT'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs - Desktop (lg & xl screens) */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/90 dark:border-slate-700 shrink-0">
              <button
                id="tab-recommendations"
                onClick={() => setActiveTab('recommendations')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'recommendations'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Recommendations</span>
                <span className="xl:hidden">Match</span>
              </button>

              <button
                id="tab-curriculum"
                onClick={() => setActiveTab('curriculum')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'curriculum'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/70'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Curriculum Map</span>
                <span className="xl:hidden">Curriculum</span>
              </button>

              <button
                id="tab-career"
                onClick={() => setActiveTab('career')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'career'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/70'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Career & Skills</span>
                <span className="xl:hidden">Skills</span>
              </button>

              <button
                id="tab-planner"
                onClick={() => setActiveTab('planner')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === 'planner'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/70'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Semester Planner</span>
                <span className="xl:hidden">Planner</span>
                {selectedPlanCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-white font-bold text-[10px]">
                    {selectedPlanCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Packaged Action Toolbar (Clean, properly fitted, and aligned with no overflow) */}
            <div className="flex items-center space-x-2 shrink-0">

              {/* Intro Page & Purpose Trigger Button */}
              {onOpenIntroPage && (
                <button
                  id="btn-open-intro-page"
                  onClick={onOpenIntroPage}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-slate-800 dark:to-slate-800/90 dark:hover:from-slate-700 dark:hover:to-slate-700/90 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs min-h-[36px] flex items-center space-x-1.5 shrink-0"
                  title="Open App Overview & Introductory Guide"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span className="hidden sm:inline">Intro & Purpose</span>
                </button>
              )}

              {/* Profile Setup Trigger Button */}
              <button
                id="btn-edit-profile"
                onClick={onOpenProfile}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs min-h-[36px] flex items-center space-x-1.5 shrink-0"
                title="Edit Student Profile & Target Career"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {/* Theme Toggle (Sun/Moon) */}
              <button
                id="btn-theme-toggle"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center min-h-[36px] min-w-[36px] shrink-0"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Packaged More Tools Dropdown Menu */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  id="btn-header-tools-menu"
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[36px] ${
                    isToolsDropdownOpen
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs'
                  }`}
                  title="Tools, Compliance & Utilities"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tools</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Popover */}
                {isToolsDropdownOpen && (
                  <div 
                    id="header-tools-dropdown"
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Academic Tools & Services
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5 max-h-[75vh] overflow-y-auto">
                      {/* FUTMinna / NUC Curriculum Compliance Audit */}
                      {onOpenCompliance && (
                        <button
                          id="dropdown-item-compliance"
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenCompliance();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60 text-left transition-colors bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-900/60"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-xs shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="block font-bold text-emerald-950 dark:text-emerald-200 truncate">FUTMinna / NUC Compliance</span>
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-[9px] font-extrabold uppercase">Audit</span>
                            </div>
                            <span className="block text-[10px] text-emerald-700/80 dark:text-emerald-400/80 truncate">8-Dimension statutory accreditation audit</span>
                          </div>
                        </button>
                      )}

                      {/* SIWES Industrial Training Scheme */}
                      {onOpenSiwesPortal && (
                        <button
                          id="dropdown-item-siwes"
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenSiwesPortal();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-blue-100/70 dark:hover:bg-blue-950/60 text-left transition-colors bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-xs shrink-0">
                            <Building2 className="w-3.5 h-3.5 text-blue-100" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="block font-bold text-blue-950 dark:text-blue-200 truncate">SIWES Industrial Portal</span>
                              <span className="px-1.5 py-0.2 rounded-md bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-[9px] font-extrabold uppercase">IT 400L</span>
                            </div>
                            <span className="block text-[10px] text-blue-700/80 dark:text-blue-400/80 truncate">Statutory 6-month placement & defense</span>
                          </div>
                        </button>
                      )}

                      {/* AI Academic & Career Counselor */}
                      <button
                        id="dropdown-item-counselor"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenCounselor();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-100/70 dark:hover:bg-indigo-950/60 text-left transition-colors bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs shrink-0">
                          <Bot className="w-3.5 h-3.5 text-indigo-100" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-indigo-950 dark:text-indigo-200 truncate">AI Academic Counselor</span>
                          <span className="block text-[10px] text-indigo-700/80 dark:text-indigo-400/80 truncate">Grounded course & career trajectory advice</span>
                        </div>
                      </button>

                      {/* Cloud Sync & Firebase */}
                      <button
                        id="dropdown-item-cloud-sync"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Database className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-slate-900 dark:text-white truncate">Cloud Database Sync</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {currentUser ? `Connected (${currentUser.displayName || currentUser.email})` : 'Sync semester plans across devices'}
                            </span>
                          </div>
                        </div>
                        {currentUser && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-1"></span>}
                      </button>

                      {/* Programme Rules & Unit Limits */}
                      {onOpenProgrammeRules && (
                        <button
                          id="dropdown-item-programme-rules"
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenProgrammeRules();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-slate-900 dark:text-white truncate">Academic Programme Rules</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">Configure min/max units & graduation req.</span>
                          </div>
                        </button>
                      )}

                      {/* Export Database for FYP */}
                      <button
                        id="dropdown-item-export-db"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          if (onOpenDatabaseExport) onOpenDatabaseExport();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                          <FileCode className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-slate-900 dark:text-white truncate">Export Database (FYP)</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">SQL, JSON & schemas for project reports</span>
                        </div>
                      </button>

                      {/* App Intro & Overview */}
                      {onOpenIntroPage && (
                        <button
                          id="dropdown-item-intro-page"
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenIntroPage();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-slate-900 dark:text-white truncate">App Intro & Purpose</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">Visual overview, purpose & quick personas</span>
                          </div>
                        </button>
                      )}

                      {/* App Walkthrough Tour */}
                      <button
                        id="dropdown-item-walkthrough"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenWalkthrough();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-slate-900 dark:text-white truncate">System Walkthrough</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">Interactive tour & feature instructions</span>
                        </div>
                      </button>
                    </div>

                    {/* Footer in dropdown */}
                    <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 text-[10px] text-slate-400">
                      <span>B.Tech IT Engine</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">NUC / SICT Standards</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-lg px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1 text-center max-w-lg mx-auto">
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
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-cyan-500 text-white font-bold text-[9px]">
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

