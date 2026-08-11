import React from 'react';
import { GraduationCap, Sparkles, Github, MessageSquare, Compass, SlidersHorizontal, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recommendations' | 'curriculum' | 'career' | 'planner';
  setActiveTab: (tab: 'recommendations' | 'curriculum' | 'career' | 'planner') => void;
  onOpenProfile: () => void;
  onOpenCounselor: () => void;
  onOpenGithubGuide: () => void;
  selectedPlanCount: number;
  totalCredits: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenCounselor,
  onOpenGithubGuide,
  selectedPlanCount,
  totalCredits
}) => {
  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-700 text-slate-200 sticky top-0 z-30 shrink-0 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
              C
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold tracking-tight text-white">
                CURRICULUM <span className="text-blue-400 font-bold">ARCHITECT</span>
              </h1>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase font-mono font-bold">
                BTech IT Standard v4.2
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded border border-slate-700">
            <button
              id="tab-recommendations"
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'recommendations'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Elective Match</span>
            </button>

            <button
              id="tab-curriculum"
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'curriculum'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>DAG Curriculum Map</span>
            </button>

            <button
              id="tab-career"
              onClick={() => setActiveTab('career')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'career'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Skill Gap Matrix</span>
            </button>

            <button
              id="tab-planner"
              onClick={() => setActiveTab('planner')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors relative ${
                activeTab === 'planner'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Semester Planner</span>
              {selectedPlanCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-bold font-mono text-[10px]">
                  {selectedPlanCount}
                </span>
              )}
            </button>
          </nav>

          {/* Depth Badge & Action Tools */}
          <div className="flex items-center space-x-4">
            
            <div className="hidden lg:flex flex-col items-end text-xs">
              <span className="text-slate-500 uppercase tracking-widest text-[9px] font-mono">Algorithmic Depth</span>
              <span className="text-blue-400 font-mono text-xs font-semibold">Level 7 [Recursive-Heuristic]</span>
            </div>

            <div className="hidden lg:block h-7 w-px bg-slate-700"></div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-ai-counselor"
                onClick={onOpenCounselor}
                className="flex items-center space-x-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-indigo-400/30"
                title="Chat with AI Academic Advisor"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden sm:inline">AI Advisor</span>
              </button>

              <button
                id="btn-edit-profile"
                onClick={onOpenProfile}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                Profile
              </button>

              <button
                id="btn-github-deploy"
                onClick={onOpenGithubGuide}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1.5"
                title="Deploy to GitHub"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Deploy</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-700 p-1.5 text-xs">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'recommendations' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-3.5 h-3.5 mb-0.5" />
          <span>Match</span>
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'curriculum' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-3.5 h-3.5 mb-0.5" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'career' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <GraduationCap className="w-3.5 h-3.5 mb-0.5" />
          <span>Skills</span>
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'planner' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mb-0.5" />
          <span>Planner ({selectedPlanCount})</span>
        </button>
      </div>
    </header>
  );
};
