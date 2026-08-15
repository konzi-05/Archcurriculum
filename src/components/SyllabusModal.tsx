import React, { useState } from 'react';
import { Course } from '../types/curriculum';
import { 
  X, BookOpen, Clock, ShieldCheck, CheckCircle2, 
  BrainCircuit, Wrench, Users, Terminal, Sparkles, 
  Layers, ArrowRight, Compass, Cpu, Building2, GitBranch, ExternalLink
} from 'lucide-react';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
  onOpenSiwesPortal?: () => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ course, onClose, onOpenSiwesPortal }) => {
  const isSiwes = Boolean(course?.isSiwesCourse || course?.id === 'CS405' || course?.code?.includes('499'));
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomes' | 'competencies' | 'skills' | 'siwes'>(
    isSiwes ? 'siwes' : 'overview'
  );

  if (!course) return null;

  const lectureHours = course.lectureHours ?? (isSiwes ? 0 : 2);
  const practicalHours = course.practicalHours ?? (isSiwes ? 40 : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-xl shrink-0 mt-0.5 border ${
              isSiwes 
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}>
              {isSiwes ? <Building2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900 font-mono">
                  {course.code || course.futMinnaCode}
                </span>
                {course.nucCcmasCode && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 font-mono">
                    NUC CCMAS: {course.nucCcmasCode}
                  </span>
                )}
                {isSiwes && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
                    Statutory Scheme
                  </span>
                )}
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
                  course.type === 'Core' || course.type === 'Project' 
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                }`}>
                  {course.type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {course.academicLevel || `Level ${course.semester}`} • Sem {course.semester}
                </span>
              </div>
              <h2 className="text-base sm:lg font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {course.title || course.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px] shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NUC CCMAS Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-100/70 dark:bg-slate-900/70 overflow-x-auto text-xs">
          {isSiwes && (
            <button
              onClick={() => setActiveTab('siwes')}
              className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'siwes'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              SIWES Statutory Architecture
            </button>
          )}

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Course Overview & LH/PH
          </button>

          <button
            onClick={() => setActiveTab('outcomes')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'outcomes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Learning Outcomes ({course.learningOutcomes?.length || 4})
          </button>

          <button
            onClick={() => setActiveTab('competencies')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'competencies'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
            Competencies
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            Skills & Tools Stack
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-slate-50/40 dark:bg-slate-950/40">
          
          {/* TAB: SIWES STATUTORY ARCHITECTURE */}
          {activeTab === 'siwes' && isSiwes && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-blue-900 dark:text-blue-200 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Statutory Institutional Entity: SIWES II (6 Months)
                  </h3>
                  <p className="text-blue-800/80 dark:text-blue-300/80 text-[11px] mt-1">
                    SIWES is an institutionalized statutory requirement under ITF and NUC CCMAS decrees, evaluated strictly across eligibility gates, standing rules, and degree clearance dependencies.
                  </p>
                </div>
                {onOpenSiwesPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSiwesPortal();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 transition-colors"
                  >
                    <span>Launch SIWES Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Conceptual Hierarchy Tree */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] border border-slate-800 shadow-inner space-y-1">
                <p className="text-emerald-400 font-bold">SIWES</p>
                <p className="text-slate-500">│</p>
                <p className="text-slate-300">├── <span className="text-amber-300 font-bold">Required?</span> → Mandatory Statutory Requirement (NUC / ITF Mandate)</p>
                <p className="text-slate-300">├── <span className="text-cyan-300 font-bold">Eligible Level</span> → 400 Level (Rain Semester / 6-Month Block)</p>
                <p className="text-slate-300">├── <span className="text-purple-300 font-bold">Prerequisites</span> → Min 90 Units Earned + Core Computing Clearance</p>
                <p className="text-slate-300">├── <span className="text-sky-300 font-bold">Duration</span> → 6 Months (24 Weeks Continuous Attachment)</p>
                <p className="text-slate-300">├── <span className="text-pink-300 font-bold">Credit Units</span> → 6 Credit Units (100% Semester Workload Weight)</p>
                <p className="text-slate-300">├── <span className="text-lime-300 font-bold">Academic Standing Requirement</span> → CGPA ≥ 1.50 (Good Academic Standing)</p>
                <p className="text-slate-300">└── <span className="text-emerald-400 font-bold">Completion Status</span> → Real-time institutional clearance & defense grading</p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration & Contact Structure</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">24 Calendar Weeks Continuous Off-Campus Attachment</p>
                  <p className="text-slate-500 text-[11px]">0 Lecture Hours (LH) • 40 Practical Hours (PH) weekly in enterprise production environments.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assessment & Defense Matrix</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Institutional Supervision (20%) + Report & Defense (80%)</p>
                  <p className="text-slate-500 text-[11px]">Evaluated by industry mentor, institutional assessor, 50-page technical report, and faculty oral defense panel.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW & LH/PH */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* NUC Credit & Contact Hours Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Credit Units</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">{course.credits} Units</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">NUC Minimum Standards</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Lecture Hours (LH)</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-slate-200">{lectureHours} hrs/week</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{lectureHours * 15} hrs total semester</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Practical Hours (PH)</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{practicalHours} hrs/week</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{practicalHours * 15} hrs laboratory sessions</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Bloom Taxonomy</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{course.bloomLevel}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Cognitive Target</span>
                </div>
              </div>

              {/* NUC & IEEE Accreditation Standards Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-950 dark:text-blue-200 block">NUC CCMAS Statutory Mapping:</span>
                  <span className="text-[11px] text-blue-800 dark:text-blue-300">
                    FUT Minna ({course.futMinnaCode || course.code}) • NUC ({course.nucCcmasCode || 'Aligned'}) • {course.ieeeAcmStandard || 'IEEE/ACM CS2023 / IT2017'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white shrink-0 shadow-xs">
                  CCMAS Compliant
                </span>
              </div>

              {/* Prerequisites check */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">
                  Academic Prerequisites
                </span>
                {course.prerequisites && course.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {course.prerequisites.map(prereq => (
                      <span key={prereq} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold border border-slate-200 dark:border-slate-700">
                        {prereq}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No prerequisites required (Direct Entry / Open Enrollment)
                  </span>
                )}
              </div>

              {/* Course Description */}
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  Official NUC Course Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                  {course.description}
                </p>
              </div>

              {/* Syllabus Units */}
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  Syllabus Modular Topic Units
                </h3>
                <div className="space-y-2">
                  {course.syllabus.map((topic, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-2xs">
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-xs mt-0.5 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 shrink-0 font-mono">
                        Module {idx + 1}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 leading-normal font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEARNING OUTCOMES */}
          {activeTab === 'outcomes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  NUC CCMAS Measurable Learning Outcomes
                </h4>
                <p className="text-emerald-800 dark:text-emerald-300 text-[11px] mt-1">
                  Upon successful completion of this course, students are systematically assessed against these Bloom-taxonomy learning benchmarks:
                </p>
              </div>

              <div className="space-y-2.5">
                {(course.learningOutcomes || [
                  'Analyze foundational principles and mathematical representations of computing problems',
                  'Design and implement algorithmic and software solutions adhering to standard engineering patterns',
                  'Evaluate computational efficiency, space-time complexity, and security trade-offs',
                  'Formulate technical documentation and collaborate in structured software teams'
                ]).map((outcome, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-2xs">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        Outcome {idx + 1} • {outcome.split(' ')[0]} Target
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPETENCIES */}
          {activeTab === 'competencies' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Tri-Fold Competencies Framework (NUC Benchmark)
                </h4>
                <p className="text-indigo-800 dark:text-indigo-300 text-[11px] mt-1">
                  Courses cultivate cognitive reasoning models, technical execution proficiency, and professional soft competencies that feed directly into the Career Skill Map.
                </p>
              </div>

              {/* Cognitive Competencies */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    <BrainCircuit className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Cognitive Competencies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(course.competencies?.cognitive || ['Algorithmic Reasoning', 'Theoretical Modeling', 'Complexity Analysis']).map((comp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-xs">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Competencies */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Technical Competencies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(course.competencies?.technical || ['System Implementation', 'Debugging & Optimization', 'Toolchain Mastery']).map((comp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Competencies */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Soft & Professional Competencies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(course.competencies?.soft || ['Technical Communication', 'Teamwork & Code Review', 'Ethical Responsibility']).map((comp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-xs">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS & TOOLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Skills & Tools Inventory (CCMAS & Industry Ready)
                </h4>
                <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-1">
                  Structured multi-dimensional skills breakdown spanning domain knowledge, hands-on lab capabilities, soft skills, and production software tools.
                </p>
              </div>

              {/* Knowledge Skills */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">
                  Knowledge & Conceptual Domains
                </span>
                <div className="flex flex-wrap gap-2">
                  {(course.skills?.knowledge || course.skillsAcquired.slice(0, 3)).map((k, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Practical Skills */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <span className="text-emerald-700 dark:text-emerald-400 block text-[10px] font-bold uppercase tracking-wider">
                  Hands-on Practical Lab Skills ({course.practicalHours || 0} hrs/wk)
                </span>
                <div className="flex flex-wrap gap-2">
                  {(course.skills?.practical || course.skillsAcquired).map((p, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <span className="text-blue-700 dark:text-blue-400 block text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  Software, Toolchains & Frameworks Mastered
                </span>
                <div className="flex flex-wrap gap-2">
                  {(course.skills?.tools || ['VS Code', 'Git/GitHub', 'Linux Terminal']).map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono font-bold text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer with Pipeline Indicator */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Pipeline:</span>
            <span>Course Model</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>Career Skill Map</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-blue-600 dark:text-blue-400 font-bold">Recommendation Engine</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl transition-colors min-h-[40px]"
          >
            Close Syllabus
          </button>
        </div>

      </div>
    </div>
  );
};
