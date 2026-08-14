import React, { useState, useEffect } from 'react';
import { Course, StudentProfile, AiInsightResponse, SemesterGoal } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';
import { SlidersHorizontal, Trash2, Sparkles, AlertTriangle, Download, CheckCircle2, Award, BookOpen, Clock, Zap, ShieldCheck, Layers, Calculator, Calendar, Target } from 'lucide-react';

import { GraduationRoadmapView } from './planner/GraduationRoadmapView';
import { GpaCalculatorView } from './planner/GpaCalculatorView';
import { WeeklyTimetableGrid } from './planner/WeeklyTimetableGrid';
import { SemesterGoalsTracker } from './planner/SemesterGoalsTracker';

interface SemesterPlannerProps {
  selectedPlanCourseIds: string[];
  studentProfile: StudentProfile;
  onRemovePlanCourse: (courseId: string) => void;
  onClearPlan: () => void;
  aiInsight: AiInsightResponse | null;
  isLoadingAiInsight: boolean;
  onRequestAiInsight: () => void;
  onExportPlan: () => void;
  onOpenDatabaseExport?: () => void;
  onOpenSyllabusModal: (course: Course) => void;
  onTogglePlanCourse: (courseId: string) => void;
}

export const SemesterPlanner: React.FC<SemesterPlannerProps> = ({
  selectedPlanCourseIds,
  studentProfile,
  onRemovePlanCourse,
  onClearPlan,
  aiInsight,
  isLoadingAiInsight,
  onRequestAiInsight,
  onExportPlan,
  onOpenDatabaseExport,
  onOpenSyllabusModal,
  onTogglePlanCourse
}) => {
  const [plannerTab, setPlannerTab] = useState<'ACTIVE' | 'ROADMAP' | 'GPA' | 'TIMETABLE' | 'GOALS'>('ACTIVE');

  // Local storage for custom elective semester placements
  const [customSemesterMap, setCustomSemesterMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('app-custom-semester-map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Local storage for personalized semester goals
  const [semesterGoals, setSemesterGoals] = useState<SemesterGoal[]>(() => {
    try {
      const saved = localStorage.getItem('app-semester-goals');
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      { id: '1', semester: 1, title: 'Master C Programming & Low-Level Memory Management', category: 'Academic', completed: true },
      { id: '2', semester: 3, title: 'Build Full-Stack Java OOP Project', category: 'Project', completed: true },
      { id: '3', semester: 5, title: 'Prepare AWS Certified Solutions Architect Associate', category: 'Certification', completed: false },
      { id: '4', semester: 6, title: 'Apply for Top Tier Software Engineering Summer Internship', category: 'Career', completed: false },
      { id: '5', semester: 7, title: 'Submit B.Tech Capstone Project Abstract & Architecture', category: 'Project', completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('app-custom-semester-map', JSON.stringify(customSemesterMap));
  }, [customSemesterMap]);

  useEffect(() => {
    localStorage.setItem('app-semester-goals', JSON.stringify(semesterGoals));
  }, [semesterGoals]);

  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  const selectedCourses: Course[] = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));
  
  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalWorkloadHours = selectedCourses.reduce((sum, c) => sum + c.workloadHours, 0);
  const maxCreditsLimit = 24; // Standard NUC CCMAS / FUT Minna maximum semester credit cap

  const theoryCount = selectedCourses.filter(c => c.type === 'Core' || c.type === 'Elective').length;
  const labProjectCount = selectedCourses.filter(c => c.type === 'Lab' || c.type === 'Project').length;

  // Handlers for goals
  const handleAddGoal = (newGoal: Omit<SemesterGoal, 'id'>) => {
    const created: SemesterGoal = {
      ...newGoal,
      id: Date.now().toString()
    };
    setSemesterGoals(prev => [...prev, created]);
  };

  const handleToggleGoal = (goalId: string) => {
    setSemesterGoals(prev => prev.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (goalId: string) => {
    setSemesterGoals(prev => prev.filter(g => g.id !== goalId));
  };

  // Reassign course semester
  const handleUpdateCourseSemester = (courseId: string, targetSemester: number) => {
    setCustomSemesterMap(prev => ({
      ...prev,
      [courseId]: targetSemester
    }));
  };

  // Auto-generate 8-semester elective sequence matching career track
  const handleAutoGenerateRoadmap = () => {
    const newMap: Record<string, number> = { ...customSemesterMap };
    
    // Get track recommended electives
    const trackElectiveIds = targetTrack.recommendedElectiveIds;
    
    // Distribute track electives cleanly across Semesters 5, 6, 7, 8
    trackElectiveIds.forEach((eId, index) => {
      const targetSem = 5 + (index % 4);
      newMap[eId] = targetSem;
    });

    setCustomSemesterMap(newMap);
  };

  return (
    <div className="space-y-8">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2.5 rounded-2xl shadow-xs overflow-x-auto transition-colors">
        <button
          onClick={() => setPlannerTab('ACTIVE')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            plannerTab === 'ACTIVE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Active Semester Plan ({selectedCourses.length})</span>
        </button>

        <button
          onClick={() => setPlannerTab('ROADMAP')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            plannerTab === 'ROADMAP'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>8-Semester Graduation Roadmap</span>
        </button>

        <button
          onClick={() => setPlannerTab('GPA')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            plannerTab === 'GPA'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>GPA / CGPA Calculator</span>
        </button>

        <button
          onClick={() => setPlannerTab('TIMETABLE')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            plannerTab === 'TIMETABLE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Weekly Timetable</span>
        </button>

        <button
          onClick={() => setPlannerTab('GOALS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            plannerTab === 'GOALS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Milestones ({semesterGoals.filter(g => g.semester === studentProfile.currentSemester).length})</span>
        </button>
      </div>

      {/* RENDER VIEW ACCORDING TO ACTIVE PLANNER TAB */}

      {plannerTab === 'ROADMAP' && (
        <GraduationRoadmapView
          studentProfile={studentProfile}
          selectedPlanCourseIds={selectedPlanCourseIds}
          customSemesterMap={customSemesterMap}
          onUpdateCourseSemester={handleUpdateCourseSemester}
          onAutoGenerateRoadmap={handleAutoGenerateRoadmap}
          onOpenSyllabusModal={onOpenSyllabusModal}
          onTogglePlanCourse={onTogglePlanCourse}
        />
      )}

      {plannerTab === 'GPA' && (
        <GpaCalculatorView
          studentProfile={studentProfile}
          selectedPlanCourseIds={selectedPlanCourseIds}
        />
      )}

      {plannerTab === 'TIMETABLE' && (
        <WeeklyTimetableGrid
          studentProfile={studentProfile}
          selectedPlanCourseIds={selectedPlanCourseIds}
        />
      )}

      {plannerTab === 'GOALS' && (
        <SemesterGoalsTracker
          currentSemester={studentProfile.currentSemester}
          goals={semesterGoals}
          onAddGoal={handleAddGoal}
          onToggleGoal={handleToggleGoal}
          onDeleteGoal={handleDeleteGoal}
        />
      )}

      {plannerTab === 'ACTIVE' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Header Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors">
            <div>
              <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-3.5 py-1.5 rounded-full mb-3">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Credit & Workload Optimizer</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Semester {studentProfile.currentSemester} Course Schedule Planner</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Combine required core subjects with top-recommended electives while managing your credit limits and study workload.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              {selectedCourses.length > 0 && (
                <button
                  onClick={onClearPlan}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  Clear
                </button>
              )}

              {onOpenDatabaseExport && (
                <button
                  onClick={onOpenDatabaseExport}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-colors"
                  title="Export complete database schemas and records for Final Year Project report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export DB (FYP)</span>
                </button>
              )}

              <button
                onClick={onExportPlan}
                disabled={selectedCourses.length === 0}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Plan (.md)</span>
              </button>

              <button
                onClick={onRequestAiInsight}
                disabled={isLoadingAiInsight || selectedCourses.length === 0}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs shadow-blue-200 dark:shadow-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingAiInsight ? 'Generating...' : 'Get Strategy'}</span>
              </button>
            </div>
          </div>

          {/* Credit & Workload Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Credits Counter */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase mb-1">
                <span>Planned Credits</span>
                <span className="text-slate-800 dark:text-slate-200">{totalCredits} / {maxCreditsLimit} Cr</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                {totalCredits} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Credits</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    totalCredits > maxCreditsLimit ? 'bg-red-500' : totalCredits >= 18 ? 'bg-blue-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalCredits / maxCreditsLimit) * 100)}%` }}
                ></div>
              </div>
              {totalCredits > maxCreditsLimit && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-bold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Exceeds NUC / FUT Minna 24 Unit cap!
                </p>
              )}
            </div>

            {/* Workload Hours */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase mb-1">
                <span>Estimated Workload</span>
                <span className="text-slate-800 dark:text-slate-200">Target: {studentProfile.weeklyStudyHoursBudget} h/wk</span>
              </div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                {totalWorkloadHours} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">hrs/week</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lectures, practical labs, and personal study hours.
              </p>
            </div>

            {/* Theory vs Lab Distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs transition-colors">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Subject Split</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                {theoryCount} Theory / {labProjectCount} Lab
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimal balance for theory exams & hands-on practicals.
              </p>
            </div>

          </div>

          {/* Selected Courses List - Grouped into Core and Electives */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Enrolled Course Schedule ({selectedCourses.length} Subjects • {totalCredits} Units)
              </h3>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="text-purple-600 dark:text-purple-400">{selectedCourses.filter(c => c.type === 'Core' || c.type === 'Lab').length} Core</span>
                <span>•</span>
                <span className="text-blue-600 dark:text-blue-400">{selectedCourses.filter(c => c.type === 'Elective').length} Electives</span>
              </div>
            </div>

            {selectedCourses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-xs font-medium">No courses added to your planner yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Go to the "Elective Recommendations" tab or "Curriculum Progression Map" and click "+ Add to Plan".
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Core Courses Section */}
                {selectedCourses.filter(c => c.type === 'Core' || c.type === 'Lab').length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                      <span>📘 Mandatory Core Courses</span>
                      <span>{selectedCourses.filter(c => c.type === 'Core' || c.type === 'Lab').reduce((s, c) => s + c.credits, 0)} Units</span>
                    </div>
                    <div className="space-y-2">
                      {selectedCourses.filter(c => c.type === 'Core' || c.type === 'Lab').map((course, idx) => (
                        <div
                          key={course.id}
                          className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center border border-purple-200 dark:border-purple-800 text-xs shadow-2xs">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="font-bold text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 font-mono">{course.futMinnaCode || course.code}</span>
                                {course.nucCcmasCode && (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-mono">NUC: {course.nucCcmasCode}</span>
                                )}
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{course.name}</h4>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {course.domain} • {course.credits} Units • {course.workloadHours} hrs/wk
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onOpenSyllabusModal(course)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-white/80 dark:hover:bg-slate-800"
                            >
                              Syllabus
                            </button>
                            <button
                              onClick={() => onRemovePlanCourse(course.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Remove course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Electives Section */}
                {selectedCourses.filter(c => c.type === 'Elective').length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      <span>🎯 Elective Specializations</span>
                      <span>{selectedCourses.filter(c => c.type === 'Elective').reduce((s, c) => s + c.credits, 0)} Units</span>
                    </div>
                    <div className="space-y-2">
                      {selectedCourses.filter(c => c.type === 'Elective').map((course, idx) => (
                        <div
                          key={course.id}
                          className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800 text-xs shadow-2xs">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="font-bold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-mono">{course.futMinnaCode || course.code}</span>
                                {course.nucCcmasCode && (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-mono">NUC: {course.nucCcmasCode}</span>
                                )}
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{course.name}</h4>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {course.domain} • {course.credits} Units • {course.workloadHours} hrs/wk
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onOpenSyllabusModal(course)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-white/80 dark:hover:bg-slate-800"
                            >
                              Syllabus
                            </button>
                            <button
                              onClick={() => onRemovePlanCourse(course.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Remove course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Academic Advice Report Section */}
          {aiInsight && (
            <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-blue-200/90 dark:border-blue-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
              <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Academic Strategy & Guidance</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Career Readiness:</span>
                  <span className="text-base font-extrabold text-blue-700 dark:text-blue-400">{aiInsight.careerReadinessIndex}%</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Plan Overview</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-100/80 dark:border-slate-700">
                  {aiInsight.summary}
                </p>
              </div>

              {/* Strategy */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Recommended Strategy</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-100/80 dark:border-slate-700">
                  {aiInsight.semesterStrategy}
                </p>
              </div>

              {/* Grid: Action Steps & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs">
                
                {/* Actionable Steps */}
                <div className="bg-white/80 dark:bg-slate-800/80 p-4.5 sm:p-5 rounded-xl border border-blue-100/80 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Actionable Steps</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-xs">
                    {aiInsight.actionableSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Industry Certifications */}
                <div className="bg-white/80 dark:bg-slate-800/80 p-4.5 sm:p-5 rounded-xl border border-blue-100/80 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2 text-xs">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Suggested Certifications</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-xs">
                    {aiInsight.suggestedCertifications.map((cert, idx) => (
                      <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Industry Trends */}
              <div className="text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-blue-100 dark:border-slate-800 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200">Market Trend Note:</strong> {aiInsight.industryTrends}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
