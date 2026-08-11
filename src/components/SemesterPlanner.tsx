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
      
      {/* High Density Header Box */}
      <div className="bg-slate-900 border border-slate-700 rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Credit & Workload Optimizer [AICTE Rule-Engine]</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Semester {studentProfile.currentSemester} Course Schedule Planner</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Combine required core modules with top-ranking electives. Enforce AICTE credit cap (24.0 Cr) and workload limits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedCourses.length > 0 && (
            <button
              onClick={onClearPlan}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition-colors border border-slate-700"
            >
              Clear
            </button>
          )}

          <button
            onClick={onExportPlan}
            disabled={selectedCourses.length === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors border border-slate-700 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Plan (.md)</span>
          </button>

          <button
            onClick={onRequestAiInsight}
            disabled={isLoadingAiInsight || selectedCourses.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoadingAiInsight ? 'Analyzing...' : 'Gemini AI Strategy'}</span>
          </button>
        </div>
      </div>

      {/* Credit & Workload Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Credits Counter */}
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>Planned Credits</span>
            <span>{totalCredits} / {maxCreditsLimit} Cr</span>
          </div>
          <div className="text-xl font-bold text-slate-100 mb-1.5">
            {totalCredits} <span className="text-xs font-normal text-slate-400">Credits</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all ${
                totalCredits > maxCreditsLimit ? 'bg-red-500' : totalCredits >= 18 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (totalCredits / maxCreditsLimit) * 100)}%` }}
            ></div>
          </div>
          {totalCredits > maxCreditsLimit && (
            <p className="text-[10px] text-red-400 mt-1.5 font-bold flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" /> Exceeds AICTE 24 Cr cap!
            </p>
          )}
        </div>

        {/* Workload Hours */}
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase mb-1">
            <span>Estimated Workload</span>
            <span>Target: {studentProfile.weeklyStudyHoursBudget} h/wk</span>
          </div>
          <div className="text-xl font-bold text-cyan-400 mb-1">
            {totalWorkloadHours} <span className="text-xs font-normal text-slate-400">hrs/week</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">
            Lectures, practical labs, and personal study hours.
          </p>
        </div>

        {/* Theory vs Lab Distribution */}
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Subject Split</div>
          <div className="text-lg font-bold text-slate-100 mb-1 font-mono">
            {theoryCount} Theory / {labProjectCount} Lab
          </div>
          <p className="text-[10px] text-slate-400">
            Optimal balance for theory exams & hands-on practicals.
          </p>
        </div>

      </div>

      {/* Selected Courses List */}
      <div className="bg-slate-900 border border-slate-700 rounded p-4">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wide mb-3">Enrolled Course Schedule ({selectedCourses.length})</h3>

        {selectedCourses.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs font-mono">No courses added to your planner yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Go to the "AI Elective Match" tab or "DAG Curriculum Map" and click "+ Add to Plan".
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedCourses.map((course, idx) => (
              <div
                key={course.id}
                className="p-3 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded bg-slate-900 text-slate-400 font-bold flex items-center justify-center border border-slate-700 text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-400">{course.code}</span>
                      <h4 className="font-bold text-slate-100 font-sans text-xs">{course.name}</h4>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {course.domain} • {course.credits} Credits • {course.workloadHours} hrs/wk
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemovePlanCourse(course.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"
                  title="Remove course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gemini AI Strategic Counsel Report Section */}
      {aiInsight && (
        <div className="bg-slate-900 border border-blue-500/40 rounded p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Gemini AI Strategic Academic Advice</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Readiness Score:</span>
              <span className="text-sm font-bold text-cyan-400">{aiInsight.careerReadinessIndex}%</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Executive Summary</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800 font-sans">
              {aiInsight.summary}
            </p>
          </div>

          {/* Strategy */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Semester Execution Strategy</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800 font-sans">
              {aiInsight.semesterStrategy}
            </p>
          </div>

          {/* Grid: Action Steps & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
            
            {/* Actionable Steps */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <h4 className="font-bold text-slate-200 mb-1.5 flex items-center space-x-1.5 font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Actionable Steps</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {aiInsight.actionableSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-blue-400 font-mono">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industry Certifications */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <h4 className="font-bold text-slate-200 mb-1.5 flex items-center space-x-1.5 font-mono text-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Certifications</span>
              </h4>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {aiInsight.suggestedCertifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-amber-400 font-mono">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Industry Trends */}
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-sans">
            <strong className="text-slate-300">Market Trend Note:</strong> {aiInsight.industryTrends}
          </div>

        </div>
      )}

    </div>
  );
};
