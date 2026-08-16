import React from 'react';
import { StudentProfile, AcademicProgrammeRules, Course } from '../types/curriculum';
import { evaluateCurriculumCompliance } from '../services/complianceEngine';
import { ShieldCheck, ExternalLink, Sparkles, CheckCircle2, ChevronRight, Award } from 'lucide-react';

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-500/40">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                FUTMinna / NUC Compliance
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {report.overallPercentage}% Index
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Accreditation standard & degree clearance matrix
            </p>
          </div>
        </div>

        <button
          id="btn-open-compliance-modal"
          onClick={handleOpenModal}
          className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 transition-colors"
        >
          <span>Audit Report</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* The Requested Boxed Table Layout */}
      <div className="mt-3.5 bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-[11px] border border-slate-800 shadow-inner">
        <div className="text-center py-1 bg-slate-800/80 rounded text-emerald-400 font-bold text-[10px] tracking-wider mb-2 border border-slate-700/50">
          CURRICULUM COMPLIANCE STATUS
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">NUC CCMAS Core Courses</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.nucCcmasCore.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">FUTMinna Core Courses</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.futMinnaCore.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">Prerequisites</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.prerequisites.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">Credit Requirements</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.creditRequirements.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">Elective Requirements</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.electiveRequirements.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">SIWES Requirements</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.siwesRequirements.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">Project Requirements</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.projectRequirements.percentage}%</span>
          </div>
          <div className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-800/50">
            <span className="text-slate-300">Learning Outcomes</span>
            <span className="text-emerald-400 font-bold">✓ {report.matrix.learningOutcomes.percentage}%</span>
          </div>
        </div>

        {/* Source & Date Footers */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] space-y-0.5 text-slate-400">
          <div>Compliance source: <span className="text-slate-200 font-semibold">{report.complianceSource}</span></div>
          <div>Last curriculum verification: <span className="text-cyan-300 font-semibold">{report.lastCurriculumVerification}</span></div>
        </div>
      </div>

    </div>
  );
};
