import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  SlidersHorizontal, 
  ShieldCheck, 
  Bot, 
  GraduationCap, 
  Building2, 
  Play, 
  Zap, 
  FileCheck2, 
  CalendarCheck, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink,
  Users,
  Sun,
  Moon,
  Info,
  Layers,
  Award,
  Cpu,
  Database,
  Code2,
  Lock,
  GitBranch,
  Check,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import { StudentProfile, AcademicProgrammeRules } from '../types/curriculum';
import { motion } from 'motion/react';

interface IntroductoryPageProps {
  onEnterApp: () => void;
  onSelectPersona?: (persona: StudentProfile) => void;
  onOpenWalkthrough?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  programmeRules?: AcademicProgrammeRules;
}

export const IntroductoryPage: React.FC<IntroductoryPageProps> = ({
  onEnterApp,
  onSelectPersona,
  onOpenWalkthrough,
  theme,
  onToggleTheme,
  programmeRules
}) => {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Persona Presets for fast entry
  const samplePersonas: {
    title: string;
    level: string;
    description: string;
    careerTarget: string;
    badgeColor: string;
    profile: Partial<StudentProfile>;
  }[] = [
    {
      title: '100 Level Freshman',
      level: '100L • Harmattan Semester',
      description: 'Beginning B.Tech IT foundation with calculus, basic mechanics, intro to computing & GST courses.',
      careerTarget: 'Full-Stack Software',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      profile: {
        name: 'Fatima Aliyu',
        rollNumber: '2023/1/89201IT',
        institution: 'Federal University of Technology, Minna (FUT Minna)',
        department: 'Department of Information Technology',
        faculty: 'School of Information and Communications Technology (SICT)',
        program: 'B.Tech (Hons) Information Technology',
        academicLevel: '100L',
        currentSemester: 1,
        targetCareerTrackId: 'fullstack_engineer',
        completedCourseIds: []
      }
    },
    {
      title: '300 Level Pre-SIWES',
      level: '300L • Harmattan Semester',
      description: 'Core computing, algorithms, web architectures, and preparation for mandatory SIWES placement.',
      careerTarget: 'Cloud & DevOps',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      profile: {
        name: 'Emmanuel Adeyemi',
        rollNumber: '2021/1/74921IT',
        institution: 'Federal University of Technology, Minna (FUT Minna)',
        department: 'Department of Information Technology',
        faculty: 'School of Information and Communications Technology (SICT)',
        program: 'B.Tech (Hons) Information Technology',
        academicLevel: '300L',
        currentSemester: 5,
        targetCareerTrackId: 'cloud_devops_engineer',
        completedCourseIds: [
          'CS101', 'CS102', 'CS103', 'CS104',
          'CS201', 'CS202', 'CS203', 'CS204'
        ]
      }
    },
    {
      title: '400 Level SIWES Student',
      level: '400L • Industrial Attachment',
      description: 'Engaged in practical industrial tech attachment with logbooks, work verification & SIWES II defense.',
      careerTarget: 'Cybersecurity & Infosec',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      profile: {
        name: 'Zainab Abubakar',
        rollNumber: '2020/1/65103IT',
        institution: 'Federal University of Technology, Minna (FUT Minna)',
        department: 'Department of Information Technology',
        faculty: 'School of Information and Communications Technology (SICT)',
        program: 'B.Tech (Hons) Information Technology',
        academicLevel: '400L',
        currentSemester: 7,
        targetCareerTrackId: 'cybersecurity_engineer',
        completedCourseIds: [
          'CS101', 'CS102', 'CS103', 'CS104',
          'CS201', 'CS202', 'CS203', 'CS204',
          'CS301', 'CS302', 'CS303', 'CS304'
        ]
      }
    },
    {
      title: '500 Level Final Year',
      level: '500L • Final Year Project',
      description: 'Capstone project research, advanced industry electives, and statutory graduation audit clearance.',
      careerTarget: 'AI & Data Science',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      profile: {
        name: 'Ibrahim Danladi',
        rollNumber: '2019/1/52014IT',
        institution: 'Federal University of Technology, Minna (FUT Minna)',
        department: 'Department of Information Technology',
        faculty: 'School of Information and Communications Technology (SICT)',
        program: 'B.Tech (Hons) Information Technology',
        academicLevel: '500L',
        currentSemester: 9,
        targetCareerTrackId: 'ai_ml_engineer',
        completedCourseIds: [
          'CS101', 'CS102', 'CS103', 'CS104',
          'CS201', 'CS202', 'CS203', 'CS204',
          'CS301', 'CS302', 'CS303', 'CS304',
          'CS401', 'CS402', 'CS403', 'CS404'
        ]
      }
    }
  ];

  const faqs = [
    {
      q: 'What is the B.Tech IT Curriculum Architect & Recommender?',
      a: 'It is an AI-powered academic decision platform built exclusively for students in the Department of Information Technology at Federal University of Technology, Minna (FUTMinna). It guides you through the 5-year B.Tech syllabus, maps career pathways, verifies statutory NUC CCMAS credit limits, and checks prerequisite clearance before course registration.'
    },
    {
      q: 'How does it help me avoid registration errors and timetable clashes?',
      a: 'Our built-in Conflict Detection Engine and Prerequisite DAG Graph automatically cross-reference course time slots, semester offerings (Harmattan vs. Rain), and strict prerequisite completion chains. If two classes collide or if you haven\'t completed a required foundation, the app highlights it instantly with one-click resolution options.'
    },
    {
      q: 'How does the AI recommend elective courses?',
      a: 'The system uses semantic embeddings and TF-IDF matching to analyze your chosen career track (e.g. AI & Data Science, Cloud/DevOps, Cybersecurity, Full-Stack) against detailed course syllabus learning outcomes, ranking the best electives to build job-ready tech skills.'
    },
    {
      q: 'Does it check official FUTMinna SICT handbook and NUC regulations?',
      a: 'Yes! The 8-dimension compliance matrix audits your total credits against the 150-credit statutory graduation requirement (or 120 for Direct Entry), validates the 15–24 semester unit boundaries, checks mandatory core coverage, and tracks SIWES industrial training requirements.'
    }
  ];

  const handleLaunchPersona = (persona: Partial<StudentProfile>) => {
    if (onSelectPersona) {
      onSelectPersona(persona as StudentProfile);
    }
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Dynamic Background Gradients & Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 -right-40 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      </div>

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & School Affiliation */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  CURRICULUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">ARCHITECT</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  FUTMinna B.Tech IT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                School of Information and Communication Technology (SICT)
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenWalkthrough && (
              <button
                onClick={onOpenWalkthrough}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Tour</span>
              </button>
            )}

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center justify-center min-h-[36px] min-w-[36px]"
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={onEnterApp}
              id="btn-enter-main-app-nav"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION: Emotional Reassurance & Visual Immersion */}
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission, Value & Direct Calls to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>OFFICIAL ACADEMIC DECISION & CAREER ENGINE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Master Your B.Tech IT Degree with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                  AI-Guided Academic Precision
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Eliminate the anxiety of course registration, prerequisite carry-overs, and credit load limits. Designed specifically for FUTMinna Information Technology students to build conflict-free semester timetables and prepare for world-class tech careers.
              </p>

              {/* Statutory Guarantee Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>NUC CCMAS Standardized</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>FUTMinna SICT Handbook Verified</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Conflict-Free Timetable Radar</span>
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={onEnterApp}
                  id="btn-enter-main-app-hero"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Launch Main App Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {onOpenWalkthrough && (
                  <button
                    onClick={onOpenWalkthrough}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>Watch Interactive Tour</span>
                  </button>
                )}
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start space-x-4">
                <span>✓ 100% Free & No Setup Required</span>
                <span>•</span>
                <span>✓ Real-time Firestore Cloud Sync</span>
                <span>•</span>
                <span>✓ 10-Semester Coverage</span>
              </div>
            </motion.div>

            {/* Right Column: High Impact Interactive UI Console Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl p-1 bg-gradient-to-b from-blue-500/30 via-slate-800/60 to-cyan-500/20 border border-slate-700/80 shadow-2xl overflow-hidden">
                
                {/* Visual Native UI Container */}
                <div className="rounded-[22px] bg-slate-950 p-4 sm:p-5 space-y-4 border border-slate-800">
                  
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 pl-1">planner_engine.ccmas</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>0 CLASHES</span>
                    </span>
                  </div>

                  {/* Student Status Summary Bar */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Active Degree Profile</div>
                      <div className="text-xs font-bold text-white">300L Harmattan Semester</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-medium">Load Units</div>
                      <div className="text-xs font-mono font-bold text-cyan-400">18 / 24 Units</div>
                    </div>
                  </div>

                  {/* Course Cards Preview */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          3U
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate">ITP 311: Web App Architecture</div>
                          <div className="text-[10px] text-slate-400">Mon 10:00 - 12:00 • LT II</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md shrink-0">
                        Prereq OK
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          3U
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate">ITP 313: Operating Systems</div>
                          <div className="text-[10px] text-slate-400">Wed 08:00 - 10:00 • SICT Lab 1</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md shrink-0">
                        Core Unit
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          3U
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate">ITP 315: Database Systems</div>
                          <div className="text-[10px] text-slate-400">Thu 14:00 - 16:00 • ETF Hall</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-md shrink-0">
                        AI Matched
                      </span>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-900/80 text-center">
                      <div className="text-slate-400">Curriculum</div>
                      <div className="text-white font-bold">5-Year B.Tech</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 text-center">
                      <div className="text-slate-400">Courses</div>
                      <div className="text-white font-bold">70+ Units</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 text-center">
                      <div className="text-slate-400">Career Radar</div>
                      <div className="text-emerald-400 font-bold">5 Tracks</div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* SECTION 1: WHAT PAIN POINTS DOES THIS APP SOLVE? (Reassurance for Confused Students) */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
              <Info className="w-3.5 h-3.5" />
              <span>Designed for Student Clarity & Peace of Mind</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Say Goodbye to Curriculum Confusion & Overload
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Navigating university course catalogues and faculty regulations can feel stressful. Here is how Curriculum Architect protects your academic progression:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Prerequisite Safeguard */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 space-y-3 shadow-lg transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Prerequisite Safeguards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never accidentally register for advanced courses without having passed their mandatory prerequisites (e.g. MTH111 → ITP211 → ITP311).
              </p>
            </div>

            {/* Card 2: Conflict-Free Timetable Radar */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-lg transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Timetable Clash Detection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated scheduler flags lecture collisions, practical lab overloads, and cross-semester schedule overlaps before you finalize enrollment.
              </p>
            </div>

            {/* Card 3: Statutory Unit Boundaries */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-lg transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Credit Load Governance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adheres strictly to FUTMinna semester limits (15 to 24 units), alerting you to underloads or overload Dean waivers instantly.
              </p>
            </div>

            {/* Card 4: Career Track Alignment */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 shadow-lg transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Targeted Career Electives</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI matches optional electives directly with in-demand industry skills in Cloud, AI, Security, and Software Engineering.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 2: VISUAL PILLARS (Immersive Feature Breakdown with Live UI Previews) */}
        <section className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Application Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Three Pillars of Your Academic Success
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Explore how each component of the system coordinates to deliver a seamless, stress-free university experience.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* Pillar 1: Career Pathways & Semantic Matching */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pillar I: Career Matrix & Skill Gap Engine</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Map Every Semester to Industry Competence
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Select your target tech specialization—from Full-Stack Engineering to Machine Learning and Cybersecurity Operations. The recommendation engine evaluates course syllabi vectors to highlight courses that close your specific skill gaps.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Real-time semantic cosine similarity & TF-IDF algorithmic ranking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Skill breakdown for databases, distributed systems, algorithms & security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Curriculum breakdown by foundational, core, and specialized domains</span>
                  </li>
                </ul>
              </div>
              
              {/* Pillar 1 Live UI Card */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-700/80 shadow-xl bg-slate-950 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Skill Coverage Matrix</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 font-bold">
                    Target: Cloud & DevOps (96% Match)
                  </span>
                </div>

                {/* Skill Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span>Distributed Architectures & Microservices</span>
                      <span className="text-cyan-400 font-mono">94%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span>Cloud Infrastructure & Containers</span>
                      <span className="text-emerald-400 font-mono">89%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span>Network Security & Protocol Verification</span>
                      <span className="text-indigo-400 font-mono">92%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Recommended Elective Badges */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Top Recommended Electives</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200 font-medium">ITP 413 Cloud Systems</span>
                      <span className="text-cyan-400 font-bold">+15% Skill</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200 font-medium">CPT 421 Virtualization</span>
                      <span className="text-emerald-400 font-bold">+12% Skill</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 2: Statutory Compliance & Graduation Clearance */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
              
              {/* Pillar 2 Live UI Card */}
              <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl border border-slate-700/80 shadow-xl bg-slate-950 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">8-Dimension Senate Audit</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                    8 / 8 Checks Passed (100%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">NUC CCMAS Total Graduation Units</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">154 / 150 Min</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">SICT Departmental Core Units</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">48 / 48 Cleared</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">Semester Credit Bounds (15–24)</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold text-[11px]">Validated</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 font-medium">SIWES I & II Industrial Placement</span>
                    </div>
                    <span className="font-mono text-purple-400 font-bold text-[11px]">Logbook OK</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Senate Reference: FUTM/SICT/BTECH-IT</span>
                  <span className="text-emerald-400 font-bold">Graduation Ready</span>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pillar II: Statutory Degree Clearance Audit</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  100% NUC CCMAS & Senate Regulation Verification
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Avoid last-minute graduation surprises. The 8-dimension statutory matrix audits your progress against the 150-credit minimum graduation requirement, SIWES I & II mandates, core course requirements, and departmental regulations.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>8-dimension statutory verification index (100% target)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SIWES I & SIWES II industrial work log verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Final Year Project (ITP599) capstone prerequisites</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: QUICK-START PERSONA SELECTORS (Jump Straight In) */}
        <section className="space-y-8 bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Choose Your Level to Get Started
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Select your academic year to jump into the dashboard with relevant pre-configured courses, or enter with a fresh profile:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {samplePersonas.map((persona, idx) => (
              <div
                key={idx}
                onClick={() => handleLaunchPersona(persona.profile)}
                className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:-translate-y-1 shadow-md group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                      {persona.level}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {persona.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {persona.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Track: <strong className="text-slate-200">{persona.careerTarget.split(' ')[0]}</strong></span>
                  <span className="font-bold text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>Launch</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onEnterApp}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4"
            >
              <span>Or enter dashboard using default empty profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS IN 3 STEPS */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How to Use the App in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Simple, frictionless workflow designed to save hours of planning time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h3 className="font-bold text-white text-base">Set Your Level & Career Goal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open your student profile to indicate your current academic semester (1 to 10), past passed courses, and desired tech engineering pathway.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="font-bold text-white text-base">Review AI Recommendations</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect algorithmically ranked courses with clear rationale badges, prerequisite status alerts, syllabus previews, and NUC compliance indicators.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="font-bold text-white text-base">Build Timetable & Export</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enroll courses into your Active Plan, resolve any highlighted time-slot collisions in the Weekly Timetable Grid, and export study roadmaps for semester success.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 5: FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about the B.Tech IT Curriculum Architect.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-white text-sm sm:text-base flex items-center justify-between gap-3"
                  >
                    <span>{faq.q}</span>
                    <span className={`p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION BANNER */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border border-blue-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cyan-300 mx-auto shadow-md">
              <Award className="w-6 h-6" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Ready to Plan Your Best Semester Yet?
            </h2>
            
            <p className="text-xs sm:text-sm text-indigo-200">
              Join fellow FUTMinna Information Technology scholars. Build your conflict-free semester plan and track your path to graduation today.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onEnterApp}
                id="btn-enter-main-app-bottom"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Enter Main App Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div>
          Federal University of Technology, Minna • School of Information and Communication Technology (SICT)
        </div>
        <div>
          Department of Information Technology • B.Tech Curriculum Recommender & NUC CCMAS Compliance Engine
        </div>
      </footer>

    </div>
  );
};
