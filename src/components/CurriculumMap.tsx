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
    <div className="space-y-5">
      
      {/* Header Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>AICTE B.Tech IT Model Curriculum Map</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">4-Year Degree Course Progression Map</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Explore all 8 semesters of B.Tech Information Technology courses. Track prerequisite paths and see how subjects connect.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 flex-wrap gap-y-1.5">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-blue-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Ready to Take</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Prerequisites Needed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>In Planner</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-bold text-xs uppercase flex-shrink-0">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 rounded-lg text-xs border font-semibold whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-slate-500 font-semibold text-xs">Semester:</span>
          <select
            value={selectedSemFilter}
            onChange={e => setSelectedSemFilter(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none text-xs font-semibold"
          >
            <option value={0}>All Semesters (1-8)</option>
            {semesters.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Semesters Grid / Timeline */}
      <div className="space-y-4">
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
              <div key={semNum} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                
                {/* Semester Title & Credit Total */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      S{semNum}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Semester {semNum}</h3>
                    {semNum === studentProfile.currentSemester && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        Current Semester
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    {totalSemCredits} Credits
                  </span>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {semCourses.map(course => {
                    const isCompleted = studentProfile.completedCourseIds.includes(course.id);
                    const isInPlanner = selectedPlanCourseIds.includes(course.id);
                    const prereqCheck = validatePrerequisites(course, studentProfile.completedCourseIds);

                    let cardStatusStyle = 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300';
                    if (isCompleted) {
                      cardStatusStyle = 'bg-emerald-50/60 border-emerald-200 text-slate-900';
                    } else if (isInPlanner) {
                      cardStatusStyle = 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20';
                    } else if (!prereqCheck.prerequisitesMet) {
                      cardStatusStyle = 'bg-amber-50/40 border-amber-200/80';
                    }

                    return (
                      <div
                        key={course.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${cardStatusStyle}`}
                      >
                        <div>
                          {/* Course Code & Credits */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{course.code}</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {course.credits} Cr
                              </span>
                              {isCompleted && (
                                <span className="flex items-center text-emerald-700 text-[10px] font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> PASSED
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Name */}
                          <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">{course.name}</h4>

                          {/* Domain Badge */}
                          <div className="text-[11px] text-slate-500 mb-2 font-medium">
                            {course.domain} • Diff: {course.difficulty}/5
                          </div>

                          {/* Prerequisites List */}
                          <div className="text-xs text-slate-600 mb-3 bg-white p-2.5 rounded-lg border border-slate-200/80">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Prerequisites:</div>
                            {course.prerequisites.length === 0 ? (
                              <div className="text-slate-500 text-[11px]">None (Foundational)</div>
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
