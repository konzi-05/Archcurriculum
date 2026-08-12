import React, { useState } from 'react';
import { X, Sparkles, Compass, BookOpen, SlidersHorizontal, GraduationCap, CheckCircle2, Zap, ArrowRight, Play, Award, ShieldCheck, Target, Layers } from 'lucide-react';
import { StudentProfile } from '../types/curriculum';

interface WelcomeWalkthroughModalProps {
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenCounselor: () => void;
  onLoadDemoProfile?: (demoProfile: StudentProfile) => void;
}

export const WelcomeWalkthroughModal: React.FC<WelcomeWalkthroughModalProps> = ({
  onClose,
  onOpenProfile,
  onOpenCounselor,
  onLoadDemoProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'demos' | 'guide'>('overview');

  // Sample student personas for live demo testing
  const demoPersonas: { title: string; subtitle: string; sem: number; track: string; profile: StudentProfile }[] = [
    {
      title: "5th Sem AI & ML Aspirant",
      subtitle: "Focus on Machine Learning, Deep Learning & NLP electives",
      sem: 5,
      track: "AI & Machine Learning Specialist",
      profile: {
        name: "Aarav Sharma",
        rollNumber: "22BIT0142",
        institution: "National Institute of Technology",
        currentSemester: 5,
        targetCareerTrackId: "track-ai-ml",
        completedCourseIds: ['cs101', 'cs102', 'ma101', 'ma102', 'cs201', 'cs202', 'cs203', 'ma201'],
        grades: { 'cs101': 'A+', 'cs102': 'A', 'ma101': 'A+', 'ma102': 'A', 'cs201': 'A+', 'cs202': 'A', 'cs203': 'A', 'ma201': 'A+' },
        skillLevels: { 'Python': 8, 'Data Structures': 8, 'Linear Algebra': 7, 'Algorithms': 8 },
        weeklyStudyHoursBudget: 22,
        preferredPace: 'Balanced',
        interests: ['Artificial Intelligence', 'Machine Learning', 'Data Science']
      }
    },
    {
      title: "3rd Sem Full-Stack & Systems",
      subtitle: "Focus on Data Structures, Web Engineering & DBMS core",
      sem: 3,
      track: "Full-Stack Software Engineer",
      profile: {
        name: "Priya Patel",
        rollNumber: "23BIT0088",
        institution: "College of Engineering & Technology",
        currentSemester: 3,
        targetCareerTrackId: "track-swe",
        completedCourseIds: ['cs101', 'cs102', 'ma101', 'ma102'],
        grades: { 'cs101': 'A', 'cs102': 'A+', 'ma101': 'B', 'ma102': 'A' },
        skillLevels: { 'JavaScript': 7, 'Data Structures': 6, 'C++': 7 },
        weeklyStudyHoursBudget: 18,
        preferredPace: 'Balanced',
        interests: ['Web Development', 'Software Architecture']
      }
    },
    {
      title: "7th Sem Cybersecurity & Cloud Specialist",
      subtitle: "Focus on Ethical Hacking, Cloud Infrastructure & DevSecOps",
      sem: 7,
      track: "Cybersecurity & Cloud Systems Architect",
      profile: {
        name: "Rohan Verma",
        rollNumber: "21BIT0035",
        institution: "Institute of Information Technology",
        currentSemester: 7,
        targetCareerTrackId: "track-cyber-cloud",
        completedCourseIds: ['cs101', 'cs102', 'ma101', 'ma102', 'cs201', 'cs202', 'cs203', 'ma201', 'it301', 'it302', 'it303', 'it304'],
        grades: { 'cs101': 'A+', 'cs102': 'A+', 'ma101': 'A', 'ma102': 'A+', 'cs201': 'A+', 'cs202': 'A+', 'cs203': 'A', 'ma201': 'A+', 'it301': 'A+', 'it302': 'A+', 'it303': 'A', 'it304': 'A+' },
        skillLevels: { 'Networking': 9, 'Linux & Systems': 9, 'Cloud Infrastructure': 8, 'Ethical Hacking': 8 },
        weeklyStudyHoursBudget: 25,
        preferredPace: 'Intensive',
        interests: ['Cybersecurity', 'Cloud Systems', 'DevOps']
      }
    }
  ];

  const handleSelectDemo = (p: StudentProfile) => {
    if (onLoadDemoProfile) {
      onLoadDemoProfile(p);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>AICTE B.Tech IT Model Curriculum</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Curriculum Architect Tour & Guided Walkthrough
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'features'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Core Modules Tour</span>
          </button>

          <button
            onClick={() => setActiveTab('demos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'demos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <Play className="w-4 h-4 text-cyan-500 fill-cyan-500" />
            <span>Interactive Demo Personas</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
            }`}
          >
            <HelpCircleIcon className="w-4 h-4" />
            <span>How to Use Guide</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs bg-slate-50/40 dark:bg-slate-950/40">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>AICTE Model Curriculum & Prerequisite Engine</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Curriculum Architect</strong> is designed specifically for B.Tech Information Technology undergraduates, academic advisors, and curriculum heads. It simplifies course selection, degree planning, and skill development by applying strict AICTE Credit Safety Rules and Prerequisite DAG Graph validation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm block">160+ Credits</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">Standard B.Tech IT Graduation Credit Benchmark</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm block">100% DAG Graph</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">Prerequisite validation to prevent missing dependencies</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm block">5 Career Tracks</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">IEEE/ACM skill benchmarking for top IT tech roles</span>
                  </div>
                </div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>1. Smart Elective Match Engine</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    Ranks electives based on completed prerequisites, current semester budget, and match scores tailored to your target career specialization.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Compass className="w-4 h-4" />
                    <span>2. 4-Year Curriculum Map</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    Browse all 8 semesters of core and elective modules with interactive prerequisite dependency highlighting and detailed syllabus views.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>3. Career & Skills Matrix</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    Compare your proficiency against IEEE/ACM industry benchmarks using radar charts, salary benchmarks, and skill coverage metrics.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>4. Semester Schedule Optimizer</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    Optimize weekly study hours, verify credit limits, track GPA goals, and generate AI counselor strategic guidance reports.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CORE MODULES TOUR */}
          {activeTab === 'features' && (
            <div className="space-y-5">
              
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Smart Elective Recommendations</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">Matching Engine</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Filters courses by domain (AI, Software Engineering, Cloud, Cybersecurity, Hardware, Math), flags missing prerequisites in real-time, and provides direct "Add to Planner" controls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span>Full 8-Semester Progression Map</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">Degree Progression</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Visualizes semesters 1 through 8. Cards are color-coded into Completed (Green), Ready to Take (Blue), Prerequisite Needed (Amber), and In Planner (Indigo).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <span>Industry Career Skill Matrix</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">IEEE/ACM Benchmarks</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Includes salary expectations, market demand levels, radar competency charts, and detailed skill coverage bars matching core IT competencies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>AI Academic & Career Counselor</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">AI Assistant</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Click the <strong>Academic Counselor</strong> button anytime to ask about elective combinations, prerequisite waivers, higher studies preparation (GATE, GRE), or industry certifications!
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: INTERACTIVE DEMO PERSONAS */}
          {activeTab === 'demos' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-900 border border-blue-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                  <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
                  <span>Try a Live Demo Student Profile</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Select one of the pre-configured student personas below to test how the recommendation engine, prerequisite DAG validator, and skill matrix adapt in real-time!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {demoPersonas.map((persona, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-xs hover:border-blue-500 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                          Semester {persona.sem}
                        </span>
                        <span className="text-slate-500 font-bold text-xs">{persona.profile.weeklyStudyHoursBudget} hrs/wk</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">{persona.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{persona.subtitle}</p>
                    </div>

                    <button
                      onClick={() => handleSelectDemo(persona.profile)}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-xs"
                    >
                      <span>Load Demo Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO USE GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>3-Step Quick Guide for Students</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-0.5">Configure Profile & Completed Subjects</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Click <strong>Profile</strong> in the top header to set your current semester, target career track (e.g., AI/ML, Cloud, SE), and check off subjects you've already passed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-0.5">Pick Recommended Electives</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Browse the <strong>Recommendations</strong> tab to review top-ranked electives. Click <strong>+ Add to Semester Plan</strong> on courses you want to take.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-0.5">Optimize Schedule & Generate AI Report</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Open the <strong>Semester Planner</strong> tab, verify your credit total (AICTE limit: 24 credits), and click <strong>Generate AI Strategy Report</strong> for personalized academic advice!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>AICTE B.Tech IT Model Curriculum Compliant</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onOpenCounselor();
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all border border-indigo-200 dark:border-indigo-800"
            >
              Ask AI Counselor
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Configure My Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper icon
function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
