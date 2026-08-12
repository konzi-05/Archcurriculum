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
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);

  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  const filteredRecommendations = recommendations.filter(item => {
    if (selectedDomain !== 'All' && item.course.domain !== selectedDomain) return false;
    if (prereqOnlyFilter && !item.prerequisitesMet) return false;
    if (item.matchScore < minMatchFilter) return false;
    return true;
  });

  const domains = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Systems', 'Cybersecurity & Networks', 'Hardware & Embedded', 'Math & Foundational CS'];

  return (
    <div className="space-y-8">
      
      {/* Hero & Standards Telemetry Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Recommendation Hero Box */}
        <div className="lg:col-span-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-md shadow-indigo-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-100 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Smart Elective Recommendation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Recommended Electives for <span className="text-cyan-300 font-extrabold bg-white/10 px-3 py-1 rounded-lg border border-cyan-300/30 inline-block my-1">{targetTrack.title}</span>
            </h2>
            <p className="text-sm text-indigo-100 mt-3 max-w-2xl leading-relaxed">
              Personalized course recommendations tailored for Semester {studentProfile.currentSemester} prerequisites, credit limits, and core industry competencies required across Information Technology and target career tracks like {targetTrack.targetRole}.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-6 sm:space-x-8">
              <div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold block mb-0.5">Eligible Courses</span>
                <span className="text-lg font-extrabold text-white">{recommendations.filter(r => r.prerequisitesMet).length} / {recommendations.length}</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold block mb-0.5">Specialization Electives</span>
                <span className="text-lg font-extrabold text-cyan-200">{targetTrack.recommendedElectiveIds.length} Modules</span>
              </div>
            </div>

            <button
              onClick={onOpenCounselor}
              className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
            >
              Ask Academic Counselor →
            </button>
          </div>
        </div>

        {/* Standard Compliance Sidebar Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs transition-colors">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Curriculum Alignment
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">ABET Standard</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">98.4%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">IEEE/ACM Alignment</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">94.2%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[94%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>AICTE Credit Limit: 24.0 Cr</span>
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md font-bold text-[11px]">Compliant</span>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs shadow-xs transition-colors">
        
        {/* Domain Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          <span className="font-bold text-slate-500 dark:text-slate-400 text-xs flex-shrink-0 mr-1">Domain:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-xl text-xs border whitespace-nowrap transition-all font-semibold ${
                selectedDomain === dom
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Checkbox & Min Match */}
        <div className="flex items-center space-x-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
          <label className="flex items-center space-x-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none text-xs">
            <input
              type="checkbox"
              checked={prereqOnlyFilter}
              onChange={e => setPrereqOnlyFilter(e.target.checked)}
              className="accent-blue-600 rounded border-slate-300 dark:border-slate-700 w-4 h-4"
            />
            <span>Prerequisites Met Only</span>
          </label>

          <div className="flex items-center space-x-2.5">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Min Match:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchFilter}
              onChange={e => setMinMatchFilter(Number(e.target.value))}
              className="w-20 accent-blue-600"
            />
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs w-8">{minMatchFilter}%</span>
          </div>
        </div>

      </div>

      {/* Course Cards */}
      <div className="space-y-5 sm:space-y-6">
        {filteredRecommendations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400 shadow-xs">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">No courses matched your current filter criteria</h3>
            <p className="text-xs max-w-md mx-auto mb-5 text-slate-500 dark:text-slate-400 leading-relaxed">
              Try adjusting the domain filter or lowering the minimum match threshold.
            </p>
            <button
              onClick={() => { setSelectedDomain('All'); setPrereqOnlyFilter(false); setMinMatchFilter(0); }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
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
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 sm:p-7 transition-all relative overflow-hidden shadow-xs hover:shadow-md ${
                  inPlanner
                    ? 'border-blue-500/80 ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
                        {/* Status Tags */}
                        {item.prerequisitesMet ? (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Prerequisites Satisfied
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            Prerequisites Needed
                          </span>
                        )}

                        {course.type === 'Core' ? (
                          <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                            Core Subject
                          </span>
                        ) : (
                          <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Recommended Elective
                          </span>
                        )}

                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">{course.code}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{course.name}</h3>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap gap-y-0.5 font-medium">
                        <span>Sem {course.semester}</span>
                        <span>•</span>
                        <span>{course.credits} Credits</span>
                        <span>•</span>
                        <span className="text-slate-700 dark:text-slate-300">{course.domain}</span>
                        <span>•</span>
                        <span>Difficulty: {course.difficulty}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Score & Action Button */}
                  <div className="flex items-center space-x-5 self-end sm:self-auto pt-2 sm:pt-0">
                    <div className="text-right">
                      <div className={`text-xl sm:text-2xl font-extrabold ${
                        item.matchScore >= 80 ? 'text-blue-600 dark:text-blue-400' : item.matchScore >= 60 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.matchScore}%
                      </div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Match Score</div>
                    </div>

                    <button
                      id={`btn-plan-${course.id}`}
                      onClick={() => onTogglePlanCourse(course.id)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        inPlanner
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none'
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
                <p className="text-xs text-slate-600 dark:text-slate-300 my-3.5 leading-relaxed">
                  {course.description}
                </p>

                {/* Score Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
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
                      <span>Career Relevance</span>
                      <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.careerMatchScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.breakdown.careerMatchScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
                      <span>Skill Value</span>
                      <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.skillGapScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.breakdown.skillGapScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1 font-medium">
                      <span>Workload Balance</span>
                      <span className="text-slate-900 dark:text-white font-bold">{item.breakdown.workloadBalanceScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${item.breakdown.workloadBalanceScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Reasons / Warnings / Syllabus Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    {item.matchReasons.map((reason, idx) => (
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

                  <button
                    onClick={() => onOpenSyllabusModal(course)}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Syllabus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
