import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, CareerTrack, Course } from '../types/curriculum';
import { CAREER_TRACKS, BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { 
  GraduationCap, Sparkles, SlidersHorizontal, BookOpen, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, 
  ShieldCheck, Bot, Clock, Award, Layers, User, ChevronDown, ChevronUp,
  Cpu, ArrowRight, Zap, Target
} from 'lucide-react';

interface TopStudentDashboardBarProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenProfileModal: () => void;
  onOpenCounselorModal: () => void;
  selectedPlanCourseIds: string[];
  totalPlannedCredits: number;
}

export const TopStudentDashboardBar: React.FC<TopStudentDashboardBarProps> = ({
  studentProfile,
  onUpdateProfile,
  onOpenProfileModal,
  onOpenCounselorModal,
  selectedPlanCourseIds,
  totalPlannedCredits
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('app-top-dashboard-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const semesterScrollRef = useRef<HTMLDivElement>(null);
  const trackScrollRef = useRef<HTMLDivElement>(null);
  const metricsScrollRef = useRef<HTMLDivElement>(null);

  const [canScrollSemLeft, setCanScrollSemLeft] = useState(false);
  const [canScrollSemRight, setCanScrollSemRight] = useState(false);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  // Calculate completed credits
  const completedCourses = BTECH_IT_COURSES.filter(c => studentProfile.completedCourseIds?.includes(c.id));
  const completedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalDegreeCredits = 160.0; // NUC CCMAS / FUT Minna B.Tech IT Standard
  const degreeProgressPercent = Math.min(100, Math.round(((completedCredits + totalPlannedCredits) / totalDegreeCredits) * 100));

  // Calculate estimated weekly workload for selected plan
  const plannedCourses = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));
  const weeklyWorkloadHours = plannedCourses.reduce((sum, c) => sum + (c.workloadHours || 4), 0);
  const isOverworked = weeklyWorkloadHours > (studentProfile.weeklyStudyHoursBudget || 20);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('app-top-dashboard-collapsed', String(next));
    } catch {}
  };

  const checkSemesterScroll = () => {
    if (semesterScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = semesterScrollRef.current;
      setCanScrollSemLeft(scrollLeft > 4);
      setCanScrollSemRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkSemesterScroll();
    window.addEventListener('resize', checkSemesterScroll);
    return () => window.removeEventListener('resize', checkSemesterScroll);
  }, []);

  const scrollSemesters = (direction: 'left' | 'right') => {
    if (semesterScrollRef.current) {
      const offset = direction === 'left' ? -180 : 180;
      semesterScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkSemesterScroll, 200);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm backdrop-blur-md transition-all text-slate-800 dark:text-slate-100 overflow-hidden">
      
      {/* Top Banner Row (Student Identity & Quick Action Bar) */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Student Profile Identity Tag */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenProfileModal}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-xs border border-blue-400/30 hover:scale-105 transition-transform"
              title="Edit Profile & Preferences"
            >
              {studentProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </button>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  {studentProfile.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                  {studentProfile.rollNumber || '21IT1084'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {studentProfile.institution || 'School of Information Technology'} • <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Semester {studentProfile.currentSemester}</span>
              </p>
            </div>
          </div>

          {/* Quick Collapse / Expand on Mobile & Desktop */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold"
              title={isCollapsed ? "Expand Academic Dashboard" : "Collapse Academic Dashboard"}
            >
              <span className="text-[11px] hidden sm:inline">{isCollapsed ? 'Expand Dashboard' : 'Compact'}</span>
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Career Goal & Active Semester Selector Bar */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end overflow-hidden">
          
          {/* Active Target Career Badge */}
          <div className="flex items-center space-x-2 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 px-3 py-1.5 rounded-xl shrink-0">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 block leading-none">Target Career</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                {targetTrack.title}
              </span>
            </div>
          </div>

          {/* AI Counselor Quick Trigger */}
          <button
            onClick={onOpenCounselorModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            title="Launch Grounded AI Counselor"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Counselor</span>
          </button>
        </div>

      </div>

      {/* Expandable Dashboard Body */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          
          {/* Scrollable Semester Navigation Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Select Active Semester
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (Click any semester to calibrate recommendations and credit checks)
                </span>
              </div>

              {/* Scroll buttons for desktop/tablet */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => scrollSemesters('left')}
                  disabled={!canScrollSemLeft}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollSemesters('right')}
                  disabled={!canScrollSemRight}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontally Scrollable Semester Pills */}
            <div
              ref={semesterScrollRef}
              onScroll={checkSemesterScroll}
              className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {semesters.map(sem => {
                const isActive = studentProfile.currentSemester === sem;
                const semCourses = BTECH_IT_COURSES.filter(c => c.semester === sem);
                const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

                return (
                  <button
                    key={sem}
                    onClick={() => onUpdateProfile({ currentSemester: sem })}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>Sem {sem}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {semCredits} Cr
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontally Scrollable Career Track Ribbon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Career Pathway Focus
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  (Select your target industry domain)
                </span>
              </div>
            </div>

            <div
              ref={trackScrollRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CAREER_TRACKS.map(track => {
                const isSelected = studentProfile.targetCareerTrackId === track.id;

                return (
                  <button
                    key={track.id}
                    onClick={() => onUpdateProfile({ targetCareerTrackId: track.id })}
                    className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{track.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {track.industryDemand}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Telemetry Metrics Row (Responsive Grid + Horizontal Swipe on Small Mobile) */}
          <div
            ref={metricsScrollRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0"
          >
            
            {/* Metric 1: Degree Credit Progress */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>NUC Degree Units</span>
                </span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xs">
                  {degreeProgressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${degreeProgressPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>{completedCredits + totalPlannedCredits} / {totalDegreeCredits} Cr</span>
                <span className="text-slate-400">Target: 160 Cr</span>
              </div>
            </div>

            {/* Metric 2: Semester Credit Safe Limit */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Semester Credit Load</span>
                </span>
                <span className={`font-extrabold text-xs ${
                  totalPlannedCredits > 24 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {totalPlannedCredits} / 24.0 Cr
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalPlannedCredits > 24 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalPlannedCredits / 24) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-slate-500 dark:text-slate-400">Max Safe Limit: 24 Cr</span>
                <span className={totalPlannedCredits > 24 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {totalPlannedCredits > 24 ? 'Exceeds Limit' : 'Safe Load'}
                </span>
              </div>
            </div>

            {/* Metric 3: Career Skill Alignment */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Career Skill Match</span>
                </span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs">
                  96.8%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[96.8%] rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="truncate max-w-[130px]">{targetTrack.targetRole}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Optimal</span>
              </div>
            </div>

            {/* Metric 4: Weekly Study Load Balance */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Weekly Study Load</span>
                </span>
                <span className={`font-extrabold text-xs ${
                  isOverworked ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {weeklyWorkloadHours}h / {studentProfile.weeklyStudyHoursBudget || 20}h
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverworked ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (weeklyWorkloadHours / (studentProfile.weeklyStudyHoursBudget || 20)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-slate-500 dark:text-slate-400">Pace: {studentProfile.preferredPace}</span>
                <span className={isOverworked ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {isOverworked ? 'Heavy Load' : 'Balanced'}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
