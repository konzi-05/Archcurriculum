import React, { useState } from 'react';
import { StudentProfile, AcademicProgrammeRules, Course } from '../types/curriculum';
import { evaluateCurriculumCompliance } from '../services/complianceEngine';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ComplianceSummaryCardProps {
  studentProfile: StudentProfile;
  programmeRules?: AcademicProgrammeRules;
  allCourses: Course[];
  plannedCourseIds?: string[];
  onOpenComplianceModal?: () => void;
  onOpenDetailedAudit?: () => void;
  onOpenSiwesPortal?: () => void;
}

export const ComplianceSummaryCard: React.FC<ComplianceSummaryCardProps> = ({
  studentProfile,
  programmeRules,
  allCourses,
  plannedCourseIds = [],
  onOpenComplianceModal,
  onOpenDetailedAudit,
  onOpenSiwesPortal
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const handleOpenModal = onOpenComplianceModal || onOpenDetailedAudit || (() => {});
  
  const effectiveRules = programmeRules || {
    institution: 'Federal University of Technology, Minna',
    institutionShortCode: 'FUTMinna',
    school: 'School of Information and Communication Technology',
    schoolShortCode: 'SICT',
    programme: 'Information Technology',
    programmeCode: 'B.Tech IT',
    degreeAward: 'Bachelor of Technology (B.Tech)',
    curriculumFramework: 'NUC Computing CCMAS / SICT Departmental Regulations',
    minSemesterUnits: 15,
    maxSemesterUnits: 24,
    graduationRequirementUnits: 150,
    directEntryGraduationUnits: 120,
    minimumPassCGPA: 1.50,
    allowDeanOverload: true,
    maxOverloadUnits: 28,
    handbookSourceNote: 'SICT B.Tech IT Handbook v2023.1',
    isOfficialHandbookConfirmed: true,
    isCustomConfigured: false
  };

  const report = evaluateCurriculumCompliance(
    studentProfile,
    effectiveRules,
    allCourses,
    plannedCourseIds,
    true // include planned courses for complete picture
  );

  return (
    <div 
      id="compliance-dropdown-card"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs transition-all hover:border-emerald-500/50 overflow-hidden"
    >
      {/* Dropdown Header Trigger Bar */}
      <div 
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                FUTMinna / NUC Compliance
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                ✓ {report.overallPercentage}% Index
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden md:inline-block">
                • 8-Dimension Statutory Clearance Matrix
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              NUC CCMAS core courses, credit limits, prerequisite flow & SIWES requirements
            </p>
          </div>
        </div>

        {/* Action Controls & Dropdown Chevron */}
        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0" onClick={e => e.stopPropagation()}>
          <button
            id="btn-open-compliance-modal"
            onClick={handleOpenModal}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 px-2.5 py-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 transition-colors shadow-2xs"
            title="Open comprehensive compliance audit modal"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Audit</span>
          </button>

          <button
            id="btn-toggle-compliance-dropdown"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            aria-expanded={isDropdownOpen}
          >
            <span>{isDropdownOpen ? 'Hide Matrix' : 'View Matrix'}</span>
            {isDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Dropdown Content */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            id="compliance-dropdown-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/50"
          >
            {/* Boxed Table Layout */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between py-1 px-2 bg-slate-800/90 rounded text-emerald-400 font-bold text-[10px] tracking-wider mb-2.5 border border-slate-700/50">
                <span>CURRICULUM COMPLIANCE STATUS</span>
                <span className="text-[9px] text-slate-400 font-normal">FUTMINNA / NUC CCMAS</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">NUC CCMAS Core Courses</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.nucCcmasCore.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">FUTMinna Core Courses</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.futMinnaCore.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">Prerequisites</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.prerequisites.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">Credit Requirements</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.creditRequirements.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">Elective Requirements</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.electiveRequirements.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">SIWES Requirements</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.siwesRequirements.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">Project Requirements</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.projectRequirements.percentage}%</span>
                </div>
                <div className="flex items-center justify-between py-0.5 px-2 rounded hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-300">Learning Outcomes</span>
                  <span className="text-emerald-400 font-bold">✓ {report.matrix.learningOutcomes.percentage}%</span>
                </div>
              </div>

              {/* Source & Date Footers */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/90 text-[10px] space-y-0.5 text-slate-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>Compliance source: <span className="text-slate-200 font-semibold">{report.complianceSource}</span></div>
                  <div>Last verified: <span className="text-cyan-300 font-semibold">{report.lastCurriculumVerification}</span></div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Detailed breakdowns include prerequisite graph validation, core deficiency lists & SIWES work logs.
              </span>
              <button
                onClick={handleOpenModal}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>View Full Audit Details</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
