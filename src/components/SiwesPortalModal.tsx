import React, { useState } from 'react';
import { 
  StudentProfile, 
  AcademicProgrammeRules, 
  Course, 
  SiwesPlacementDetails,
  Grade 
} from '../types/curriculum';
import { evaluateSiwesEligibility, getSiwesConceptualTree } from '../services/siwesEngine';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  BookOpen, 
  FileText, 
  Briefcase, 
  GitBranch, 
  Sliders, 
  CheckSquare, 
  Compass, 
  Save, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface SiwesPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  onUpdateProfile: (updatedProfile: StudentProfile) => void;
  programmeRules?: AcademicProgrammeRules;
  allCourses?: Course[];
}

export const SiwesPortalModal: React.FC<SiwesPortalModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onUpdateProfile,
  programmeRules,
  allCourses
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'audit' | 'tracker' | 'policy'>('architecture');
  
  // Local state for placement tracking
  const [placement, setPlacement] = useState<SiwesPlacementDetails>(() => {
    return studentProfile.siwesPlacement || {
      companyName: 'Interswitch Group (Engineering Hub)',
      industrySector: 'Financial Technology & Cloud Infrastructure',
      locationCity: 'Victoria Island, Lagos',
      workArrangement: 'Hybrid',
      roleTitle: 'Software Engineering & Cloud Trainee',
      industrySupervisorName: 'Engr. D. Adeleke (Lead Architect)',
      industrySupervisorPhone: '+234 803 123 4567',
      institutionalAssessorName: 'Dr. A. O. Bashir (SICT Assessor)',
      itfForm8Submitted: true,
      acceptanceLetterApproved: true,
      totalWeeksLogged: 16,
      logbookSignedBySupervisor: true,
      institutionalVisitConducted: true,
      technicalReportSubmitted: false,
      technicalReportPageCount: 48,
      oralDefensePassed: false,
      defenseGradeAwarded: undefined,
      commencementDate: '2026-03-01',
      completionDate: '2026-08-31'
    };
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!isOpen) return null;

  const audit = evaluateSiwesEligibility(studentProfile, programmeRules, allCourses);
  const treeData = getSiwesConceptualTree(studentProfile, programmeRules);

  const handleFieldChange = <K extends keyof SiwesPlacementDetails>(field: K, value: SiwesPlacementDetails[K]) => {
    setPlacement(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSavePlacement = () => {
    const updatedProfile: StudentProfile = {
      ...studentProfile,
      siwesPlacement: placement
    };
    onUpdateProfile(updatedProfile);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[11px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Statutory Institutional Scheme
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  CCMAS-SIW400 • IFT 499 (6 Units)
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${audit.statusColor}`}>
                  {audit.statusLabel}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                SIWES Directorate & Industrial Training Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {programmeRules?.institution || 'Federal University of Technology, Minna'} • {programmeRules?.schoolShortCode || 'SICT'} {programmeRules?.programmeCode || 'B.Tech IT'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[40px] min-w-[40px] shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-100/70 dark:bg-slate-900/70 overflow-x-auto text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            SIWES Architecture Tree
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Student Eligibility Audit
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4 text-indigo-500" />
            Industrial Attachment Tracker & Logbook
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'policy'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            ITF & NUC Regulatory Framework
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: ARCHITECTURE TREE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Concept Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                      SIWES Statutory Policy Architecture
                    </h3>
                    <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-1 leading-relaxed">
                      In genuine Nigerian institution-aware computing curricula (FUT Minna & NUC CCMAS), SIWES is a statutory 24-week full-time industrial training requirement, NOT a general elective. It possesses explicit eligibility gates, standing rules, and degree clearance dependencies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual ASCII / Hierarchical Tree Representation */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-5 font-mono text-xs shadow-inner border border-slate-800">
                <div className="text-blue-400 font-extrabold text-sm mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  SIWES Conceptual Structure
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p className="text-emerald-400 font-bold">SIWES (Students Industrial Work Experience Scheme)</p>
                  <p className="pl-2 text-slate-400">│</p>
                  <p className="pl-2">├── <span className="text-amber-300 font-bold">Required?</span> → Mandatory Statutory Requirement (NUC CCMAS / ITF / Senate Clearance)</p>
                  <p className="pl-2">├── <span className="text-cyan-300 font-bold">Eligible Level</span> → 400 Level (Rain Semester / 6-Month Block)</p>
                  <p className="pl-2">├── <span className="text-purple-300 font-bold">Prerequisites</span> → Min {audit.requiredEarnedCredits} Units Earned + Foundational Core CS/IT Clearance</p>
                  <p className="pl-2">├── <span className="text-sky-300 font-bold">Duration</span> → {audit.durationMonths} Months ({audit.durationWeeks} Calendar Weeks Continuous Attachment)</p>
                  <p className="pl-2">├── <span className="text-pink-300 font-bold">Credit Units</span> → {audit.creditUnits} Credit Units (100% Semester Workload Weight)</p>
                  <p className="pl-2">├── <span className="text-lime-300 font-bold">Academic Standing Requirement</span> → CGPA ≥ {audit.minCgpaRequirement.toFixed(2)} (Good Academic Standing, Non-Probationary)</p>
                  <p className="pl-2">└── <span className="text-emerald-400 font-bold">Completion Status</span> → {audit.statusLabel} ({studentProfile.name})</p>
                </div>
              </div>

              {/* Expanded Card Grid for the 7 Hierarchy Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treeData.nodes.map((node, index) => (
                  <div 
                    key={node.key}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-mono font-bold">
                          {index + 1}
                        </span>
                        {node.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                        {node.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1.5">
                      {node.value}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: STUDENT ELIGIBILITY AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              
              {/* Overall Eligibility Status Banner */}
              <div className={`p-4 sm:p-5 rounded-xl border flex items-start space-x-3.5 ${
                audit.isEligibleNow
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                {audit.isEligibleNow ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">
                      {audit.isEligibleNow ? 'Official Institutional Clearance Granted' : 'Eligibility Clearance in Progress'}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-current">
                      Candidate: {studentProfile.rollNumber}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {audit.institutionalGuidance}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Next Action: {audit.nextActionableStep}</span>
                  </div>
                </div>
              </div>

              {/* Eligibility Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Academic Standing</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {audit.actualCgpa.toFixed(2)} CGPA
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Req: ≥ {audit.minCgpaRequirement.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Earned Credit Units</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {audit.actualEarnedCredits} Units
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span>Threshold: {audit.requiredEarnedCredits} Units</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Academic Level</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {audit.currentLevel}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <span>Attachment: 400L (Sem 8)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Core Prerequisites</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    {audit.allPrerequisitesMet ? 'All 8 Cleared' : `${audit.missingPrerequisiteCodes.length} Pending`}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Zero Carryovers</span>
                  </div>
                </div>
              </div>

              {/* Departmental Core Prerequisite Course Audit Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Prerequisite Courses Audit Checklist (100L - 300L Core Computing Units)</span>
                  <span className="text-slate-500 font-normal">8 Mandatory Courses</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {audit.prerequisites.map(prereq => (
                    <div 
                      key={prereq.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        prereq.isCompleted
                          ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                          : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        {prereq.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {prereq.code}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {prereq.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        {prereq.isCompleted ? (
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-[11px]">
                            Grade: {prereq.grade || 'Passed'}
                          </span>
                        ) : (
                          <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 text-[10px]">
                            To Complete
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ATTACHMENT TRACKER & LOGBOOK */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              
              {/* Active Placement Overview */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Employer Placement & Industry Mentor Details
                  </h3>
                  {hasUnsavedChanges && (
                    <button
                      onClick={handleSavePlacement}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Placement Data</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Organization / Host Company Name
                    </label>
                    <input
                      type="text"
                      value={placement.companyName}
                      onChange={e => handleFieldChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Flutterwave, Interswitch, Microsoft ADC"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Industry Sector / Domain
                    </label>
                    <input
                      type="text"
                      value={placement.industrySector}
                      onChange={e => handleFieldChange('industrySector', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. FinTech, Cloud, Telecoms"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Work Location & City
                    </label>
                    <input
                      type="text"
                      value={placement.locationCity}
                      onChange={e => handleFieldChange('locationCity', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Victoria Island, Lagos"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Industry Supervisor Name & Title
                    </label>
                    <input
                      type="text"
                      value={placement.industrySupervisorName}
                      onChange={e => handleFieldChange('industrySupervisorName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Engr. D. Adeleke"
                    />
                  </div>
                </div>
              </div>

              {/* 24-Week Logbook Progress Gauge */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    24-Week Industrial Logbook Progress: {placement.totalWeeksLogged} / 24 Weeks Logged
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">
                    {Math.round((placement.totalWeeksLogged / 24) * 100)}% Completed
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (placement.totalWeeksLogged / 24) * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[11px] text-slate-500 font-medium">
                    Adjust completed weeks logged:
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={placement.totalWeeksLogged}
                    onChange={e => handleFieldChange('totalWeeksLogged', parseInt(e.target.value) || 0)}
                    className="w-48 accent-blue-600"
                  />
                </div>
              </div>

              {/* Statutory Milestone Checkpoints */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  SIWES Statutory Milestone Gates
                </h4>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={placement.itfForm8Submitted}
                      onChange={e => handleFieldChange('itfForm8Submitted', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 dark:text-white">ITF Form 8 (Endorsement of Attachment) Submitted</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Formal verification signed by company HR and returned to FUT Minna SIWES Directorate.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={placement.institutionalVisitConducted}
                      onChange={e => handleFieldChange('institutionalVisitConducted', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 dark:text-white">Institutional On-Site Supervision Completed</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Academic supervisor physical/virtual site inspection, student interview, and logbook endorsement.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={placement.technicalReportSubmitted}
                      onChange={e => handleFieldChange('technicalReportSubmitted', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 dark:text-white">Comprehensive 50-Page Technical Report Bound & Submitted</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Detailed technical documentation of production systems, architecture diagrams, and methodologies.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={placement.oralDefensePassed}
                      onChange={e => handleFieldChange('oralDefensePassed', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 dark:text-white">Departmental SIWES Oral Defense Panel Passed</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Formal presentation before faculty panel and defense of industrial engineering solutions.</p>
                    </div>
                  </label>
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSavePlacement}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: ITF & NUC REGULATORY FRAMEWORK */}
          {activeTab === 'policy' && (
            <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 space-y-2">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Statutory Mandate: Federal Republic of Nigeria & ITF Decree
                </h4>
                <p>
                  The Students Industrial Work Experience Scheme (SIWES) is a skills training programme established by the Industrial Training Fund (ITF) in 1973 to address the acute shortage of practical engineering and technical competency among Nigerian university graduates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Institutional Grading Breakdown</h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex justify-between">
                      <span>• Institutional Supervision & Assessment:</span>
                      <strong className="font-mono">20%</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>• Industry Mentor Evaluation & Logbook:</span>
                      <strong className="font-mono">20%</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>• 50-Page Technical Report Evaluation:</span>
                      <strong className="font-mono">30%</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>• Departmental Oral Defense Presentation:</span>
                      <strong className="font-mono">30%</strong>
                    </li>
                    <li className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                      <span>Total Statutory Weight:</span>
                      <span className="font-mono text-blue-600">100% (6 Credits)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Governing Regulatory Bodies</h4>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>1. Industrial Training Fund (ITF)</strong>
                      <p className="text-[11px] text-slate-500">Funds allowance stipends and inspects national training standards.</p>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>2. National Universities Commission (NUC CCMAS)</strong>
                      <p className="text-[11px] text-slate-500">Prescribes 6-credit continuous block curriculum accreditation requirement.</p>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <strong>3. University Directorate of SIWES & Senate</strong>
                      <p className="text-[11px] text-slate-500">Grants academic eligibility clearance and validates final defense grades.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Current Status: <strong className="text-slate-800 dark:text-slate-200">{audit.statusLabel}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-slate-800 dark:text-slate-100 transition-colors"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
