import React, { useState } from 'react';
import { StudentProfile, AcademicProgrammeRules, Course } from '../types/curriculum';
import { evaluateCurriculumCompliance, ComplianceCategoryStatus } from '../services/complianceEngine';
import { 
  X, ShieldCheck, CheckCircle2, AlertTriangle, FileCheck, 
  Download, Sparkles, Building2, BookOpen, Layers, 
  ArrowRight, Info, Award, BarChart3, RefreshCw, Printer
} from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  programmeRules: AcademicProgrammeRules;
  allCourses: Course[];
  plannedCourseIds?: string[];
  onOpenSiwesPortal?: () => void;
  onOpenProgrammeRules?: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  programmeRules,
  allCourses,
  plannedCourseIds = [],
  onOpenSiwesPortal,
  onOpenProgrammeRules
}) => {
  const [includePlanned, setIncludePlanned] = useState<boolean>(true);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('nucCcmasCore');

  if (!isOpen) return null;

  const report = evaluateCurriculumCompliance(
    studentProfile,
    programmeRules,
    allCourses,
    plannedCourseIds,
    includePlanned
  );

  const categories = Object.values(report.matrix);
  const activeCategory: ComplianceCategoryStatus = report.matrix[activeCategoryKey as keyof typeof report.matrix] || categories[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-emerald-50/90 via-slate-50 to-blue-50/90 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Statutory Accreditation Audit
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {report.curriculumStandard}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                FUTMinna / NUC Curriculum Compliance
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                {report.institutionName} • {report.departmentProgram}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print Official Compliance Audit Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[36px] min-w-[36px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Evaluation Mode Toggle Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Audit Mode:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200 dark:bg-slate-800">
              <button
                onClick={() => setIncludePlanned(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  !includePlanned 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Current Earned ({studentProfile.completedCourseIds.length} Courses)
              </button>
              <button
                onClick={() => setIncludePlanned(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  includePlanned 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Planned Graduation Trajectory</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Matric: <strong className="text-slate-700 dark:text-slate-300 font-mono">{report.studentInfo.matricNumber}</strong></span>
            <span>CGPA: <strong className="text-slate-700 dark:text-slate-300">{report.studentInfo.cgpa.toFixed(2)}</strong></span>
            <span>Credits: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{report.studentInfo.earnedCredits} / {report.studentInfo.requiredCredits}</strong></span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs bg-slate-50/50 dark:bg-slate-950/50">

          {/* PRIMARY COMPLIANCE ASCII BOX & GRAPHICAL CARD (User Requested Exact Format) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* The Strict Formatted Box */}
            <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl font-mono flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                      FUTMinna / NUC Compliance
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Official Audit
                  </span>
                </div>

                <div className="text-center py-1.5 px-3 bg-slate-800/80 rounded-lg text-emerald-300 font-extrabold text-xs tracking-wider mb-3 border border-slate-700/60">
                  CURRICULUM COMPLIANCE STATUS
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">NUC CCMAS Core Courses</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.nucCcmasCore.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">FUTMinna Core Courses</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.futMinnaCore.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">Prerequisites</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.prerequisites.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">Credit Requirements</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.creditRequirements.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">Elective Requirements</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.electiveRequirements.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">SIWES Requirements</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.siwesRequirements.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">Project Requirements</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.projectRequirements.percentage}%</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-800/60 transition-colors">
                    <span className="text-slate-300">Learning Outcomes</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{report.matrix.learningOutcomes.percentage}%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Source & Verification Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-400">
                <div className="flex items-start gap-1">
                  <span className="text-slate-500 font-semibold shrink-0">Compliance source:</span>
                  <span className="text-slate-200 font-bold">{report.complianceSource}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-semibold">Last curriculum verification:</span>
                  <span className="text-cyan-300 font-bold">{report.lastCurriculumVerification}</span>
                </div>
              </div>
            </div>

            {/* Graphical Telemetry & Aggregate Standing */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              
              {/* Overall Progress Gauge Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Overall Compliance Index
                    </span>
                    <div className="flex items-baseline space-x-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        {report.overallPercentage}%
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {report.complianceLevel}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${report.overallPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                    <span>Degree Inception</span>
                    <span>400L Statutory Gate</span>
                    <span>100% Degree Clearance</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {report.overallPercentage >= 90
                    ? 'All statutory curriculum criteria (NUC CCMAS and FUTMinna Departmental guidelines) are fully satisfied on this graduation track.'
                    : 'The student trajectory is progressing with accredited core modules, prerequisites, and SIWES scheme requirements mapped to official graduation benchmarks.'}
                </p>
              </div>

              {/* Statutory Framework Badges */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">NUC Standard</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Computing CCMAS 2023</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">✓ Aligned 100%</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">FUT Minna Senate</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">SICT IT Handbook</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">✓ Approved Matrix</span>
                </div>
              </div>

              {/* Action Strip */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-[11px] font-bold text-blue-950 dark:text-blue-200">
                    SIWES Statutory Placement Portal
                  </span>
                </div>
                {onOpenSiwesPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSiwesPortal();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* DRILL-DOWN AUDIT EXPLORER (8 DIMENSIONS) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Statutory Compliance Matrix Details</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Click category to inspect checklist</span>
            </div>

            {/* Horizontal 8-Category Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = activeCategoryKey === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryKey(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                        {cat.shortName}
                      </span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {cat.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Category Drill-down Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                      {activeCategory.regulatoryAuthority}
                    </span>
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {activeCategory.metricLabel}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {activeCategory.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                    {activeCategory.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compliance Score</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {activeCategory.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Audited Requirements & Course Verification Checklist ({activeCategory.breakdown.length} items)
                </span>
                
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {activeCategory.breakdown.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className={`p-1 rounded-full shrink-0 mt-0.5 ${
                          item.isSatisfied 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-[11px]">
                              {item.code}
                            </span>
                            <span className="text-slate-900 dark:text-white font-semibold">
                              {item.name}
                            </span>
                          </div>
                          {item.detailNote && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              {item.detailNote}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isSatisfied
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {item.actualValue}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.statusText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Verification Hash:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{report.verificationHash}</span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenProgrammeRules && (
              <button
                onClick={() => {
                  onClose();
                  onOpenProgrammeRules();
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Configure Programme Rules
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors min-h-[38px] shadow-xs"
            >
              Close Compliance Audit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
