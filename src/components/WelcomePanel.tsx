import React, { useState } from 'react';
import { Sparkles, GraduationCap, Compass, BookOpen, SlidersHorizontal, ArrowRight, Play, CheckCircle2, ChevronDown, ChevronUp, X, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types/curriculum';

interface WelcomePanelProps {
  onOpenWalkthrough: () => void;
  onOpenProfile: () => void;
  onOpenCounselor: () => void;
  onLoadDemoProfile?: (demoProfile: StudentProfile) => void;
}

export const WelcomePanel: React.FC<WelcomePanelProps> = ({
  onOpenWalkthrough,
  onOpenProfile,
  onOpenCounselor,
  onLoadDemoProfile
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs transition-all shadow-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-bold">B.Tech IT Academic Curriculum Architect & Walkthrough</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
        >
          <span>Show Welcome Panel</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-500/30 transition-all">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-cyan-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>AICTE B.Tech IT Model Curriculum Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Curriculum Architect</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isCollapsed ? "Expand Welcome Panel" : "Collapse Welcome Panel"}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Dismiss Welcome Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Body Content */}
        {!isCollapsed && (
          <div className="space-y-6">
            
            <p className="text-sm text-indigo-100 max-w-3xl leading-relaxed">
              Designed specifically for B.Tech Information Technology students and academic departments. Plan your degree, choose optimal electives, check prerequisite DAG graph constraints, and benchmark your career skills against industry standards.
            </p>

            {/* Feature Walkthrough Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>1. Smart Electives</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Personalized elective match scoring based on prerequisites and credit limits.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                <div className="flex items-center space-x-2 text-blue-200 font-bold text-xs">
                  <Compass className="w-4 h-4" />
                  <span>2. 4-Year Map</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Explore all 8 semesters with complete prerequisite DAG graph validation.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>3. Skill Matrix</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  IEEE/ACM benchmark skill gap coverage & salary insights for target IT roles.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>4. Semester Optimizer</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Active semester schedule planner with AI strategy guidance report generator.
                </p>
              </div>

            </div>

            {/* Action Bar & Walkthrough Launch */}
            <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              <div className="flex items-center space-x-3 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AICTE Credit Limit Safety • Complete Prerequisite DAG Graph Check</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenWalkthrough}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-900 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-900" />
                  <span>Launch Walkthrough & Demo</span>
                </button>

                <button
                  onClick={onOpenCounselor}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20"
                >
                  Ask AI Counselor
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
