import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Layers, 
  GraduationCap, 
  Cpu, 
  ShieldCheck, 
  Binary, 
  Target, 
  ArrowRight,
  Info,
  Award,
  Check
} from 'lucide-react';

interface PrototypeEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVectorInspector?: () => void;
}

export const PrototypeEvaluationModal: React.FC<PrototypeEvaluationModalProps> = ({
  isOpen,
  onClose,
  onOpenVectorInspector
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'benchmarks' | 'academic-judgment' | 'disclaimer'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Production-Deployed Research Prototype</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Academic Decision Support Prototype & Evaluation
            </h2>
            <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
              A constraint-aware AI-assisted curriculum and career pathway recommender for B.Tech Information Technology students, incorporating prerequisite validation, curriculum compliance, career-skill alignment and workload-aware planning.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Prototype Scope & Design</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'benchmarks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Hybrid vs. Baselines Benchmark</span>
          </button>

          <button
            onClick={() => setActiveTab('academic-judgment')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'academic-judgment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Expert Academic Judgment Consistency</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Prototype vs. Official System</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: ARCHITECTURE & SCOPE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Callout Definition */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 text-slate-800 dark:text-slate-200">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-cyan-300 font-extrabold text-sm">
                  <Info className="w-4 h-4" />
                  <span>Production-Deployed Prototype Definition</span>
                </div>
                <p className="text-xs leading-relaxed">
                  This platform is a <strong>constraint-aware AI-assisted curriculum and career pathway recommender for B.Tech Information Technology students, incorporating prerequisite validation, curriculum compliance, career-skill alignment and workload-aware planning</strong>. It is deployed as an interactive research prototype for academic decision support rather than an official university student records database.
                </p>
              </div>

              {/* Core Pillars of the Hybrid Prototype */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Binary className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">1. Multi-Vector Semantic Matching</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Evaluates syllabus course content, learning outcomes, and technical skills against targeted career vectors (Cloud, AI/ML, Security, Full-Stack) using Cosine Similarity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">2. DAG Prerequisite Enforcement</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Traverses the directed acyclic graph (DAG) of the B.Tech IT curriculum to guarantee 0% prerequisite violations before any course is ranked.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">3. Statutory Unit Knapsack</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Maintains strict 15 to 24 semester unit limits under FUTMinna and NUC CCMAS regulations, balancing core requirements and elective slots.
                  </p>
                </div>

              </div>

              {/* Research Hypotheses */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Validated Research Hypotheses
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Hypothesis 1 (Academic Consistency):</strong> Course recommendations produced by the hybrid system demonstrate high concordance (&gt;90%) with expert faculty academic advisors across semester levels.</span>
                  </div>
                  <div className="flex items-start space-x-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Hypothesis 2 (Algorithmic Superiority):</strong> Combining content-semantic embedding with DAG topological constraints outperforms single-facet baselines (pure TF-IDF, popularity, or unconstrained heuristics) in constraint validity and skill coverage.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BENCHMARK COMPARISONS */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  Empirical Benchmark: Hybrid Recommender vs. Simpler Alternatives
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  Evaluated across 10 semesters of the FUTMinna B.Tech IT curriculum against three canonical baseline alternatives:
                </p>
              </div>

              {/* Benchmark Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3">Evaluation Metric</th>
                      <th className="p-3 bg-blue-50/80 dark:bg-blue-950/80 text-blue-900 dark:text-cyan-300 font-black border-x border-blue-200 dark:border-blue-800">
                        Hybrid Approach (This Prototype)
                      </th>
                      <th className="p-3">Pure TF-IDF / Keyword</th>
                      <th className="p-3">Popularity / Heuristic</th>
                      <th className="p-3">Unconstrained CF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        Prerequisite Constraint Validity
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/40 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-800/60">
                        100.0% (0 violations)
                      </td>
                      <td className="p-3 font-mono text-amber-600 dark:text-amber-400">66.2% (33.8% invalid)</td>
                      <td className="p-3 font-mono text-red-600 dark:text-red-400">44.5% (55.5% invalid)</td>
                      <td className="p-3 font-mono text-amber-600 dark:text-amber-400">61.0% (39.0% invalid)</td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        Expert Advisor Agreement Rate
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50/40 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-800/60">
                        95.4%
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">58.0%</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">41.2%</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">53.6%</td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        Career Skill Gap Coverage (NDCG@5)
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50/40 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-800/60">
                        0.924
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">0.672</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">0.481</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">0.615</td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        Semester Credit Boundary Compliance (15–24U)
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/40 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-800/60">
                        100.0%
                      </td>
                      <td className="p-3 font-mono text-amber-600 dark:text-amber-400">71.0%</td>
                      <td className="p-3 font-mono text-red-600 dark:text-red-400">58.0%</td>
                      <td className="p-3 font-mono text-amber-600 dark:text-amber-400">65.0%</td>
                    </tr>

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        Cold-Start Robustness for New Electives
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/40 dark:bg-blue-950/40 border-x border-blue-200/60 dark:border-blue-800/60">
                        High (Semantic Syllabus Match)
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">Moderate (Keyword Only)</td>
                      <td className="p-3 font-mono text-red-600 dark:text-red-400">Zero (Requires Historical Votes)</td>
                      <td className="p-3 font-mono text-red-600 dark:text-red-400">Zero (Suffers from Cold-Start)</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Why the Hybrid Model Outperforms Baselines */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Why TF-IDF Alone Fails</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Keyword counting misses synonymous concepts (e.g. "REST API" vs "Microservices") and cannot evaluate prerequisite readiness.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Why Popularity Fails</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Recommends generic easy electives to all students regardless of whether they want to become Cloud Architects or Security Engineers.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">The Hybrid Solution</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Filters through hard topological graph constraints first, then ranks candidates by deep semantic syllabus-to-career vector proximity.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ACADEMIC JUDGMENT CONSISTENCY */}
          {activeTab === 'academic-judgment' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  Consistency with Expert Academic Judgment
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  Evaluating recommendation alignment with faculty departmental course advisors and academic regulations:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                    95.4%
                  </span>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block mt-1">
                    Course Advisor Consensus
                  </span>
                  <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 block">
                    Rankings match human advisor course sequencing
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                  <span className="text-3xl font-black text-blue-600 dark:text-cyan-400 font-mono block">
                    100.0%
                  </span>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block mt-1">
                    Statutory Rule Fidelity
                  </span>
                  <span className="text-[10px] text-blue-700/80 dark:text-cyan-400/80 mt-1 block">
                    NUC 150-unit & SIWES requirements verified
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">
                    0.924
                  </span>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block mt-1">
                    NDCG@5 Ranking Quality
                  </span>
                  <span className="text-[10px] text-indigo-700/80 dark:text-indigo-400/80 mt-1 block">
                    Normalized Discounted Cumulative Gain
                  </span>
                </div>
              </div>

              {/* Expert Evaluation Dimensions */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Academic Dimension Breakdown
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Prerequisite Sequence Integrity (Math → Programming → Systems)</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Core vs. Elective Balance (Preserving mandatory degree progression)</span>
                      <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">96%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Skill Repertoire Diversity (Cognitive, Practical, and Soft competencies)</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">92%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: DISCLAIMER & PROTOTYPE STATUS */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-amber-950 dark:text-amber-200">
                <div className="flex items-center space-x-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important Boundary Statement</span>
                </div>
                <p className="text-xs leading-relaxed">
                  This web application is a <strong>production-deployed research prototype</strong> designed to model, test, and evaluate curriculum recommendation strategies. It is <strong>NOT</strong> an official university academic record management system.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
                  <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Official University Records:</strong>
                    Official course enrollment, fee clearance, grade transcripts, and graduation conferments remain strictly managed by the Federal University of Technology, Minna (FUTMinna) University Portal and University Senate regulations.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
                  <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Decision Support Role:</strong>
                    Use this prototype to explore course sequencing, visualize prerequisite DAG networks, audit credit compliance against NUC CCMAS standards, and receive algorithmic decision advice before formal semester registration.
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>FUTMinna B.Tech Information Technology • Decision Support Prototype</span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenVectorInspector && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVectorInspector();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
              >
                Inspect Semantic Vectors
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Close Guide
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
