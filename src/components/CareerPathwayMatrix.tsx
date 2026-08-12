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
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Role Industry Skill Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{currentTrack.title} Skill Matrix</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {currentTrack.description}
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-blue-50/80 p-3.5 rounded-xl border border-blue-200/80 text-xs flex-shrink-0">
          <div>
            <div className="text-[10px] text-blue-700 uppercase tracking-wider font-bold">Target Role</div>
            <div className="font-extrabold text-slate-900 text-sm">{currentTrack.targetRole}</div>
            <div className="text-xs text-blue-600 font-semibold mt-0.5">Avg Salary Benchmark: {currentTrack.averageSalaryUSD}</div>
          </div>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
        <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wide">
          Select / Switch B.Tech IT Specialization Track:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CAREER_TRACKS.map(track => {
            const isSelected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                onClick={() => onChangeCareerTrack(track.id)}
                className={`p-3 rounded-xl border text-left transition-all text-xs ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="truncate font-bold">{track.title}</div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{track.industryDemand} Demand</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart & Bar Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Radar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">Competency Radar Diagram</h3>
            <p className="text-xs text-slate-500 mb-3">
              Visual comparison of student proficiency vs IEEE/ACM benchmark level (85%).
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Current Proficiency" dataKey="Current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                <Radar name="Target Proficiency" dataKey="Target" stroke="#0284c7" fill="#0284c7" fillOpacity={0.1} strokeDasharray="3 3" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Progress List */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">Skill Gap Coverage Analysis</h3>
          <p className="text-xs text-slate-500 mb-3">
            Core competencies required for {currentTrack.title} and course mappings.
          </p>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {skillGapMatrix.map(item => {
              const coveragePct = Math.round((item.currentLevel / item.requiredLevel) * 100);

              return (
                <div key={item.skill} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{item.skill}</span>
                    <span className="text-xs text-blue-700 font-bold">
                      {item.currentLevel} / {item.requiredLevel} ({coveragePct}%)
                    </span>
                  </div>

                  {/* High Density Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        coveragePct >= 90 ? 'bg-emerald-500' : coveragePct >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, coveragePct)}%` }}
                    ></div>
                  </div>

                  {/* Covering Courses */}
                  <div className="text-xs text-slate-600 flex items-start space-x-1 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Matching Modules:</strong> {item.coveredByRecommendedCourses.length > 0 ? item.coveredByRecommendedCourses.join(', ') : 'Covered in upper semester core labs'}
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
