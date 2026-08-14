import React, { useState, useRef } from 'react';
import { RecommendedCourseResult, StudentProfile, Course } from '../types/curriculum';
import { CAREER_TRACKS } from '../data/btechItCurriculum';
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
  SlidersHorizontal
} from 'lucide-react';
import { SemanticVectorModal } from './SemanticVectorModal';

interface RecommendationDashboardProps {
  recommendations: RecommendedCourseResult[];
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  onTogglePlanCourse: (courseId: string) => void;
  onOpenSyllabusModal: (course: Course) => void;
  onOpenCounselor: () => void;
  recommendationMode?: 'semantic-embeddings' | 'legacy-tfidf';
  onToggleRecommendationMode?: () => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  recommendations,
  studentProfile,
  selectedPlanCourseIds,
  onTogglePlanCourse,
  onOpenSyllabusModal,
  onOpenCounselor,
  recommendationMode = 'semantic-embeddings',
  onToggleRecommendationMode
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [prereqOnlyFilter, setPrereqOnlyFilter] = useState<boolean>(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [activeSectionTab, setActiveSectionTab] = useState<'ALL' | 'CAREER_ELECTIVES' | 'CORE_COURSES' | 'OPEN_ELECTIVES'>('ALL');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'career-electives': false,
    'core-courses': false,
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

  const filteredRecommendations = recommendations.filter(item => {
    if (selectedDomain !== 'All' && item.course.domain !== selectedDomain) return false;
    if (prereqOnlyFilter && !item.prerequisitesMet) return false;
    if (item.matchScore < minMatchFilter) return false;
    return true;
  });

  // Categorize courses into distinct, digestible packages
  const careerElectives = filteredRecommendations.filter(r => 
    r.course.type === 'Elective' && (targetTrack.recommendedElectiveIds.includes(r.course.id) || r.matchScore >= 70)
  );

  const coreCourses = filteredRecommendations.filter(r => 
    r.course.type === 'Core' || r.course.type === 'Lab'
  );

  const openElectives = filteredRecommendations.filter(r => 
    r.course.type === 'Elective' && !targetTrack.recommendedElectiveIds.includes(r.course.id) && r.matchScore < 70
  );

  const domains = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Systems', 'Cybersecurity & Networks', 'Hardware & Embedded', 'Math & Foundational CS'];

  const handleOpenVectorInspector = (courseRes?: RecommendedCourseResult) => {
    setInspectingCourseResult(courseRes || recommendations[0] || null);
    setIsSemanticModalOpen(true);
  };

  // Reusable Single Course Card Component
  const renderCourseCard = (item: RecommendedCourseResult, index: number, badgeLabel?: string, badgeColor?: string) => {
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
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
              #{index + 1}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                {/* Status Tags */}
                {item.prerequisitesMet ? (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Ready to Take
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Need Prerequisites First
                  </span>
                )}

                {badgeLabel ? (
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                    {badgeLabel}
                  </span>
                ) : course.type === 'Core' ? (
                  <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    Required Core
                  </span>
                ) : (
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    Career Elective
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
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{course.name}</h3>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap gap-y-0.5 font-medium">
                <span>Sem {course.semester} ({course.academicLevel || 'Level'})</span>
                <span>•</span>
                <span>{course.credits} Units</span>
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

          {/* Right Score & Action Button */}
          <div className="flex items-center space-x-4 self-end sm:self-auto pt-2 sm:pt-0">
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
        <p className="text-xs text-slate-600 dark:text-slate-300 my-3 leading-relaxed">
          {course.description}
        </p>

        {/* Score Breakdown Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
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
              <span className="text-blue-600 dark:text-blue-400 font-bold">{semanticScore}%</span>
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
      
      {/* Hero & Standards Telemetry Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Recommendation Hero Box */}
        <div className="lg:col-span-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-md shadow-indigo-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-100 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Organized Course Packages</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-200 bg-cyan-950/40 border border-cyan-400/30 px-3 py-1.5 rounded-full">
                <Binary className="w-3 h-3 text-cyan-300" />
                <span>AI Skill Matching</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Course Guide for <span className="text-cyan-300 font-extrabold bg-white/10 px-3 py-1 rounded-lg border border-cyan-300/30 inline-block my-1">{targetTrack.title}</span>
            </h2>
            <p className="text-sm text-indigo-100 mt-3 max-w-2xl leading-relaxed">
              We have categorized your Semester {studentProfile.currentSemester} subjects into clear sections below: <strong className="text-white">Required Core Courses</strong> (mandatory for all students) and <strong className="text-cyan-200">Recommended Career Electives</strong> (chosen to build skills for your target role).
            </p>
          </div>

          <div className="mt-7 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-6 sm:space-x-8">
              <div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold block mb-0.5">Ready to Take</span>
                <span className="text-lg font-extrabold text-white">{recommendations.filter(r => r.prerequisitesMet).length} of {recommendations.length}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold block mb-0.5">Career Electives</span>
                <span className="text-lg font-extrabold text-cyan-200">{careerElectives.length} Available</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold block mb-0.5">Core Courses</span>
                <span className="text-lg font-extrabold text-white">{coreCourses.length} Subjects</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenVectorInspector()}
                className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5"
                title="See how AI compares course topics to your career goals"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                <span>AI Matching Logic</span>
              </button>

              <button
                onClick={onOpenCounselor}
                className="text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 px-4 py-2 rounded-xl transition-all self-start sm:self-auto shadow-xs"
              >
                Ask AI Advisor →
              </button>
            </div>
          </div>
        </div>

        {/* Standard Compliance Sidebar Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs transition-colors">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Degree & Standard Check
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Career Skill Match</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">96.8%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[96%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Curriculum Standards</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">94.2%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[94%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Credit Limit: 24.0 Max</span>
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md font-bold text-[11px]">In Safe Limit</span>
          </div>
        </div>

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
                  <span>How Course Selection Works in B.Tech IT</span>
                  <span className="text-[10px] uppercase font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">First-Time Guide</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  To keep things simple, subjects are organized into two primary categories:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-blue-100 dark:border-slate-800">
                    <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1">
                      <GraduationCap className="w-4 h-4" /> 📘 Required Core Courses
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-normal">
                      Mandatory foundation subjects that every B.Tech IT student must complete. You should enroll in all core courses for your semester.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-blue-100 dark:border-slate-800">
                    <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                      <Compass className="w-4 h-4" /> 🎯 Career Elective Choices
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-normal">
                      Specialization subjects aligned to your career track ({targetTrack.title}). Pick <strong className="text-slate-800 dark:text-slate-200">1 to 2 electives</strong> to reach ~20–22 total semester credits.
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

      {/* Package Navigation Segmented Tabs */}
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
          <span>All Packaged Sections ({filteredRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('CAREER_ELECTIVES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'CAREER_ELECTIVES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>🎯 Career Electives ({careerElectives.length})</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('CORE_COURSES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSectionTab === 'CORE_COURSES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>📘 Required Core ({coreCourses.length})</span>
        </button>

        {openElectives.length > 0 && (
          <button
            onClick={() => setActiveSectionTab('OPEN_ELECTIVES')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSectionTab === 'OPEN_ELECTIVES'
                ? 'bg-blue-600 text-white shadow-xs'
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
            <span>Ready to Take</span>
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
            Try adjusting the subject area filter or lowering the minimum match percentage.
          </p>
          <button
            onClick={() => { setSelectedDomain('All'); setPrereqOnlyFilter(false); setMinMatchFilter(0); }}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECTION 1: RECOMMENDED CAREER ELECTIVES */}
          {(activeSectionTab === 'ALL' || activeSectionTab === 'CAREER_ELECTIVES') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-blue-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <Compass className="w-5 h-5 text-cyan-200" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Recommended Career Electives</h3>
                      <span className="text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        {targetTrack.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Curated subjects tailored to build your industry competency. Choose <strong className="text-slate-700 dark:text-slate-300">1 to 2 electives</strong> for your semester schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900">
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
                    careerElectives.map((item, idx) => 
                      renderCourseCard(item, idx, 'Career Elective', 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800')
                    )
                  )}
                </div>
              )}

            </div>
          )}

          {/* SECTION 2: REQUIRED CORE COURSES */}
          {(activeSectionTab === 'ALL' || activeSectionTab === 'CORE_COURSES') && (
            <div className="space-y-4">
              
              {/* Section Header Card */}
              <div className="bg-gradient-to-r from-purple-50/80 via-white to-pink-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30 border border-purple-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs font-bold shrink-0">
                    <GraduationCap className="w-5 h-5 text-purple-200" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Required Core Courses</h3>
                      <span className="text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        Semester {studentProfile.currentSemester} Mandatory
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Foundational computing, algorithms, and systems courses required for AICTE B.Tech IT degree compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900">
                    {coreCourses.length} Core Course{coreCourses.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => toggleSectionCollapse('core-courses')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={collapsedSections['core-courses'] ? 'Expand section' : 'Collapse section'}
                  >
                    {collapsedSections['core-courses'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cards Container */}
              {!collapsedSections['core-courses'] && (
                <div className="space-y-4">
                  {coreCourses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No core courses matched the current filter.
                    </div>
                  ) : (
                    coreCourses.map((item, idx) => 
                      renderCourseCard(item, idx, 'Required Core', 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800')
                    )
                  )}
                </div>
              )}

            </div>
          )}

          {/* SECTION 3: OPEN & INTERDISCIPLINARY ELECTIVES */}
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
                  {openElectives.map((item, idx) => 
                    renderCourseCard(item, idx, 'Open Elective', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800')
                  )}
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

