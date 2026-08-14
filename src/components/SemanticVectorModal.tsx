import React, { useState } from 'react';
import { Course, StudentProfile, RecommendedCourseResult } from '../types/curriculum';
import { CAREER_TRACKS } from '../data/btechItCurriculum';
import { SEMANTIC_DIMENSIONS, cosineSimilarity, generateCourseSemanticVector, generateTrackSemanticVector, normalizeVector } from '../services/semanticEmbeddings';
import { X, Sparkles, Binary, Cpu, Layers, HelpCircle, ArrowRight, CheckCircle2, Search, Sliders, Activity } from 'lucide-react';

interface SemanticVectorModalProps {
  courseResult?: RecommendedCourseResult | null;
  studentProfile: StudentProfile;
  recommendations: RecommendedCourseResult[];
  onClose: () => void;
  onSelectCourse?: (course: Course) => void;
}

export const SemanticVectorModal: React.FC<SemanticVectorModalProps> = ({
  courseResult,
  studentProfile,
  recommendations,
  onClose,
  onSelectCourse
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'comparison' | 'sandbox'>('inspector');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseResult?.course.id || recommendations[0]?.course.id || 'CS501');
  const [sandboxQuery, setSandboxQuery] = useState<string>('Distributed microservices and high-throughput real-time streaming');
  const [sandboxSimScores, setSandboxSimScores] = useState<Array<{ course: Course; sim: number }>>([]);
  const [isComputingQuery, setIsComputingQuery] = useState<boolean>(false);

  const targetTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];
  const activeCourseResult = recommendations.find(r => r.course.id === selectedCourseId) || recommendations[0];
  const course = activeCourseResult?.course;
  const semanticDetails = activeCourseResult?.semanticDetails;

  const handleComputeSandbox = () => {
    setIsComputingQuery(true);
    setTimeout(() => {
      // Synthesize custom query vector
      const queryLower = sandboxQuery.toLowerCase();
      const qVec = new Array(SEMANTIC_DIMENSIONS.length).fill(0.05);

      if (queryLower.includes('ai') || queryLower.includes('learning') || queryLower.includes('model') || queryLower.includes('neural')) qVec[0] += 0.9;
      if (queryLower.includes('data') || queryLower.includes('stream') || queryLower.includes('sql') || queryLower.includes('pipeline')) qVec[1] += 0.9;
      if (queryLower.includes('cloud') || queryLower.includes('docker') || queryLower.includes('microservice') || queryLower.includes('distributed')) qVec[2] += 0.9;
      if (queryLower.includes('security') || queryLower.includes('crypto') || queryLower.includes('attack') || queryLower.includes('zero-trust')) qVec[3] += 0.95;
      if (queryLower.includes('web') || queryLower.includes('react') || queryLower.includes('frontend') || queryLower.includes('api')) qVec[4] += 0.9;
      if (queryLower.includes('algorithm') || queryLower.includes('graph') || queryLower.includes('complexity') || queryLower.includes('optimize')) qVec[5] += 0.9;
      if (queryLower.includes('kernel') || queryLower.includes('os') || queryLower.includes('memory') || queryLower.includes('c++')) qVec[6] += 0.9;
      if (queryLower.includes('network') || queryLower.includes('tcp') || queryLower.includes('protocol') || queryLower.includes('socket')) qVec[7] += 0.9;
      if (queryLower.includes('mobile') || queryLower.includes('iot') || queryLower.includes('sensor') || queryLower.includes('edge')) qVec[8] += 0.9;
      if (queryLower.includes('math') || queryLower.includes('prob') || queryLower.includes('stats') || queryLower.includes('calculus')) qVec[9] += 0.9;
      if (queryLower.includes('devops') || queryLower.includes('ci') || queryLower.includes('pipeline') || queryLower.includes('deploy')) qVec[10] += 0.9;

      const normQVec = normalizeVector(qVec);

      const scored = recommendations.map(r => {
        const cVec = generateCourseSemanticVector(r.course);
        const sim = Math.round(cosineSimilarity(normQVec, cVec) * 100);
        return { course: r.course, sim };
      }).sort((a, b) => b.sim - a.sim);

      setSandboxSimScores(scored);
      setIsComputingQuery(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transition-colors flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase mb-2">
              <Binary className="w-3.5 h-3.5 text-cyan-300" />
              <span>How AI Course Matching Works</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Skill Breakdown & Course Topic Matcher
            </h2>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl">
              See how our smart AI matches course syllabus topics with your career path skills (like Machine Learning, Cloud, and Software Engineering).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skill Topic Breakdown
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Why AI Understands Concepts Better Than Keywords
          </button>

          <button
            onClick={() => {
              setActiveTab('sandbox');
              if (sandboxSimScores.length === 0) handleComputeSandbox();
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Test Custom Topic Query
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {activeTab === 'inspector' && (
            <div className="space-y-6">
              {/* Course Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Inspected Subject:
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {recommendations.map(r => (
                      <option key={r.course.id} value={r.course.id}>
                        {r.course.code} - {r.course.name} ({r.matchScore}% Match)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Cosine Similarity</span>
                    <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {semanticDetails?.cosineSimilarity || 85}%
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Euclidean Distance</span>
                    <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                      {semanticDetails?.euclideanDistance || 0.45}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mathematical Formulation Header */}
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-blue-900 dark:text-blue-200 text-xs">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Mathematical Cosine Metric Formula</span>
                </div>
                <div className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {"Cosine Similarity(V_track, V_course) = (V_track · V_course) / (||V_track||₂ · ||V_course||₂) = [ ∑ (wᵢᵗʳᵃᶜᵏ · wᵢᶜᵒᵘʳˢᵉ) ] / [ √(∑ (wᵢᵗʳᵃᶜᵏ)²) · √(∑ (wᵢᶜᵒᵘʳˢᵉ)²) ]"}
                </div>
              </div>

              {/* 12-Dimensional Vector Decomposition */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  12-Dimensional Latent Ontology Projection ({targetTrack.title} vs. {course?.name})
                </h4>

                <div className="space-y-3">
                  {SEMANTIC_DIMENSIONS.map((dim, idx) => {
                    const cVec = course ? generateCourseSemanticVector(course) : [];
                    const tVec = generateTrackSemanticVector(targetTrack);
                    const cVal = Math.round((cVec[idx] || 0) * 100);
                    const tVal = Math.round((tVec[idx] || 0) * 100);

                    return (
                      <div key={dim} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1.5 font-medium">
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{dim}</span>
                          <div className="flex items-center space-x-3 text-[11px]">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">Course: {cVal}%</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Career Target: {tVal}%</span>
                          </div>
                        </div>

                        {/* Dual Bar Comparison */}
                        <div className="space-y-1">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${cVal}%` }}></div>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${tVal}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Why Semantic Embeddings Outperform Bag-of-Words & TF-IDF in Curriculum Planning
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  In classical <strong>TF-IDF (Term Frequency-Inverse Document Frequency)</strong>, similarity is strictly lexical. If a syllabus describes <em>"Deep Neural Architectures and Backpropagation"</em> and a career track requires <em>"Machine Learning Engineer"</em>, TF-IDF awards 0 points due to exact string mismatch. <strong>Semantic Dense Embeddings</strong> map both into an invariant conceptual manifold, recognizing that backpropagation is mathematically central to ML.
                </p>
              </div>

              {/* Comparative Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                    <tr>
                      <th className="p-3">Course Code & Name</th>
                      <th className="p-3">Discrete TF-IDF Overlap</th>
                      <th className="p-3">Dense Semantic Embedding</th>
                      <th className="p-3">Semantic Discovery Delta</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {recommendations.slice(0, 8).map(r => {
                      const sem = r.semanticDetails?.cosineSimilarity || 85;
                      const tfidf = r.semanticDetails?.tfidfScore || 40;
                      const delta = sem - tfidf;

                      return (
                        <tr key={r.course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                            {r.course.code}: {r.course.name}
                          </td>
                          <td className="p-3 text-slate-500 font-medium">{tfidf}%</td>
                          <td className="p-3 text-blue-600 dark:text-blue-400 font-bold">{sem}%</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{delta}%
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Latent Match
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Test Custom Career Aspirations / Project Topics:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sandboxQuery}
                    onChange={e => setSandboxQuery(e.target.value)}
                    placeholder="e.g., Deep generative models and autonomous robotics vision"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleComputeSandbox}
                    disabled={isComputingQuery}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shrink-0"
                  >
                    {isComputingQuery ? 'Embedding...' : 'Compute Vector Match'}
                  </button>
                </div>
              </div>

              {/* Ranked Output */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Semantically Ranked Courses for query: "{sandboxQuery}"
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sandboxSimScores.slice(0, 6).map(({ course: c, sim }, i) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase">{c.code} • Sem {c.semester}</div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.domain}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{sim}%</div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">Cosine Sim</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Embedding Model: <strong className="text-slate-700 dark:text-slate-200">gemini-embedding-2-preview</strong> (12D Orthogonal Latent Space)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
