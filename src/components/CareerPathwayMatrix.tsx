import React, { useState } from 'react';
import { StudentProfile, SkillGapItem } from '../types/curriculum';
import { CAREER_TRACKS, BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { CAREER_SKILL_MAPS } from '../data/careerSkillMaps';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  GraduationCap, Target, Award, CheckCircle2, AlertCircle, 
  BrainCircuit, Terminal, Users, Cpu, Clock, Layers, Sparkles, BookOpen, ChevronRight, Wrench
} from 'lucide-react';

interface CareerPathwayMatrixProps {
  studentProfile: StudentProfile;
  skillGapMatrix: SkillGapItem[];
  onChangeCareerTrack: (trackId: string) => void;
}

export const CareerPathwayMatrix: React.FC<CareerPathwayMatrixProps> = ({
  studentProfile,
  skillGapMatrix,
  onChangeCareerTrack
}) => {
  const [activeView, setActiveView] = useState<'matrix' | 'skill_map' | 'competencies'>('matrix');
  const currentTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];
  const skillMap = CAREER_SKILL_MAPS[currentTrack.id] || currentTrack.skillMap;

  // Radar Chart Data
  const radarData = skillGapMatrix.map(item => ({
    skill: item.skill,
    Current: item.currentLevel,
    Target: item.requiredLevel
  }));

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs transition-colors">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full mb-3">
            <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>NUC CCMAS Career Skill Map & Industry Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{currentTrack.title}</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {currentTrack.description}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-blue-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-blue-200 dark:border-slate-700 text-xs shrink-0">
          <div>
            <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase tracking-wider font-bold">Target Role</div>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">{currentTrack.targetRole}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">Avg Salary: {currentTrack.averageSalaryUSD}</div>
          </div>
        </div>
      </div>

      {/* Specialization Track Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs transition-colors space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Select B.Tech IT Specialization Pathway:
          </label>
          <span className="text-[11px] text-slate-500 font-medium">Bridges NUC Course Model to Industry Role</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CAREER_TRACKS.map(track => {
            const isSelected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => onChangeCareerTrack(track.id)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all text-xs ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <div className="truncate font-bold">{track.title}</div>
                <div className={`text-[11px] mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{track.industryDemand} Demand</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveView('matrix')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'matrix'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Radar className="w-4 h-4" />
          Skill Gap Radar & Analysis
        </button>

        <button
          onClick={() => setActiveView('skill_map')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'skill_map'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          Career Skill Map (Multi-Dimensional)
        </button>

        <button
          onClick={() => setActiveView('competencies')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'competencies'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-indigo-500" />
          Competencies (Cognitive, Tech, Soft)
        </button>
      </div>

      {/* VIEW 1: SKILL GAP RADAR & COVERAGE */}
      {activeView === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Radar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-colors">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1.5">Competency Radar Diagram</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Visual comparison of student proficiency vs IEEE/ACM benchmark level (85%).
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#64748b" opacity={0.3} />
                  <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" opacity={0.3} />
                  <Radar name="Current Proficiency" dataKey="Current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                  <Radar name="Target Proficiency" dataKey="Target" stroke="#0284c7" fill="#0284c7" fillOpacity={0.1} strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Gap Progress List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs transition-colors">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1.5">Skill Gap Coverage Analysis</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Core competencies required for {currentTrack.title} and course mappings.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1.5">
              {skillGapMatrix.map(item => {
                const coveragePct = Math.round((item.currentLevel / item.requiredLevel) * 100);

                return (
                  <div key={item.skill} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.skill}</span>
                      <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">
                        {item.currentLevel} / {item.requiredLevel} ({coveragePct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden my-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          coveragePct >= 90 ? 'bg-emerald-500' : coveragePct >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, coveragePct)}%` }}
                      ></div>
                    </div>

                    {/* Covering Courses */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-1.5 font-medium pt-0.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800 dark:text-slate-200">Matching Modules:</strong> {item.coveredByRecommendedCourses.length > 0 ? item.coveredByRecommendedCourses.join(', ') : 'Covered in upper semester core labs'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MULTI-DIMENSIONAL CAREER SKILL MAP */}
      {activeView === 'skill_map' && skillMap && (
        <div className="space-y-6">
          {/* Target Hours Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Target Practical Lab Hours</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{skillMap.targetPracticalHoursTotal} hrs</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">NUC Minimum Hands-on Threshold</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Target Lecture Hours</span>
              <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{skillMap.targetLectureHoursTotal} hrs</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Theory & Foundations</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase tracking-wider">ACM Specialization Area</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate block mt-1" title={currentTrack.acmSpecializationArea || 'CS2023'}>
                {currentTrack.acmSpecializationArea?.split('-')[1] || 'Specialization'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">International Standard</span>
            </div>
          </div>

          {/* 4-Quadrant Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Practical Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Wrench className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Practical & Lab Capabilities
                  </h4>
                  <span className="text-[10px] text-slate-500">Hands-on application proficiency</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {skillMap.requiredSkills.practical.map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{skill.name}</span>
                      <span className="text-[10px] text-slate-500">Benchmark: {skill.benchmark}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Target: {skill.minProficiency}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Frameworks */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Industry Toolchains & Stacks
                  </h4>
                  <span className="text-[10px] text-slate-500">Production software mastery</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {skillMap.requiredSkills.tools.map((tool, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block font-mono">{tool.name}</span>
                      <span className="text-[10px] text-slate-500">Stack: {tool.benchmark}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                      {tool.industryDemand}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Domains */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Knowledge & Theoretical Foundations
                  </h4>
                  <span className="text-[10px] text-slate-500">Conceptual domain models</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {skillMap.requiredSkills.knowledge.map((k, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{k.name}</span>
                      <span className="text-[10px] text-slate-500">{k.benchmark}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Target: {k.minProficiency}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">
                    Soft & Professional Skills
                  </h4>
                  <span className="text-[10px] text-slate-500">Ethics, documentation, team communication</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {skillMap.requiredSkills.soft.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.benchmark}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Target: {s.minProficiency}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: COMPETENCIES (Cognitive, Technical, Soft) */}
      {activeView === 'competencies' && skillMap && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Tri-Fold Competencies Architecture for {currentTrack.title}
            </h3>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 max-w-2xl leading-relaxed">
              Maps how courses impart specific cognitive reasoning patterns, technical execution competencies, and soft leadership capabilities.
            </p>
          </div>

          <div className="space-y-4">
            {/* Cognitive */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-500" />
                Cognitive Competencies Target
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {skillMap.requiredCompetencies.cognitive.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{comp.name}</span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Target: {comp.targetLevel}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                Technical Competencies Target
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {skillMap.requiredCompetencies.technical.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{comp.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Target: {comp.targetLevel}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                Soft & Ethical Competencies Target
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {skillMap.requiredCompetencies.soft.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{comp.name}</span>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Target: {comp.targetLevel}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
