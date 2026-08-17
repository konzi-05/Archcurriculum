import React, { useState, useRef } from 'react';
import { RecommendedCourseResult, StudentProfile, Course, RequirementClassification, AcademicProgrammeRules } from '../types/curriculum';
import { CAREER_TRACKS, BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { calculateCurriculumDualAudit } from '../services/recommendationEngine';
import { ComplianceSummaryCard } from './ComplianceSummaryCard';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Plus, 
  Check, 
  Filter, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  Binary, 
  Cpu, 
  GraduationCap, 
  Compass, 
  Lightbulb,
  Info,
  SlidersHorizontal,
  Building2,
  Briefcase,
  Scale,
  Award,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { SemanticVectorModal } from './SemanticVectorModal';

interface RecommendationDashboardProps {
  recommendations: RecommendedCourseResult[];
  studentProfile: StudentProfile;
  programmeRules?: AcademicProgrammeRules;
  selectedPlanCourseIds: string[];
  onTogglePlanCourse: (courseId: string) => void;
  onOpenSyllabusModal: (course: Course) => void;
  onOpenCounselor: () => void;
  onOpenCompliance?: () => void;
  onOpenSiwesPortal?: () => void;
  onOpenBenchmarkModal?: () => void;
  recommendationMode?: 'semantic-embeddings' | 'legacy-tfidf';
  onToggleRecommendationMode?: () => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  recommendations,
  studentProfile,
  programmeRules,
  selectedPlanCourseIds,
  onTogglePlanCourse,
  onOpenSyllabusModal,
  onOpenCounselor,
  onOpenCompliance,
  onOpenSiwesPortal,
  onOpenBenchmarkModal,
  recommendationMode = 'semantic-embeddings',
  onToggleRecommendationMode
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [prereqOnlyFilter, setPrereqOnlyFilter] = useState<boolean>(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [activeSectionTab, setActiveSectionTab] = useState<'ALL' | 'UNIVERSITY_MANDATORY' | 'CAREER_ELECTIVES' | 'DUAL_VALUE' | 'OPEN_ELECTIVES'>('ALL');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'university-mandate': false,
    'career-electives': false,
    'dual-value': false,
    'open-electives': false
  });
  const [showFirstTimeGuide, setShowFirstTimeGuide] = useState<boolean>(true);
  const [isSemanticModalOpen, setIsSemanticModalOpen] = useState<boolean>(false);
  const [inspectingCourseResult, setInspectingCourseResult] = useState<RecommendedCourseResult | null>(null);
  const domainScrollRef = useRef<HTMLDivElement>(null);

  const scrollDomains = (direction: 'left' | 'right') => {
    if (domainScrollRef.current) {
      const offset = direction === 'left' ? -180 : 180;
      domainScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const toggleSectionCollapse = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  // Calculate Dual-Lens Audit
  const dualAudit = calculateCurriculumDualAudit(studentProfile, selectedPlanCourseIds);

  const filteredRecommendations = recommendations.filter(item => {
    if (selectedDomain !== 'All' && item.course.domain !== selectedDomain) return false;
    if (prereqOnlyFilter && !item.prerequisitesMet) return false;
    if (item.matchScore < minMatchFilter) return false;
    if (activeSectionTab === 'UNIVERSITY_MANDATORY' && !item.isUniversityMandatory) return false;
    if (activeSectionTab === 'CAREER_ELECTIVES' && (item.course.type !== 'Elective' || item.classification === 'UNIVERSITY_MANDATORY')) return false;
    if (activeSectionTab === 'DUAL_VALUE' && item.classification !== 'DUAL_VALUE') return false;
    if (activeSectionTab === 'OPEN_ELECTIVES' && (item.course.type !== 'Elective' || targetTrack.recommendedElectiveIds.includes(item.course.id) || item.matchScore >= 70)) return false;
    return true;
  });

  // Categorize courses into distinct packages
  const universityMandatoryCourses = filteredRecommendations.filter(r => r.isUniversityMandatory);
  const careerElectives = filteredRecommendations.filter(r => 
    r.course.type === 'Elective' && (targetTrack.recommendedElectiveIds.includes(r.course.id) || r.matchScore >= 70)
  );
  const dualValueCourses = filteredRecommendations.filter(r => r.classification === 'DUAL_VALUE');
  const openElectives = filteredRecommendations.filter(r => 
    r.course.type === 'Elective' && !targetTrack.recommendedElectiveIds.includes(r.course.id) && r.matchScore < 70
  );

  const domains = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Systems', 'Cybersecurity & Networks', 'Hardware & Embedded', 'Math & Foundational CS'];

  const handleOpenVectorInspector = (courseRes?: RecommendedCourseResult) => {
    setInspectingCourseResult(courseRes || recommendations[0] || null);
    setIsSemanticModalOpen(true);
  };

  // Reusable Single Course Card Component with Dual-Lens Highlighting
  const renderCourseCard = (item: RecommendedCourseResult, index: number) => {
    const course = item.course;
    const inPlanner = selectedPlanCourseIds.includes(course.id);
    const semanticScore = item.breakdown.semanticEmbeddingScore || item.matchScore;

    return (
      <div
        key={course.id}
        id={`course-card-${course.id}`}
        className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden shadow-xs hover:shadow-md ${
          inPlanner
            ? 'border-blue-500/80 ring-2 ring-blue-500/20'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Top Tag Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3.5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
              #{index + 1}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                
                {/* DUAL-LENS PRIMARY CLASSIFICATION BADGE */}
                {item.classification === 'DUAL_VALUE' ? (
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-2xs">
                    <Scale className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>Dual-Value: University Core + High Career Fit</span>
                  </span>
                ) : item.isUniversityMandatory ? (
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 font-extrabold uppercase bg-purple-50 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1 shadow-2xs">
                    <Building2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span>University Requirement: Mandatory Core</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-300 font-extrabold uppercase bg-cyan-50 dark:bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800 flex items-center gap-1 shadow-2xs">
                    <Briefcase className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    <span>Industry Recommendation: Career Elective</span>
                  </span>
                )}

                {/* Status Tags */}
                {item.prerequisitesMet ? (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Ready to Enroll
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Prerequisites Needed
                  </span>
                )}

                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 ml-1 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900 font-mono">
                  {course.futMinnaCode || course.code}
                </span>
                {course.nucCcmasCode && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-mono">
                    NUC: {course.nucCcmasCode}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">{course.name}</h3>

              <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap gap-y-1 font-medium">
                <span>Sem {course.semester} ({course.academicLevel || 'Level'})</span>
                <span>•</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{course.credits} Units</span>
                <span>•</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  LH: {course.lectureHours ?? 2}h {course.practicalHours && course.practicalHours > 0 ? `• PH: ${course.practicalHours}h (Lab)` : '• PH: 0h'}
                </span>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded text-[10px]">
                  {course.acmKnowledgeArea || (course.ieeeAcmStandard || 'IEEE/ACM')}
                </span>
                <span>•</span>
                <span className="text-slate-700 dark:text-slate-300">{course.domain}</span>
                <span>•</span>
                <span>Diff: {course.difficulty}/5</span>
              </div>
            </div>
          </div>

          {/* Right Match Score & Action Button */}
          <div className="flex items-center space-x-4 self-end sm:self-start pt-1 sm:pt-0">
            <div className="text-right">
              <div className={`text-xl sm:text-2xl font-extrabold ${
                item.matchScore >= 80 ? 'text-blue-600 dark:text-blue-400' : item.matchScore >= 60 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {item.matchScore}%
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                {recommendationMode === 'semantic-embeddings' ? 'Skill Fit' : 'Keyword Fit'}
              </div>
            </div>

            <button
              id={`btn-plan-${course.id}`}
              onClick={() => onTogglePlanCourse(course.id)}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                inPlanner
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none'
              }`}
            >
              {inPlanner ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>In My Plan</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Course Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 my-2.5 leading-relaxed">
          {course.description}
        </p>

        {/* ========================================================================= */}
        {/* DUAL-LENS EXPLICIT DISTINCTION CARD (University Requires vs Industry Recommends) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/90 dark:border-slate-700/80 text-xs">
          
          {/* LENS 1: What the University Requires */}
          <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>What the University Requires</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                item.isUniversityMandatory
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {item.isUniversityMandatory ? 'Mandatory Degree Core' : 'Accredited Elective Pool'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              {item.universityRequirementSummary}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-purple-700 dark:text-purple-400">Authority:</span> NUC CCMAS / FUT Minna Senate
              <span>•</span>
              <span>{course.credits} Statutory Units</span>
            </div>
          </div>

          {/* LENS 2: What the Industry / Career Pathway Recommends */}
          <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-cyan-100 dark:border-cyan-900/40 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[11px] text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Briefcase className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>What Industry Recommends</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                item.isCareerRecommended
                  ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {item.isCareerRecommended ? `High Fit for ${targetTrack.title}` : 'General Domain'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              {item.industryRecommendationSummary}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-cyan-700 dark:text-cyan-400">Skills Gained:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {course.skillsAcquired.slice(0, 3).join(', ')}
              </span>
            </div>
          </div>

        </div>

        {/* Score Breakdown Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
              <span>Prerequisites</span>
              <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.prerequisiteScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.breakdown.prerequisiteScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
              <span>Career Fit</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">{semanticScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${semanticScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
              <span>Skills Gained</span>
              <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.skillGapScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.breakdown.skillGapScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
              <span>Load Balance</span>
              <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.workloadBalanceScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${item.breakdown.workloadBalanceScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Reasons / Warnings / Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            {item.matchReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{reason}</span>
              </div>
            ))}

            {item.warningFlags.map((warn, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{warn}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 self-start sm:self-auto">
            <button
              onClick={() => handleOpenVectorInspector(item)}
              className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-semibold transition-colors"
              title="See the AI topic breakdown for this course"
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Why This Course?</span>
            </button>

            <button
              onClick={() => onOpenSyllabusModal(course)}
              className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-semibold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Syllabus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* ========================================================================= */}
      {/* DUAL-LENS MASTER COMPARATIVE MATRIX HERO (University vs Industry Pathways) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs transition-colors space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full mb-2">
              <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Dual-Lens Curriculum Intelligence Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Academic Degree Requirements <span className="text-slate-400 font-medium">vs.</span> Career Pathway Recommendations
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              The system actively distinguishes what the <strong className="text-purple-700 dark:text-purple-300">University Requires</strong> (statutory NUC CCMAS & FUT Minna graduation mandates) from what your target <strong className="text-cyan-700 dark:text-cyan-300">Industry Pathway Recommends</strong> (high-demand skill electives for {targetTrack.title}).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {onOpenBenchmarkModal && (
              <button
                onClick={onOpenBenchmarkModal}
                className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 border border-blue-200 dark:border-blue-800"
                title="View prototype benchmarks and academic judgment consistency"
              >
                <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Prototype Benchmarks</span>
              </button>
            )}
            <button
              onClick={() => handleOpenVectorInspector()}
              className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
            >
              <Binary className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Vector Match</span>
            </button>
            <button
              onClick={onOpenCounselor}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              Consult AI Advisor →
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparative Audit Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* COLUMN 1: What the University Requires */}
          <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block leading-tight">Lens 1: Academic Mandate</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">What the University Requires</h3>
                </div>
              </div>
              <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                {dualAudit.universityAudit.compliancePercent}% Compliant
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Prescribed Authority:</span>
                <span className="font-semibold text-slate-900 dark:text-white text-right">NUC CCMAS & FUT Minna Senate</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Mandatory Core Units:</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  {dualAudit.universityAudit.completedCoreUnits + dualAudit.universityAudit.plannedCoreUnits} / {dualAudit.universityAudit.totalCoreUnits} Units
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SIWES & Capstone Project:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {dualAudit.universityAudit.isSiwesCompleted ? 'SIWES Cleared' : 'Semester 8 SIWES (Mandatory)'}
                </span>
              </div>
            </div>

            <div className="w-full bg-purple-200 dark:bg-purple-900/60 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${dualAudit.universityAudit.compliancePercent}%` }}
              ></div>
            </div>

            <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Goal: B.Tech Degree Conferment</span>
              <button
                onClick={() => setActiveSectionTab('UNIVERSITY_MANDATORY')}
                className="font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
              >
                Filter Core Courses ({universityMandatoryCourses.length}) →
              </button>
            </div>
          </div>

          {/* COLUMN 2: What the Industry / Career Pathway Recommends */}
          <div className="bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-900/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 block leading-tight">Lens 2: Industry Alignment</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">What Industry Recommends</h3>
                </div>
              </div>
              <span className="text-xs font-extrabold text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/60 px-2.5 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800">
                {dualAudit.industryAudit.readinessIndex}% Ready
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Target Career Track:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{targetTrack.title}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Key Skills Mastered:</span>
                <span className="font-semibold text-cyan-800 dark:text-cyan-300">
                  {dualAudit.industryAudit.skillsAcquiredCount} of {dualAudit.industryAudit.totalSkillsCount} Skills
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Market Demand / Salary:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {targetTrack.industryDemand} Demand ({targetTrack.averageSalaryUSD})
                </span>
              </div>
            </div>

            <div className="w-full bg-cyan-200 dark:bg-cyan-900/60 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${dualAudit.industryAudit.readinessIndex}%` }}
              ></div>
            </div>

            <div className="pt-2 border-t border-cyan-200/60 dark:border-cyan-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Goal: Job Placement & High-Earning Competency</span>
              <button
                onClick={() => setActiveSectionTab('CAREER_ELECTIVES')}
                className="font-bold text-cyan-800 dark:text-cyan-300 hover:underline flex items-center gap-1"
              >
                Filter Track Electives ({careerElectives.length}) →
              </button>
            </div>
          </div>

        </div>

        {/* FUTMinna / NUC Statutory Curriculum Compliance Card (8-Dimension Accreditation Audit) */}
        <ComplianceSummaryCard
          studentProfile={studentProfile}
          programmeRules={programmeRules}
          allCourses={BTECH_IT_COURSES}
          plannedCourseIds={selectedPlanCourseIds}
          onOpenDetailedAudit={onOpenCompliance}
        />

      </div>

      {/* Beginner-Friendly Quick Distinction Guide for First-Time Students */}
      {showFirstTimeGuide && (
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-cyan-50/80 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-cyan-950/40 border border-blue-200/90 dark:border-blue-800/80 rounded-2xl p-4 sm:p-5 relative transition-colors shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Lightbulb className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span>How to Navigate Dual-Lens Course Selection</span>
                  <span className="text-[10px] uppercase font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">Advisory Guide</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  Every semester in B.Tech IT balances statutory compliance with career readiness:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50">
                    <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1">
                      <Building2 className="w-4 h-4" /> 🏛️ University Requirements
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-normal">
                      Mandatory foundation courses required for Senate clearance and degree certification. You must enroll in all active core courses.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900/50">
                    <span className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 mb-1">
                      <Briefcase className="w-4 h-4" /> 🚀 Industry Recommendations
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-normal">
                      High-impact electives recommended by industry standards for your specialization ({targetTrack.title}). Pick 1–2 per semester.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 mb-1">
                      <Scale className="w-4 h-4" /> ⚖️ Dual-Value Hybrid
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-normal">
                      Core courses that double as top industry skill builders (e.g. Data Structures, Database Systems, Computer Networks). Highest priority!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFirstTimeGuide(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 shrink-0 transition-colors"
              title="Dismiss guide"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Package Navigation Segmented Tabs (Categorized by Dual-Lens Types) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2 sm:p-2.5 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-xs transition-colors">
        <button
          onClick={() => setActiveSectionTab('ALL')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Course Offerings ({filteredRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('UNIVERSITY_MANDATORY')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'UNIVERSITY_MANDATORY'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>🏛️ University Requirements ({universityMandatoryCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('CAREER_ELECTIVES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'CAREER_ELECTIVES'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-cyan-800 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>🚀 Industry Recommendations ({careerElectives.length})</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('DUAL_VALUE')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'DUAL_VALUE'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>⚖️ Dual-Value ({dualValueCourses.length})</span>
        </button>

        {openElectives.length > 0 && (
          <button
            onClick={() => setActiveSectionTab('OPEN_ELECTIVES')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSectionTab === 'OPEN_ELECTIVES'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🌐 Open Electives ({openElectives.length})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar & Model Representation Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 text-xs shadow-xs transition-colors">
        
        {/* Domain Filters with Scroll Controls */}
        <div className="flex items-center gap-2 w-full xl:w-auto overflow-hidden">
          <div className="flex items-center space-x-1.5 shrink-0 mr-1">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Subject Area:</span>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollDomains('left')}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Scroll subject areas left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            ref={domainScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {domains.map(dom => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3.5 py-1.5 rounded-xl text-xs border whitespace-nowrap transition-all font-semibold shrink-0 ${
                  selectedDomain === dom
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollDomains('right')}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Scroll subject areas right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Checkbox, Mode Switcher & Min Match */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100 dark:border-slate-800">
          {onToggleRecommendationMode && (
            <button
              onClick={onToggleRecommendationMode}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center space-x-1.5 ${
                recommendationMode === 'semantic-embeddings'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="Switch between smart topic understanding and exact keyword matching"
            >
              <Binary className="w-3 h-3" />
              <span>{recommendationMode === 'semantic-embeddings' ? 'Smart AI Match' : 'Keyword Match'}</span>
            </button>
          )}

          <label className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none text-xs">
            <input
              type="checkbox"
              checked={prereqOnlyFilter}
              onChange={e => setPrereqOnlyFilter(e.target.checked)}
              className="accent-blue-600 rounded border-slate-300 dark:border-slate-700 w-4 h-4"
            />
            <span>Ready to Enroll</span>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Min:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchFilter}
              onChange={e => setMinMatchFilter(Number(e.target.value))}
              className="w-16 sm:w-20 accent-blue-600"
            />
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs w-7">{minMatchFilter}%</span>
          </div>
        </div>

      </div>

      {/* SEPARATED PACKAGES DISPLAY */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400 shadow-xs">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">No courses matched your current filter criteria</h3>
          <p className="text-xs max-w-md mx-auto mb-5 text-slate-500 dark:text-slate-400 leading-relaxed">
            Try adjusting the subject area filter, resetting the dual-lens tab, or lowering the minimum match percentage.
          </p>
          <button
            onClick={() => { setSelectedDomain('All'); setPrereqOnlyFilter(false); setMinMatchFilter(0); setActiveSectionTab('ALL'); }}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECTION 1: WHAT THE UNIVERSITY REQUIRES (MANDATORY CORE) */}
          {(activeSectionTab === 'ALL' || activeSectionTab === 'UNIVERSITY_MANDATORY') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-purple-50/90 via-white to-pink-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30 border border-purple-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Building2 className="w-5 h-5 text-purple-200" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">What the University Requires</h3>
                      <span className="text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        NUC CCMAS & FUT Minna Mandates
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Statutory core units required for academic matriculation, prerequisite progression, and final graduation clearance.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900">
                    {universityMandatoryCourses.length} Mandated Subject{universityMandatoryCourses.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => toggleSectionCollapse('university-mandate')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={collapsedSections['university-mandate'] ? 'Expand section' : 'Collapse section'}
                  >
                    {collapsedSections['university-mandate'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              {!collapsedSections['university-mandate'] && (
                <div className="space-y-4">
                  {universityMandatoryCourses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No mandatory university core courses matched the current filter.
                    </div>
                  ) : (
                    universityMandatoryCourses.map((item, idx) => renderCourseCard(item, idx))
                  )}
                </div>
              )}

            </div>
          )}

          {/* SECTION 2: WHAT THE INDUSTRY / CAREER PATHWAY RECOMMENDS */}
          {(activeSectionTab === 'ALL' || activeSectionTab === 'CAREER_ELECTIVES') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-cyan-50/90 via-white to-blue-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/30 border border-cyan-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Briefcase className="w-5 h-5 text-cyan-100" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">What Industry / Career Recommends</h3>
                      <span className="text-[10px] font-bold uppercase bg-cyan-100 dark:bg-cyan-900/60 text-cyan-900 dark:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                        {targetTrack.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Curated specialized electives recommended to build in-demand industry skills for {targetTrack.targetRole} roles. Choose 1 to 2 electives.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-100 dark:border-cyan-900">
                    {careerElectives.length} Elective{careerElectives.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => toggleSectionCollapse('career-electives')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={collapsedSections['career-electives'] ? 'Expand section' : 'Collapse section'}
                  >
                    {collapsedSections['career-electives'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              {!collapsedSections['career-electives'] && (
                <div className="space-y-4">
                  {careerElectives.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No career electives matched the current filter.
                    </div>
                  ) : (
                    careerElectives.map((item, idx) => renderCourseCard(item, idx))
                  )}
                </div>
              )}

            </div>
          )}

          {/* SECTION 3: DUAL-VALUE PRIORITY HYBRIDS */}
          {dualValueCourses.length > 0 && (activeSectionTab === 'ALL' || activeSectionTab === 'DUAL_VALUE') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Scale className="w-5 h-5 text-indigo-100" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Dual-Value Hybrid Courses</h3>
                      <span className="text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                        Maximum ROI
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      These compulsory core subjects simultaneously satisfy mandatory degree credits while delivering top-tier skills for your chosen career track.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
                    {dualValueCourses.length} High-Yield Course{dualValueCourses.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => toggleSectionCollapse('dual-value')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={collapsedSections['dual-value'] ? 'Expand section' : 'Collapse section'}
                  >
                    {collapsedSections['dual-value'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              {!collapsedSections['dual-value'] && (
                <div className="space-y-4">
                  {dualValueCourses.map((item, idx) => renderCourseCard(item, idx))}
                </div>
              )}

            </div>
          )}

          {/* SECTION 4: OPEN & INTERDISCIPLINARY ELECTIVES */}
          {openElectives.length > 0 && (activeSectionTab === 'ALL' || activeSectionTab === 'OPEN_ELECTIVES') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 border border-emerald-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Layers className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Open & Cross-Disciplinary Electives</h3>
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Optional Minors
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Additional elective subjects across other technical domains if you wish to explore interdisciplinary breadth.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    {openElectives.length} Elective{openElectives.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => toggleSectionCollapse('open-electives')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={collapsedSections['open-electives'] ? 'Expand section' : 'Collapse section'}
                  >
                    {collapsedSections['open-electives'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              {!collapsedSections['open-electives'] && (
                <div className="space-y-4">
                  {openElectives.map((item, idx) => renderCourseCard(item, idx))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Semantic Vector Inspector Modal */}
      {isSemanticModalOpen && (
        <SemanticVectorModal
          courseResult={inspectingCourseResult}
          studentProfile={studentProfile}
          recommendations={recommendations}
          onClose={() => setIsSemanticModalOpen(false)}
        />
      )}

    </div>
  );
};


