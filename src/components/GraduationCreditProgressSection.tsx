import React, { useState } from 'react';
import { StudentProfile, AcademicProgrammeRules, Course } from '../types/curriculum';
import { BTECH_IT_COURSES } from '../data/btechItCurriculum';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart as PieChartIcon,
  ShieldCheck,
  TrendingUp,
  Info,
  Calendar,
  BookOpen
} from 'lucide-react';

interface GraduationCreditProgressSectionProps {
  studentProfile: StudentProfile;
  programmeRules?: AcademicProgrammeRules;
  selectedPlanCourseIds: string[];
  totalPlannedCredits: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const GraduationCreditProgressSection: React.FC<GraduationCreditProgressSectionProps> = ({
  studentProfile,
  programmeRules,
  selectedPlanCourseIds,
  totalPlannedCredits,
  isOpen,
  onToggle
}) => {
  const [activeChartView, setActiveChartView] = useState<'overview' | 'semesters' | 'domains'>('overview');

  // Graduation requirement credit threshold
  const totalDegreeCredits = studentProfile.entryMode === 'Direct_Entry'
    ? (programmeRules?.directEntryGraduationUnits ?? 120)
    : (programmeRules?.graduationRequirementUnits ?? 150);

  const minSemesterUnits = programmeRules?.minSemesterUnits ?? 15;
  const maxSemesterUnits = programmeRules?.maxSemesterUnits ?? 24;

  // Completed courses
  const completedCourses = BTECH_IT_COURSES.filter(c => studentProfile.completedCourseIds?.includes(c.id));
  const completedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);

