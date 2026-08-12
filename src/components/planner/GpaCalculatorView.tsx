import React, { useState } from 'react';
import { StudentProfile, Grade, GRADE_POINTS } from '../../types/curriculum';
import { BTECH_IT_COURSES } from '../../data/btechItCurriculum';
import { Award, Calculator, Target, TrendingUp, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface GpaCalculatorViewProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
}

export const GpaCalculatorView: React.FC<GpaCalculatorViewProps> = ({
  studentProfile,
  selectedPlanCourseIds
}) => {
  const [targetCgpa, setTargetCgpa] = useState<number>(8.5);
  const [simulatedGrades, setSimulatedGrades] = useState<Record<string, Grade>>({});

  // Get completed courses and their grades
  const completedCourses = BTECH_IT_COURSES.filter(c => studentProfile.completedCourseIds.includes(c.id));
  
  // Calculate current earned credits & points
  let completedCredits = 0;
  let completedPoints = 0;

  completedCourses.forEach(course => {
    const grade = studentProfile.grades[course.id] || 'A';
    const points = GRADE_POINTS[grade] ?? 9;
    completedCredits += course.credits;
    completedPoints += course.credits * points;
  });

  const currentCgpa = completedCredits > 0 ? (completedPoints / completedCredits) : 0;

  // Active / Planned Courses
  const plannedCourses = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));
  const plannedCredits = plannedCourses.reduce((sum, c) => sum + c.credits, 0);

  // Total B.Tech Degree Credits (typically ~160 Cr over 8 Semesters)
  const totalDegreeCredits = 160;
  const remainingCredits = Math.max(0, totalDegreeCredits - completedCredits);

  // Calculate required average SGPA for remaining semesters to reach target CGPA
  // Formula: (TargetCGPA * TotalCredits - EarnedPoints) / RemainingCredits
  const requiredRemainingPoints = (targetCgpa * totalDegreeCredits) - completedPoints;
  const requiredRemainingSgpa = remainingCredits > 0 ? Math.max(0, requiredRemainingPoints / remainingCredits) : 0;

  // Calculate projected CGPA with simulated current semester grades
  let simCredits = completedCredits;
  let simPoints = completedPoints;

  plannedCourses.forEach(course => {
    const simGrade = simulatedGrades[course.id] || 'A';
    const pts = GRADE_POINTS[simGrade] ?? 9;
    simCredits += course.credits;
    simPoints += course.credits * pts;
  });

  const projectedCgpa = simCredits > 0 ? (simPoints / simCredits) : currentCgpa;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-3 py-1 rounded-full mb-2">
          <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Academic Performance & Honors Calculator</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          CGPA Projection & Degree Honor Trajectory
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
          Track cumulative grade points across completed courses, set graduation goals (First Class with Distinction / Honors), and project future SGPA requirements.
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Current CGPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
            <span>Earned CGPA</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono">{completedCredits} / 160 Cr</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
            {currentCgpa.toFixed(2)} <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Based on {completedCourses.length} completed B.Tech subjects.
          </div>
        </div>

        {/* Target CGPA Goal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
            <span>Target Honors CGPA</span>
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <input
              type="number"
              step="0.1"
              min="5.0"
              max="10.0"
              value={targetCgpa}
              onChange={e => setTargetCgpa(Number(e.target.value))}
              className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {targetCgpa >= 8.5 ? 'First Class with Distinction' : targetCgpa >= 7.5 ? 'First Class' : 'Second Class'}
          </div>
        </div>

        {/* Required SGPA for Remaining Semesters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
            <span>Required Avg SGPA</span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className={`text-3xl font-extrabold mb-1 ${
            requiredRemainingSgpa > 10
              ? 'text-red-600 dark:text-red-400'
              : requiredRemainingSgpa > 8.5
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-indigo-600 dark:text-indigo-400'
          }`}>
            {requiredRemainingSgpa > 10 ? 'Unachievable' : requiredRemainingSgpa.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Average SGPA needed across remaining {remainingCredits} credits.
          </div>
        </div>

      </div>

      {/* Grade Simulation Matrix for Current Semester */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Semester {studentProfile.currentSemester} Interactive Grade Simulator
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select expected grades for active planned courses to view live projected CGPA updates.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Projected CGPA: </span>
            <strong className="text-base font-extrabold text-blue-600 dark:text-blue-400">{projectedCgpa.toFixed(2)}</strong>
          </div>
        </div>

        {plannedCourses.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
            No courses in active planner. Add electives or core subjects to simulate grades.
          </p>
        ) : (
          <div className="space-y-2.5">
            {plannedCourses.map(course => {
              const currentSimGrade = simulatedGrades[course.id] || 'A';
              return (
                <div
                  key={course.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{course.code}</span>
                      <h5 className="font-bold text-slate-900 dark:text-slate-100">{course.name}</h5>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {course.credits} Credits • {course.domain}
                    </div>
                  </div>

                  {/* Grade Selector Button Group */}
                  <div className="flex items-center space-x-1">
                    {(['A+', 'A', 'B', 'C', 'D', 'F'] as Grade[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setSimulatedGrades(prev => ({ ...prev, [course.id]: g }))}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                          currentSimGrade === g
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Courses Transcript breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          Verified Transcript History ({completedCourses.length} Subjects)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {completedCourses.map(course => {
            const grade = studentProfile.grades[course.id] || 'A';
            const pts = GRADE_POINTS[grade] ?? 9;
            return (
              <div
                key={course.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{course.code}: {course.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Sem {course.semester} • {course.credits} Credits
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded font-extrabold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {grade} ({pts} pts)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
