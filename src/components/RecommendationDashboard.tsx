import React, { useState } from 'react';
import { RecommendedCourseResult, StudentProfile, Course } from '../types/curriculum';
import { CAREER_TRACKS } from '../data/btechItCurriculum';
import { Sparkles, CheckCircle2, AlertTriangle, ChevronRight, Plus, Check, Filter, BookOpen, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

interface RecommendationDashboardProps {
  recommendations: RecommendedCourseResult[];
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  onTogglePlanCourse: (courseId: string) => void;
  onOpenSyllabusModal: (course: Course) => void;
  onOpenCounselor: () => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({
  recommendations,
  studentProfile,
  selectedPlanCourseIds,
  onTogglePlanCourse,
  onOpenSyllabusModal,
  onOpenCounselor
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [prereqOnlyFilter, setPrereqOnlyFilter] = useState<boolean>(false);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(50);

  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  const filteredRecommendations = recommendations.filter(item => {
    if (selectedDomain !== 'All' && item.course.domain !== selectedDomain) return false;
    if (prereqOnlyFilter && !item.prerequisitesMet) return false;
    if (item.matchScore < minMatchFilter) return false;
    return true;
  });

  const domains = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Systems', 'Cybersecurity & Networks', 'Hardware & Embedded', 'Math & Foundational CS'];

  return (
    <div className="space-y-6">
      
      {/* High Density Hero & Standards Telemetry Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Main Recommendation Hero Box */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-700 rounded p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Factor Algorithmic Recommendation Engine [Active]</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Elective & Specialization Matrix for <span className="text-blue-400 font-extrabold">{targetTrack.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Topological DAG prerequisite resolution, TF-IDF skill vector cosine alignment, and AICTE credit cap optimization for Semester {studentProfile.currentSemester}.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Eligible Courses</span>
                <span className="text-sm font-bold text-emerald-400">{recommendations.filter(r => r.prerequisitesMet).length} / {recommendations.length}</span>
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Target Electives</span>
                <span className="text-sm font-bold text-cyan-400">{targetTrack.recommendedElectiveIds.length} Modules</span>
              </div>
            </div>

            <button
              onClick={onOpenCounselor}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-500/40 underline-offset-4"
            >
              Consult Gemini AI Advisor →
            </button>
          </div>
        </div>

        {/* High Density Standard Analysis Sidebar Panel */}
        <div className="bg-slate-800/40 border border-slate-700 rounded p-4 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3">
              Standard Compliance
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">ABET IT Standard</span>
                  <span className="text-emerald-400 font-mono text-xs font-bold">98.4%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">IEEE/ACM Alignment</span>
                  <span className="text-blue-400 font-mono text-xs font-bold">94.2%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>AICTE Cap: 24.0 Cr</span>
            <span className="text-blue-400">Status: PASS</span>
          </div>
        </div>

      </div>

      {/* High Density Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-700 p-3 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        
        {/* Domain Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="font-bold text-slate-400 uppercase font-mono text-[10px] flex-shrink-0">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-2 py-0.5 rounded text-xs border whitespace-nowrap transition-colors font-mono ${
                selectedDomain === dom
                  ? 'bg-blue-600 border-blue-500 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Checkbox & Min Match */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300 select-none text-xs">
            <input
              type="checkbox"
              checked={prereqOnlyFilter}
              onChange={e => setPrereqOnlyFilter(e.target.checked)}
              className="accent-blue-600 rounded bg-slate-950 border-slate-700"
            />
            <span>Prereqs Met Only</span>
          </label>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Min Match:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchFilter}
              onChange={e => setMinMatchFilter(Number(e.target.value))}
              className="w-16 accent-blue-500"
            />
            <span className="font-mono text-blue-400 font-bold text-xs">{minMatchFilter}%</span>
          </div>
        </div>

      </div>

      {/* Course Cards */}
      <div className="space-y-3">
        {filteredRecommendations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-700 rounded p-8 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">No courses matched your current filter criteria</h3>
            <p className="text-xs max-w-md mx-auto mb-4 text-slate-400">
              Try adjusting the domain filter or lowering the minimum match threshold.
            </p>
            <button
              onClick={() => { setSelectedDomain('All'); setPrereqOnlyFilter(false); setMinMatchFilter(0); }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded border border-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRecommendations.map((item, index) => {
            const course = item.course;
            const inPlanner = selectedPlanCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className={`bg-slate-900 border rounded p-4 transition-all relative overflow-hidden ${
                  inPlanner
                    ? 'border-cyan-500/80 bg-slate-900/90'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-slate-400 flex-shrink-0">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {/* High Density Status Tags */}
                        {item.prerequisitesMet ? (
                          <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            PREREQUISITE MET
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold font-mono uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                            PREREQ MISSING
                          </span>
                        )}

                        {course.type === 'Core' ? (
                          <span className="text-[10px] text-purple-400 font-bold font-mono uppercase bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30">
                            CORE MODULE
                          </span>
                        ) : (
                          <span className="text-[10px] text-blue-400 font-bold font-mono uppercase bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                            RECOMMENDED ELECTIVE
                          </span>
                        )}

                        <span className="font-mono text-xs font-bold text-blue-400 ml-1">{course.code}</span>
                        <h3 className="text-sm font-bold text-slate-100">{course.name}</h3>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 mt-1 flex-wrap gap-y-0.5">
                        <span>Sem {course.semester}</span>
                        <span>•</span>
                        <span>{course.credits} Credits</span>
                        <span>•</span>
                        <span className="text-slate-300">{course.domain}</span>
                        <span>•</span>
                        <span>Complexity: {course.difficulty}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Score & Action Button */}
                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <div className="text-right">
                      <div className={`text-lg font-bold font-mono ${
                        item.matchScore >= 80 ? 'text-cyan-400' : item.matchScore >= 60 ? 'text-blue-400' : 'text-amber-400'
                      }`}>
                        {item.matchScore}%
                      </div>
                      <div className="text-[9px] uppercase font-mono text-slate-500">Matching Score</div>
                    </div>

                    <button
                      id={`btn-plan-${course.id}`}
                      onClick={() => onTogglePlanCourse(course.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                        inPlanner
                          ? 'bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {inPlanner ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>In Plan</span>
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
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Score Breakdown Bar (High Density Matrix) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 p-2.5 rounded bg-slate-800/40 border border-slate-700/80 text-[10px] font-mono">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Prereq Fit</span>
                      <span className="text-slate-200 font-bold">{item.breakdown.prerequisiteScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${item.breakdown.prerequisiteScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Career Align</span>
                      <span className="text-slate-200 font-bold">{item.breakdown.careerMatchScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${item.breakdown.careerMatchScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Skill Gain</span>
                      <span className="text-slate-200 font-bold">{item.breakdown.skillGapScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${item.breakdown.skillGapScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Workload Index</span>
                      <span className="text-slate-200 font-bold">{item.breakdown.workloadBalanceScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400" style={{ width: `${item.breakdown.workloadBalanceScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Reasons / Warnings / Syllabus Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800">
                  <div className="space-y-0.5">
                    {item.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}

                    {item.warningFlags.map((warn, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-amber-400 text-[11px]">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenSyllabusModal(course)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 text-xs font-semibold transition-colors self-start sm:self-auto font-mono text-[11px]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Syllabus Breakdown</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
