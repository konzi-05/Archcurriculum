import React, { useState } from 'react';
import { Course, StudentProfile, AiInsightResponse } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';
import { SlidersHorizontal, Trash2, Sparkles, AlertTriangle, Download, CheckCircle2, Award, BookOpen, Clock, Zap, ShieldCheck } from 'lucide-react';

interface SemesterPlannerProps {
  selectedPlanCourseIds: string[];
  studentProfile: StudentProfile;
  onRemovePlanCourse: (courseId: string) => void;
  onClearPlan: () => void;
  aiInsight: AiInsightResponse | null;
  isLoadingAiInsight: boolean;
  onRequestAiInsight: () => void;
  onExportPlan: () => void;
}

export const SemesterPlanner: React.FC<SemesterPlannerProps> = ({
  selectedPlanCourseIds,
  studentProfile,
  onRemovePlanCourse,
  onClearPlan,
  aiInsight,
  isLoadingAiInsight,
  onRequestAiInsight,
  onExportPlan
}) => {
  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  const selectedCourses: Course[] = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));
  
  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalWorkloadHours = selectedCourses.reduce((sum, c) => sum + c.workloadHours, 0);
  const maxCreditsLimit = 24; // Standard AICTE maximum semester credit cap

  const theoryCount = selectedCourses.filter(c => c.type === 'Core' || c.type === 'Elective').length;
  const labProjectCount = selectedCourses.filter(c => c.type === 'Lab' || c.type === 'Project').length;

  return (
    <div className="space-y-5">
      
      {/* Header Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Credit & Workload Optimizer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Semester {studentProfile.currentSemester} Course Schedule Planner</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Combine required core subjects with top-recommended electives while managing your credit limits and study workload.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedCourses.length > 0 && (
            <button
              onClick={onClearPlan}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Clear
            </button>
          )}

          <button
            onClick={onExportPlan}
            disabled={selectedCourses.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan (.md)</span>
          </button>

          <button
            onClick={onRequestAiInsight}
            disabled={isLoadingAiInsight || selectedCourses.length === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs shadow-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoadingAiInsight ? 'Generating...' : 'Get Strategy'}</span>
          </button>
        </div>
      </div>

      {/* Credit & Workload Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Credits Counter */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-1">
            <span>Planned Credits</span>
            <span className="text-slate-800">{totalCredits} / {maxCreditsLimit} Cr</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {totalCredits} <span className="text-xs font-medium text-slate-500">Credits</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalCredits > maxCreditsLimit ? 'bg-red-500' : totalCredits >= 18 ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (totalCredits / maxCreditsLimit) * 100)}%` }}
            ></div>
          </div>
          {totalCredits > maxCreditsLimit && (
            <p className="text-xs text-red-600 mt-2 font-bold flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Exceeds AICTE 24 Cr cap!
            </p>
          )}
        </div>

        {/* Workload Hours */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase mb-1">
            <span>Estimated Workload</span>
            <span className="text-slate-800">Target: {studentProfile.weeklyStudyHoursBudget} h/wk</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mb-1">
            {totalWorkloadHours} <span className="text-xs font-medium text-slate-500">hrs/week</span>
          </div>
          <p className="text-xs text-slate-500">
            Lectures, practical labs, and personal study hours.
          </p>
        </div>

        {/* Theory vs Lab Distribution */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Subject Split</div>
          <div className="text-2xl font-extrabold text-slate-900 mb-1">
            {theoryCount} Theory / {labProjectCount} Lab
          </div>
          <p className="text-xs text-slate-500">
            Optimal balance for theory exams & hands-on practicals.
          </p>
        </div>

      </div>

      {/* Selected Courses List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">Enrolled Course Schedule ({selectedCourses.length})</h3>

        {selectedCourses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-xs font-medium">No courses added to your planner yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Go to the "Elective Recommendations" tab or "Curriculum Progression Map" and click "+ Add to Plan".
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedCourses.map((course, idx) => (
              <div
                key={course.id}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-xs shadow-2xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{course.code}</span>
                      <h4 className="font-bold text-slate-900 text-xs">{course.name}</h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">
                      {course.domain} • {course.credits} Credits • {course.workloadHours} hrs/wk
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemovePlanCourse(course.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Remove course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Advice Report Section */}
      {aiInsight && (
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 border border-blue-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Academic Strategy & Guidance</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-600 font-semibold">Career Readiness:</span>
              <span className="text-base font-extrabold text-blue-700">{aiInsight.careerReadinessIndex}%</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Plan Overview</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-blue-100/80">
              {aiInsight.summary}
            </p>
          </div>

          {/* Strategy */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Strategy</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-blue-100/80">
              {aiInsight.semesterStrategy}
            </p>
          </div>

          {/* Grid: Action Steps & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            
            {/* Actionable Steps */}
            <div className="bg-white/80 p-4 rounded-xl border border-blue-100/80">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Actionable Steps</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700 text-xs">
                {aiInsight.actionableSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industry Certifications */}
            <div className="bg-white/80 p-4 rounded-xl border border-blue-100/80">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-1.5 text-xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Suggested Certifications</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700 text-xs">
                {aiInsight.suggestedCertifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Industry Trends */}
          <div className="text-xs text-slate-600 pt-2 border-t border-blue-100">
            <strong className="text-slate-800">Market Trend Note:</strong> {aiInsight.industryTrends}
          </div>

        </div>
      )}

    </div>
  );
};
