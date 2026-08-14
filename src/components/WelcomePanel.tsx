import React, { useState, useRef } from 'react';
import { Sparkles, GraduationCap, Compass, BookOpen, SlidersHorizontal, ArrowRight, Play, CheckCircle2, ChevronDown, ChevronUp, X, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const featureCardsScrollRef = useRef<HTMLDivElement>(null);

  const scrollFeatureCards = (direction: 'left' | 'right') => {
    if (featureCardsScrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      featureCardsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (isDismissed) {
    return (
      <div className="bg-blue-50/80 dark:bg-slate-900/80 border border-blue-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs transition-all shadow-xs">
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
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-xl border border-indigo-500/30 transition-all">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-5 sm:space-y-6">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-300 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>B.Tech IT Degree & Course Planner</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Curriculum Architect</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
              title={isCollapsed ? "Expand Welcome Guide" : "Collapse Welcome Guide"}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Body Content */}
        {!isCollapsed && (
          <div className="space-y-5 sm:space-y-6">
            
            <p className="text-xs sm:text-sm text-indigo-100 max-w-3xl leading-relaxed">
              Your intelligent guidance system for planning your 4-year B.Tech Information Technology degree. Select high-impact elective subjects, verify required course prerequisites, balance your study workload, and prepare for top-tier industry engineering roles.
            </p>

            {/* Feature Walkthrough Cards (Horizontally scrollable on mobile/tablet, grid on desktop) */}
            <div className="relative">
              <div 
                ref={featureCardsScrollRef}
                className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2 lg:pb-0 scroll-smooth scrollbar-none snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                
                <div className="w-[260px] sm:w-[280px] lg:w-auto shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>1. Smart Electives</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Personalized elective recommendations based on your career pathway, prerequisite eligibility, and study budget.
                  </p>
                </div>

                <div className="w-[260px] sm:w-[280px] lg:w-auto shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                  <div className="flex items-center space-x-2 text-blue-200 font-bold text-xs">
                    <Compass className="w-4 h-4" />
                    <span>2. 4-Year Course Map</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Explore all 8 semesters with clear prerequisite connection paths and syllabus unit breakdowns.
                  </p>
                </div>

                <div className="w-[260px] sm:w-[280px] lg:w-auto shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>3. Career & Skills Matrix</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    See required skills, industry demand, and certification targets for top roles like Full-Stack, AI, and Cloud.
                  </p>
                </div>

                <div className="w-[260px] sm:w-[280px] lg:w-auto shrink-0 snap-start p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>4. Semester Planner</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Build your weekly timetable, calculate semester GPA, and track milestone graduation goals.
                  </p>
                </div>

              </div>

              {/* Mobile Swipe Indicators / Controls */}
              <div className="flex lg:hidden items-center justify-end space-x-1.5 mt-2">
                <button
                  onClick={() => scrollFeatureCards('left')}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollFeatureCards('right')}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Bar & Walkthrough Launch */}
            <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              
              <div className="flex items-center space-x-2.5 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Credit Limit Protection • Grounded Prerequisite Verification</span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={onOpenWalkthrough}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-900 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-md min-h-[40px]"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-900" />
                  <span>Take Quick App Tour</span>
                </button>

                <button
                  onClick={onOpenCounselor}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20 min-h-[40px]"
                >
                  Ask AI Advisor
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
