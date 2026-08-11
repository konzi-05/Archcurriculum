import React from 'react';
import { StudentProfile, SkillGapItem } from '../types/curriculum';
import { CAREER_TRACKS, BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { GraduationCap, Target, Award, CheckCircle2, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';

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
  const currentTrack = CAREER_TRACKS.find(t => t.id === studentProfile.targetCareerTrackId) || CAREER_TRACKS[0];

  // Radar Chart Data Format
  const radarData = skillGapMatrix.map(item => ({
    skill: item.skill,
    Current: item.currentLevel,
    Target: item.requiredLevel
  }));

  return (
    <div className="space-y-5">
      
      {/* High Density Header Banner */}
      <div className="bg-slate-900 border border-slate-700 rounded p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Target Role Benchmark Analytics [Industry Standard Matrix]</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">{currentTrack.title} Skill Matrix</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {currentTrack.description}
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded border border-slate-700 text-xs flex-shrink-0 font-mono">
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest">Target Industry Role</div>
            <div className="font-bold text-slate-200">{currentTrack.targetRole}</div>
            <div className="text-[10px] text-blue-400">Avg Benchmark: {currentTrack.averageSalaryUSD}</div>
          </div>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="bg-slate-900 border border-slate-700 p-3.5 rounded">
        <label className="block text-xs font-bold text-slate-300 font-mono mb-2 uppercase tracking-wide">
          Select / Switch B.Tech IT Specialization Track:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CAREER_TRACKS.map(track => {
            const isSelected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => onChangeCareerTrack(track.id)}
                className={`p-2.5 rounded border text-left transition-colors text-xs font-mono ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="truncate font-bold">{track.title}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{track.industryDemand} Demand</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart & Bar Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Radar Chart */}
        <div className="bg-slate-900 border border-slate-700 rounded p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono mb-1">Competency Radar Diagram</h3>
            <p className="text-xs text-slate-400 mb-3">
              Visual comparison of student proficiency vs IEEE/ACM benchmark level (85%).
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Current Proficiency" dataKey="Current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Target Proficiency" dataKey="Target" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.25rem', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Progress List */}
        <div className="bg-slate-900 border border-slate-700 rounded p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono mb-1">Skill Gap Coverage Analysis</h3>
          <p className="text-xs text-slate-400 mb-3">
            Core competencies required for {currentTrack.title} and course mappings.
          </p>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {skillGapMatrix.map(item => {
              const coveragePct = Math.round((item.currentLevel / item.requiredLevel) * 100);

              return (
                <div key={item.skill} className="p-3 rounded bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{item.skill}</span>
                    <span className="font-mono text-[11px] text-cyan-400 font-bold">
                      {item.currentLevel} / {item.requiredLevel} ({coveragePct}%)
                    </span>
                  </div>

                  {/* High Density Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all ${
                        coveragePct >= 90 ? 'bg-emerald-500' : coveragePct >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, coveragePct)}%` }}
                    ></div>
                  </div>

                  {/* Covering Courses */}
                  <div className="text-[10px] font-mono text-slate-400 flex items-start space-x-1">
                    <BookOpen className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Matching Modules:</strong> {item.coveredByRecommendedCourses.length > 0 ? item.coveredByRecommendedCourses.join(', ') : 'Covered in upper semester core labs'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
