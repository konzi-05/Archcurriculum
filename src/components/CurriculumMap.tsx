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
    <div className="space-y-5 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:20px_20px] p-2 rounded">
      
      {/* High Density Header Box */}
      <div className="bg-slate-900 border border-slate-700 rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>AICTE B.Tech IT Model Curriculum Map [Topological DAG]</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">8-Semester Course Prerequisite Tree</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete 4-year B.Tech IT course dependency DAG graph. Select domain or semester to filter topological progression.
          </p>
        </div>

        {/* High Density Legend */}
        <div className="flex items-center space-x-3 text-[10px] font-mono bg-slate-950 p-2.5 rounded border border-slate-700 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>[PASSED]</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>[PREREQ MET]</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>[MISSING]</span>
          </div>
          <div className="flex items-center space-x-1 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>[IN PLANNER]</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded border border-slate-700 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-mono text-[10px] uppercase font-bold flex-shrink-0">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-2 py-0.5 rounded text-xs border font-mono whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? 'bg-blue-600 border-blue-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-slate-400 font-mono text-[11px]">Semester:</span>
          <select
            value={selectedSemFilter}
            onChange={e => setSelectedSemFilter(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none text-xs font-mono"
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
              <div key={semNum} className="bg-slate-900/90 border border-slate-700 rounded p-4 shadow-sm">
                
                {/* Semester Title & Credit Total */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-700/80">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-blue-600/20 text-blue-400 font-bold font-mono text-xs flex items-center justify-center border border-blue-500/30">
                      S{semNum}
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">Semester {semNum}</h3>
                    {semNum === studentProfile.currentSemester && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                        Active Semester
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-700">
                    {totalSemCredits} Total Credits
                  </span>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {semCourses.map(course => {
                    const isCompleted = studentProfile.completedCourseIds.includes(course.id);
                    const isInPlanner = selectedPlanCourseIds.includes(course.id);
                    const prereqCheck = validatePrerequisites(course, studentProfile.completedCourseIds);

                    let cardStatusStyle = 'bg-slate-950/80 border-slate-700 hover:border-slate-600';
                    if (isCompleted) {
                      cardStatusStyle = 'bg-emerald-950/20 border-emerald-800/60 text-slate-100';
                    } else if (isInPlanner) {
                      cardStatusStyle = 'bg-cyan-950/30 border-cyan-500/80';
                    } else if (!prereqCheck.prerequisitesMet) {
                      cardStatusStyle = 'bg-amber-950/10 border-amber-900/40';
                    } else {
                      cardStatusStyle = 'bg-slate-900 border-slate-700';
                    }

                    return (
                      <div
                        key={course.id}
                        className={`p-3 rounded border flex flex-col justify-between transition-all ${cardStatusStyle}`}
                      >
                        <div>
                          {/* Course Code & Credits */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-blue-400">{course.code}</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-700">
                                {course.credits} Cr
                              </span>
                              {isCompleted && (
                                <span className="flex items-center text-emerald-400 text-[10px] font-mono font-bold">
                                  <CheckCircle2 className="w-3 h-3 mr-0.5" /> PASSED
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Name */}
                          <h4 className="text-xs font-bold text-slate-100 mb-1">{course.name}</h4>

                          {/* Domain Badge */}
                          <div className="text-[10px] font-mono text-slate-400 mb-2">
                            {course.domain} • Diff: {course.difficulty}/5
                          </div>

                          {/* Prerequisites List */}
                          <div className="text-[10px] font-mono text-slate-400 mb-2.5 bg-slate-900 p-2 rounded border border-slate-800">
                            <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">Prerequisite Requirements:</div>
                            {course.prerequisites.length === 0 ? (
                              <div className="text-slate-400">None (Foundational)</div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {course.prerequisites.map(pId => {
                                  const pCourse = BTECH_IT_COURSES.find(c => c.id === pId);
                                  const pMet = studentProfile.completedCourseIds.includes(pId);
                                  return (
                                    <span
                                      key={pId}
                                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                        pMet ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
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
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          <button
                            onClick={() => onOpenSyllabusModal(course)}
                            className="text-slate-400 hover:text-cyan-400 text-[10px] font-mono font-semibold flex items-center space-x-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Syllabus</span>
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => onTogglePlanCourse(course.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                                isInPlanner
                                  ? 'bg-cyan-400 text-slate-950'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
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