  // Planned courses
  const plannedCourses = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));
  const plannedCredits = totalPlannedCredits > 0 ? totalPlannedCredits : plannedCourses.reduce((sum, c) => sum + c.credits, 0);

  // Remaining credits required to graduate
  const remainingCredits = Math.max(0, totalDegreeCredits - (completedCredits + plannedCredits));

  // Percentage calculations
  const completedPercent = Math.min(100, Math.round((completedCredits / totalDegreeCredits) * 100));
  const plannedPercent = Math.min(100, Math.round((plannedCredits / totalDegreeCredits) * 100));
  const totalProjectedPercent = Math.min(100, Math.round(((completedCredits + plannedCredits) / totalDegreeCredits) * 100));

  // --- RECHARTS DATA PREPARATION ---

  // 1. Overall Pie / Donut Chart Data
  const pieData = [
    { name: 'Completed Units', value: completedCredits, color: '#10b981', fill: '#10b981' },
    { name: 'Currently Planned', value: plannedCredits, color: '#3b82f6', fill: '#3b82f6' },
    { name: 'Remaining Units', value: remainingCredits, color: '#94a3b8', fill: '#cbd5e1' }
  ].filter(item => item.value > 0);

  // 2. Semester-by-Semester Progression Data (Semesters 1 to 8)
  const semesterChartData = [1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
    const semCompleted = completedCourses.filter(c => c.semester === sem).reduce((sum, c) => sum + c.credits, 0);
    const semPlanned = studentProfile.currentSemester === sem ? plannedCredits : 0;
    const semCatalogTotal = BTECH_IT_COURSES.filter(c => c.semester === sem).reduce((sum, c) => sum + c.credits, 0);

    const levelLabel = `${Math.ceil(sem / 2) * 100}L ${sem % 2 === 1 ? 'Harmattan' : 'Rain'}`;

    return {
      semester: `Sem ${sem}`,
      label: levelLabel,
      completed: semCompleted,
      planned: semPlanned,
      catalogTotal: semCatalogTotal,
      minRequired: minSemesterUnits,
      maxAllowed: maxSemesterUnits
    };
  });

  // 3. Academic Domain Breakdown Data
  const domainKeys = [
    'Math & Foundational CS',
    'Software Engineering',
    'AI & Data Science',
    'Cloud & Systems',
    'Cybersecurity & Networks',
    'Hardware & Embedded'
  ];

  const domainChartData = domainKeys.map(domain => {
    const domainCourses = BTECH_IT_COURSES.filter(c => c.domain === domain);
    const domainTotalCredits = domainCourses.reduce((sum, c) => sum + c.credits, 0);
    const domainCompleted = completedCourses.filter(c => c.domain === domain).reduce((sum, c) => sum + c.credits, 0);
    const domainPlanned = plannedCourses.filter(c => c.domain === domain).reduce((sum, c) => sum + c.credits, 0);

    return {
      domain: domain.replace(' & ', '\n& '),
      fullDomain: domain,
      completed: domainCompleted,
      planned: domainPlanned,
      totalAvailable: domainTotalCredits
    };
  });

  // Milestone Stages
  const milestones = [
    {
      level: '100L Gateway',
      credits: studentProfile.entryMode === 'Direct_Entry' ? 'Waived (DE)' : '30-36 Cr',
      isReached: studentProfile.entryMode === 'Direct_Entry' || completedCredits >= 30,
      desc: 'Foundational Mathematics, Physics, and Intro to Computing'
    },
    {
      level: '200L Core Competency',
      credits: studentProfile.entryMode === 'Direct_Entry' ? '30-36 Cr' : '65-72 Cr',
      isReached: completedCredits >= (studentProfile.entryMode === 'Direct_Entry' ? 30 : 65),
      desc: 'Data Structures, OOP, Database Systems, Computer Architecture'
    },
    {
      level: '300L Pre-SIWES',
      credits: studentProfile.entryMode === 'Direct_Entry' ? '65-72 Cr' : '100-108 Cr',
      isReached: completedCredits >= (studentProfile.entryMode === 'Direct_Entry' ? 65 : 100),
      desc: 'Software Engineering, OS, Networks, Systems Analysis'
    },
    {
      level: '400L SIWES Clearance',
      credits: studentProfile.entryMode === 'Direct_Entry' ? '90-96 Cr' : '120-130 Cr',
      isReached: completedCredits >= (studentProfile.entryMode === 'Direct_Entry' ? 90 : 120),
      desc: 'Mandatory 6-Month Industrial Training & Advanced Computing'
    },
    {
      level: '500L Graduation Target',
      credits: `${totalDegreeCredits} Cr`,
      isReached: (completedCredits + plannedCredits) >= totalDegreeCredits,
      desc: 'Final Year Capstone Project I & II, Departmental Specializations'
    }
  ];

  return (
    <div id="graduation-progress-analytics-section" className="border-t border-slate-100 dark:border-slate-800/80 transition-all">
      {/* Visual Section Header Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                Graduation Credit Requirement Analytics
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {totalProjectedPercent}% Projected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: <strong className="text-slate-700 dark:text-slate-200">{totalDegreeCredits} Credit Units</strong> ({studentProfile.entryMode === 'Direct_Entry' ? 'Direct Entry Programme' : 'Standard 5-Year UTME'}) • {completedCredits} completed + {plannedCredits} planned
            </p>
          </div>
        </div>

        {/* View Selection & Expand Toggle */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          {isOpen && (
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveChartView('overview')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeChartView === 'overview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieChartIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChartView('semesters')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeChartView === 'semesters'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3 h-3" />
                <span className="hidden sm:inline">Semesters</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChartView('domains')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeChartView === 'domains'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">NUC Domains</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            title={isOpen ? "Collapse Analytics Section" : "Expand Graduation Analytics Charts"}
          >
            <span>{isOpen ? 'Hide Analytics' : 'View Recharts Analytics'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Analytics Body Content (Smoothly Collapsible) */}
      {isOpen && (
        <div className="p-4 sm:p-6 bg-slate-50/40 dark:bg-slate-900/40 space-y-6">
          
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Earned Credits</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {completedCredits} <span className="text-xs font-semibold text-slate-400">/ {totalDegreeCredits} Cr</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {completedPercent}% of total graduation goal
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Currently Planned</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                +{plannedCredits} <span className="text-xs font-semibold text-slate-400">Cr (Sem {studentProfile.currentSemester})</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                +{plannedPercent}% added upon semester completion
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Units to Final Clearance</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {remainingCredits} <span className="text-xs font-semibold text-slate-400">Cr Remaining</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {remainingCredits === 0 ? '🎉 All units satisfied!' : `~${Math.ceil(remainingCredits / 20)} semester(s) at typical load`}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Academic Standing</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {Math.ceil(studentProfile.currentSemester / 2) * 100}L
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                {studentProfile.entryMode === 'Direct_Entry' ? 'Direct Entry Route' : 'UTME Standard Route'}
              </div>
            </div>
          </div>

          {/* Primary Visualization Area */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xs">
            
            {/* VIEW 1: OVERVIEW DONUT & PROGRESSION BREAKDOWN */}
            {activeChartView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Donut Chart with Recharts */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="text-center mb-1">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Overall Degree Credit Distribution
                    </span>
                  </div>
                  <div className="w-full h-64 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any) => [`${value} Credit Units`, name]}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Centered Donut Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        {totalProjectedPercent}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Graduation Goal
                      </span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Earned: {completedCredits} Cr ({completedPercent}%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
                      <span>Planned: {plannedCredits} Cr ({plannedPercent}%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0"></span>
                      <span>Remaining: {remainingCredits} Cr</span>
                    </div>
                  </div>
                </div>

                {/* Milestone Progression Ladder */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Statutory Academic Milestones</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">SICT B.Tech IT Regulations</span>
                  </div>

                  <div className="space-y-2.5">
                    {milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          ms.isReached
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                            : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          <div className={`p-1 rounded-full mt-0.5 shrink-0 ${
                            ms.isReached ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs flex items-center space-x-2">
                              <span>{ms.level}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/70 dark:bg-slate-900/60 font-semibold">
                                {ms.credits}
                              </span>
                            </div>
                            <p className="text-[11px] opacity-80 mt-0.5">{ms.desc}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          ms.isReached
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {ms.isReached ? 'Cleared' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: SEMESTER-BY-SEMESTER BAR CHART */}
            {activeChartView === 'semesters' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Semester-by-Semester Credit Units Breakdown
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tracking earned units vs. currently active semester plan against statutory semester safety thresholds (Min: {minSemesterUnits} Cr, Max: {maxSemesterUnits} Cr).
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                      <span>Earned</span>
                    </span>
                    <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                      <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                      <span>Planned</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-600"></span>
                      <span>Catalog Total</span>
                    </span>
                  </div>
                </div>

                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={semesterChartData} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 28]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <ReferenceLine y={minSemesterUnits} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Min (15)', fill: '#f59e0b', fontSize: 10 }} />
                      <ReferenceLine y={maxSemesterUnits} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max (24)', fill: '#ef4444', fontSize: 10 }} />
                      <Bar dataKey="completed" name="Earned Credits" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="planned" name="Currently Planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="catalogTotal" name="Total Available in Catalog" fill="#cbd5e1" radius={[4, 4, 0, 0]} opacity={0.4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 3: NUC DOMAIN DISTRIBUTION */}
            {activeChartView === 'domains' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Curriculum Domain Credit Distribution (NUC CCMAS Benchmark)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Balance of units across foundational computing, software engineering, systems, cybersecurity, and intelligent data technologies.
                    </p>
                  </div>
                </div>

                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={domainChartData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis dataKey="fullDomain" type="category" stroke="#94a3b8" fontSize={10} width={120} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar dataKey="completed" name="Earned Units" fill="#10b981" radius={[0, 4, 4, 0]} stackId="a" />
                      <Bar dataKey="planned" name="Planned Units" fill="#3b82f6" radius={[0, 4, 4, 0]} stackId="a" />
                      <Bar dataKey="totalAvailable" name="Total in Curriculum" fill="#cbd5e1" radius={[0, 4, 4, 0]} opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

          {/* Institutional Compliance Footer Note */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              All progress metrics are calculated in real time against the <strong>FUT Minna SICT Departmental Handbook</strong> and <strong>NUC Computing CCMAS Guidelines</strong> (Minimum {minSemesterUnits} Units, Maximum {maxSemesterUnits} Units/semester; Total {totalDegreeCredits} Units for graduation).
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
