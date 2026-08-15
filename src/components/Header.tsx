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

            {/* Packaged Action Toolbar (Properly fitted, grouped, and responsive) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

              {/* FUTMinna / NUC Compliance Button */}
              {onOpenCompliance && (
                <button
                  id="btn-compliance-header"
                  onClick={onOpenCompliance}
                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-2xs min-h-[36px] flex items-center space-x-1.5 shrink-0"
                  title="FUTMinna & NUC Curriculum Compliance Audit"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Compliance</span>
                  <span className="sm:hidden">Audit</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                </button>
              )}

              {/* SIWES Portal Button (Direct Access) */}
              {onOpenSiwesPortal && (
                <button
                  id="btn-siwes-portal-header"
                  onClick={onOpenSiwesPortal}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-2xs min-h-[36px] flex items-center space-x-1.5 shrink-0"
                  title="SIWES Industrial Training Scheme & Eligibility Portal"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">SIWES Portal</span>
                  <span className="sm:hidden">SIWES</span>
                </button>
              )}

              {/* Direct Quick Buttons (visible on large/desktop screens for quick access) */}
              <div className="hidden 2xl:flex items-center space-x-1.5">
                <button
                  id="btn-export-database-desktop"
                  onClick={onOpenDatabaseExport}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 min-h-[36px] shrink-0"
                  title="Export Database & Schemas for FYP"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Export DB</span>
                </button>

                <button
                  id="btn-cloud-account-desktop"
                  onClick={onOpenAuth}
                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/80 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 min-h-[36px] shrink-0"
                  title="Firebase Auth & Cloud Database Sync"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{currentUser ? (currentUser.displayName?.split(' ')[0] || 'Cloud Synced') : 'Cloud Sync'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                </button>
              </div>

              {/* Profile Setup Trigger Button */}
              <button
                id="btn-edit-profile"
                onClick={onOpenProfile}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-2xs min-h-[36px] flex items-center space-x-1.5 shrink-0"
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
                  className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border text-xs font-bold transition-all min-h-[36px] ${
                    isToolsDropdownOpen
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title="More Tools & Settings"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Tools</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Popover */}
                {isToolsDropdownOpen && (
                  <div 
                    id="header-tools-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Academic Tools & Cloud
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      {/* FUTMinna / NUC Curriculum Compliance */}
                      {onOpenCompliance && (
                        <button
                          id="dropdown-item-compliance"
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenCompliance();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
                          </div>
                          <div>
                            <span className="block font-bold text-emerald-950 dark:text-emerald-200">FUTMinna / NUC Compliance</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">8-Dimension statutory accreditation audit</span>
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
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs">
                          <Bot className="w-3.5 h-3.5 text-cyan-200" />
                        </div>
                        <div>
                          <span className="block font-bold text-indigo-900 dark:text-indigo-200">AI Academic Counselor</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">Course guidance & career trajectory advice</span>
                        </div>
                      </button>

                      {/* Cloud Sync & Firebase */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Database className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white">Cloud Database Sync</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                              {currentUser ? `Connected (${currentUser.displayName || currentUser.email})` : 'Sync semester plans across devices'}
                            </span>
                          </div>
                        </div>
                        {currentUser && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>}
                      </button>

                      {/* Programme Rules & Unit Limits */}
                      {onOpenProgrammeRules && (
                        <button
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenProgrammeRules();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white">Academic Programme Rules</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Configure min/max units & graduation req.</span>
                          </div>
                        </button>
                      )}

                      {/* SIWES Industrial Training Scheme */}
                      {onOpenSiwesPortal && (
                        <button
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenSiwesPortal();
                          }}
                          className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white">SIWES Industrial Portal</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Statutory 6-month placement & defense audit</span>
                          </div>
                        </button>
                      )}

                      {/* Export Database for FYP */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          if (onOpenDatabaseExport) onOpenDatabaseExport();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <FileCode className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">Export Database (FYP)</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">SQL, JSON & schemas for project reports</span>
                        </div>
                      </button>

                      {/* App Walkthrough Tour */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenWalkthrough();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">System Walkthrough</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">Interactive tour & features guide</span>
                        </div>
                      </button>

                      {/* Student Profile Setup */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">Student Academic Profile</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">Configure GPA, passed courses & goals</span>
                        </div>
                      </button>
                    </div>

                    {/* Footer in dropdown */}
                    <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 text-[10px] text-slate-400">
                      <span>B.Tech IT Curriculum Engine</span>
                      <span className="text-blue-600 font-bold">AICTE Compliant</span>
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

