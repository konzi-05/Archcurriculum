import React, { useState } from 'react';
import { Course, StudentProfile, CareerTrack, AcademicProgrammeRules } from '../../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../../data/btechItCurriculum';
import { Layers, AlertTriangle, CheckCircle2, ChevronRight, RefreshCw, Plus, Sparkles, BookOpen, Calendar, ShieldCheck } from 'lucide-react';

interface GraduationRoadmapViewProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  customSemesterMap: Record<string, number>;
  programmeRules?: AcademicProgrammeRules;
  onUpdateCourseSemester: (courseId: string, targetSemester: number) => void;
  onAutoGenerateRoadmap: () => void;
  onOpenSyllabusModal: (course: Course) => void;
  onTogglePlanCourse: (courseId: string) => void;
}

export const GraduationRoadmapView: React.FC<GraduationRoadmapViewProps> = ({
  studentProfile,
  selectedPlanCourseIds,
  customSemesterMap,
  programmeRules,
  onUpdateCourseSemester,
  onAutoGenerateRoadmap,
  onOpenSyllabusModal,
  onTogglePlanCourse
}) => {
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'ALL'>('ALL');
  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];
  const maxSemesterUnits = programmeRules?.maxSemesterUnits ?? 24;

  // Get effective semester for each course (from customSemesterMap or default course.semester)
  const getCourseSemester = (course: Course): number => {
    return customSemesterMap[course.id] ?? course.semester;
  };

  // Group courses by semester (1-8)
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // Helper to check prerequisite violations in the multi-semester timeline
  const getPrerequisiteConflicts = () => {
    const conflicts: { course: Course; prereqCourse: Course; courseSem: number; prereqSem: number }[] = [];
    
    BTECH_IT_COURSES.forEach(course => {
      const courseSem = getCourseSemester(course);
      
      // Check if this course is scheduled or completed
      if (course.prerequisites && course.prerequisites.length > 0) {
        course.prerequisites.forEach(prereqId => {
          const prereqCourse = BTECH_IT_COURSES.find(c => c.id === prereqId);
          if (prereqCourse) {
            const prereqSem = getCourseSemester(prereqCourse);
            // Violation if course is taken in same or earlier semester than its prerequisite
            if (courseSem <= prereqSem) {
              conflicts.push({
                course,
                prereqCourse,
                courseSem,
                prereqSem
              });
            }
          }
        });
      }
    });

    return conflicts;
  };

  const prereqConflicts = getPrerequisiteConflicts();

  return (
    <div className="space-y-8">
      
      {/* Banner & Control Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 px-3.5 py-1.5 rounded-full mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>4-Year / 8-Semester Graduation Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Comprehensive B.Tech IT Curriculum Roadmap
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Target Career Track: <strong className="text-blue-600 dark:text-blue-400 font-bold">{targetTrack.title}</strong>. Customize semester placements, review prerequisite flows, and manage full graduation compliance.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onAutoGenerateRoadmap}
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-200 dark:shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Sequence Track Electives</span>
          </button>
        </div>
      </div>

      {/* Prerequisite Sequence Warnings if Any */}
      {prereqConflicts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-200 space-y-2">
          <div className="flex items-center space-x-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Prerequisite Timeline Conflict Detected ({prereqConflicts.length})</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300">
            The following courses are currently scheduled in the same or earlier semester as their required prerequisite. Please adjust their target semester.
          </p>
          <ul className="space-y-1 text-[11px] pl-5 list-disc">
            {prereqConflicts.map((c, i) => (
              <li key={i}>
                <strong>{c.course.name}</strong> (Sem {c.courseSem}) requires <strong>{c.prereqCourse.name}</strong> (currently Sem {c.prereqSem}).
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Semester Filter Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setSelectedSemesterFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            selectedSemesterFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Semesters (1 - 8)
        </button>
        {semesters.map(s => {
          const isCurrent = s === studentProfile.currentSemester;
          return (
            <button
              key={s}
              onClick={() => setSelectedSemesterFilter(s)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
                selectedSemesterFilter === s
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Sem {s}</span>
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
            </button>
          );
        })}
      </div>

      {/* 8-Semester Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {semesters
          .filter(s => selectedSemesterFilter === 'ALL' || selectedSemesterFilter === s)
          .map(semNum => {
            const semCourses = BTECH_IT_COURSES.filter(c => getCourseSemester(c) === semNum);
            const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
            const semWorkload = semCourses.reduce((sum, c) => sum + c.workloadHours, 0);
            const isCompleted = semNum < studentProfile.currentSemester;
            const isCurrent = semNum === studentProfile.currentSemester;

            return (
              <div
                key={semNum}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 transition-colors ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-500/10 dark:ring-blue-500/20'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Semester Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      S{semNum}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Semester {semNum}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Current
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Completed
                          </span>
                        )}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {semCourses.length} Subjects • {semCredits} / {maxSemesterUnits} Credits • {semWorkload} hrs/wk
                      </div>
                    </div>
                  </div>

                  {/* Credit Bar Indicator */}
                  <div className="text-right">
                    <span className={`text-xs font-bold ${semCredits > maxSemesterUnits ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {semCredits} Cr
                    </span>
                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${semCredits > maxSemesterUnits ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, (semCredits / maxSemesterUnits) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Course List inside Semester */}
                <div className="space-y-2 flex-1">
                  {semCourses.map(course => {
                    const isCompletedCourse = studentProfile.completedCourseIds.includes(course.id);
                    const isPlannedCourse = selectedPlanCourseIds.includes(course.id);
                    const isElective = course.type === 'Elective';

                    return (
                      <div
                        key={course.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                          isCompletedCourse
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/60'
                            : isPlannedCourse
                            ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-bold text-blue-700 dark:text-blue-300 font-mono">{course.futMinnaCode || course.code}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{course.name}</span>
                            {isCompletedCourse && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>{course.credits} Units</span>
                            <span>•</span>
                            <span className="truncate">{course.type}</span>
                            <span>•</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{course.academicLevel || 'Level'}</span>
                          </div>
                        </div>

                        {/* Controls & Semester Relocation Dropdown */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {/* Syllabus trigger */}
                          <button
                            onClick={() => onOpenSyllabusModal(course)}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="View Syllabus"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>

                          {/* Reassign Semester Selector for Electives */}
                          {isElective && (
                            <select
                              value={getCourseSemester(course)}
                              onChange={(e) => onUpdateCourseSemester(course.id, Number(e.target.value))}
                              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                              title="Move course to another semester"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>
                                  Sem {sem}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Semester Footer Summary */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    Core: {semCourses.filter(c => c.type === 'Core').length} | Electives: {semCourses.filter(c => c.type === 'Elective').length}
                  </span>
                  {semCredits > 24 && (
                    <span className="text-red-600 font-bold flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-0.5" /> Credit Cap Exceeded
                    </span>
                  )}
                </div>

              </div>
            );
          })}
      </div>

    </div>
  );
};
