import React, { useState } from 'react';
import { Course, StudentProfile, AcademicDomain } from '../types/curriculum';
import { BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { validatePrerequisites } from '../services/recommendationEngine';
import { Compass, CheckCircle2, AlertTriangle, BookOpen, Layers, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface CurriculumMapProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  onTogglePlanCourse: (courseId: string) => void;
  onOpenSyllabusModal: (course: Course) => void;
}

export const CurriculumMap: React.FC<CurriculumMapProps> = ({
  studentProfile,
  selectedPlanCourseIds,
  onTogglePlanCourse,
  onOpenSyllabusModal
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedSemFilter, setSelectedSemFilter] = useState<number>(0); // 0 = all semesters

  const domains: (AcademicDomain | 'All')[] = [
    'All',
    'AI & Data Science',
    'Software Engineering',
    'Cloud & Systems',
    'Cybersecurity & Networks',
    'Hardware & Embedded',
    'Math & Foundational CS'
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-8">
      
      {/* Header Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-3.5 py-1.5 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AICTE B.Tech IT Model Curriculum Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">4-Year Degree Course Progression Map</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Explore all 8 semesters of B.Tech Information Technology courses. Track prerequisite paths and see how subjects connect.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex-wrap gap-y-2">
          <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-blue-700 dark:text-blue-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Ready to Take</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Prerequisites Needed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-700 dark:text-indigo-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>In Planner</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-xs shadow-xs transition-colors">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase flex-shrink-0 mr-1">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-xl text-xs border font-semibold whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">Semester:</span>
          <select
            value={selectedSemFilter}
            onChange={e => setSelectedSemFilter(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none text-xs font-semibold"
          >
            <option value={0}>All Semesters (1-8)</option>
            {semesters.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Semesters Grid / Timeline */}
      <div className="space-y-6 sm:space-y-8">
        {semesters
          .filter(s => selectedSemFilter === 0 || selectedSemFilter === s)
          .map(semNum => {
            let semCourses = BTECH_IT_COURSES.filter(c => c.semester === semNum);
            if (selectedDomain !== 'All') {
              semCourses = semCourses.filter(c => c.domain === selectedDomain);
            }

            if (semCourses.length === 0) return null;

            const totalSemCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

            return (
              <div key={semNum} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs transition-colors">
                
                {/* Semester Title & Credit Total */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      S{semNum}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Semester {semNum}</h3>
                    {semNum === studentProfile.currentSemester && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                        Current Semester
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                    {totalSemCredits} Credits
                  </span>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {semCourses.map(course => {
                    const isCompleted = studentProfile.completedCourseIds.includes(course.id);
                    const isInPlanner = selectedPlanCourseIds.includes(course.id);
                    const prereqCheck = validatePrerequisites(course, studentProfile.completedCourseIds);

                    let cardStatusStyle = 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600';
                    if (isCompleted) {
                      cardStatusStyle = 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white';
                    } else if (isInPlanner) {
                      cardStatusStyle = 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20';
                    } else if (!prereqCheck.prerequisitesMet) {
                      cardStatusStyle = 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800';
                    }

                    return (
                      <div
                        key={course.id}
                        className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all space-y-3 ${cardStatusStyle}`}
                      >
                        <div className="space-y-2">
                          {/* Course Code & Credits */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">{course.code}</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {course.credits} Cr
                              </span>
                              {isCompleted && (
                                <span className="flex items-center text-emerald-700 dark:text-emerald-300 text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" /> PASSED
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Name */}
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{course.name}</h4>

                          {/* Domain Badge */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {course.domain} • Diff: {course.difficulty}/5
                          </div>

                          {/* Prerequisites List */}
                          <div className="text-xs text-slate-600 dark:text-slate-300 my-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Prerequisites:</div>
                            {course.prerequisites.length === 0 ? (
                              <div className="text-slate-500 dark:text-slate-400 text-[11px]">None (Foundational)</div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {course.prerequisites.map(pId => {
                                  const pCourse = BTECH_IT_COURSES.find(c => c.id === pId);
                                  const pMet = studentProfile.completedCourseIds.includes(pId);
                                  return (
                                    <span
                                      key={pId}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        pMet ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                      }`}
                                    >
                                      {pCourse ? pCourse.code : pId}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 text-xs">
                          <button
                            onClick={() => onOpenSyllabusModal(course)}
                            className="text-slate-600 hover:text-blue-600 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Syllabus</span>
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => onTogglePlanCourse(course.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                isInPlanner
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {isInPlanner ? 'In Plan' : '+ Add'}
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
      </div>

    </div>
  );
};
