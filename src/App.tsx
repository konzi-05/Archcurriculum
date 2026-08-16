import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { StudentProfile, RecommendedCourseResult, SkillGapItem, Course, AiInsightResponse, AcademicProgrammeRules } from './types/curriculum';
import { INITIAL_STUDENT_PROFILE } from './data/btechItCurriculum';
import { loadStoredProgrammeRules, saveStoredProgrammeRules } from './data/defaultProgrammeConfig';
import { generateCourseRecommendations, calculateSkillGapMatrix } from './services/recommendationEngine';
import {
  subscribeAuthState,
  subscribeStudentProfile,
  subscribeSemesterPlan,
  subscribeProgrammeRules,
  saveStudentProfileCloud,
  saveSemesterPlanCloud,
  saveProgrammeRulesCloud,
  loginAnonymously
} from './services/firebase';

import { Header } from './components/Header';
import { TopStudentDashboardBar } from './components/TopStudentDashboardBar';
import { ProfileSetup } from './components/ProfileSetup';
import { RecommendationDashboard } from './components/RecommendationDashboard';
import { CurriculumMap } from './components/CurriculumMap';
import { CareerPathwayMatrix } from './components/CareerPathwayMatrix';
import { SemesterPlanner } from './components/SemesterPlanner';
import { SyllabusModal } from './components/SyllabusModal';
import { AiCounselorModal } from './components/AiCounselorModal';
import { WelcomePanel } from './components/WelcomePanel';
import { WelcomeWalkthroughModal } from './components/WelcomeWalkthroughModal';
import { AuthModal } from './components/AuthModal';
import { DatabaseExportModal } from './components/DatabaseExportModal';
import { ProgrammeRulesModal } from './components/ProgrammeRulesModal';
import { SiwesPortalModal } from './components/SiwesPortalModal';
import { ComplianceModal } from './components/ComplianceModal';
import { BTECH_IT_COURSES } from './data/btechItCurriculum';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Firebase Auth & Cloud Sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDatabaseExportModalOpen, setIsDatabaseExportModalOpen] = useState<boolean>(false);
  const [isProgrammeRulesModalOpen, setIsProgrammeRulesModalOpen] = useState<boolean>(false);
  const [isSiwesPortalOpen, setIsSiwesPortalOpen] = useState<boolean>(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState<boolean>(false);

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [programmeRules, setProgrammeRules] = useState<AcademicProgrammeRules>(() => loadStoredProgrammeRules());
  const [recommendationMode, setRecommendationMode] = useState<'semantic-embeddings' | 'legacy-tfidf'>('semantic-embeddings');
  const [recommendations, setRecommendations] = useState<RecommendedCourseResult[]>([]);
  const [skillGapMatrix, setSkillGapMatrix] = useState<SkillGapItem[]>([]);
  const [selectedPlanCourseIds, setSelectedPlanCourseIds] = useState<string[]>([]);

  const [aiInsight, setAiInsight] = useState<AiInsightResponse | null>(null);
  const [isLoadingAiInsight, setIsLoadingAiInsight] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'recommendations' | 'curriculum' | 'career' | 'planner'>('recommendations');

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState<boolean>(false);
  const [isWalkthroughModalOpen, setIsWalkthroughModalOpen] = useState<boolean>(false);
  const [activeSyllabusCourse, setActiveSyllabusCourse] = useState<Course | null>(null);

  // Sync with Firebase Auth & Realtime Firestore listeners
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore Student Profile, Semester Plan, and Programme Rules when authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeProfile = subscribeStudentProfile(currentUser.uid, (cloudProfile) => {
      if (cloudProfile) {
        setStudentProfile(cloudProfile);
      } else {
        saveStudentProfileCloud(currentUser.uid, studentProfile);
      }
    });

    const unsubscribePlan = subscribeSemesterPlan(currentUser.uid, (cloudPlanIds) => {
      if (cloudPlanIds !== null) {
        setSelectedPlanCourseIds(cloudPlanIds);
      } else {
        saveSemesterPlanCloud(currentUser.uid, selectedPlanCourseIds);
      }
    });

    const unsubscribeRules = subscribeProgrammeRules(currentUser.uid, (cloudRules) => {
      if (cloudRules) {
        setProgrammeRules(cloudRules);
        saveStoredProgrammeRules(cloudRules);
      } else {
        saveProgrammeRulesCloud(currentUser.uid, programmeRules);
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribePlan();
      unsubscribeRules();
    };
  }, [currentUser]);

  // Sync theme with document class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Recalculate recommendations & skill gap when profile or mode updates
  useEffect(() => {
    const recs = generateCourseRecommendations(studentProfile, recommendationMode);
    const gaps = calculateSkillGapMatrix(studentProfile);
    setRecommendations(recs);
    setSkillGapMatrix(gaps);

    // Auto-preselect top 3 recommended electives into plan for offline/guest users if planner is empty
    if (selectedPlanCourseIds.length === 0 && !currentUser) {
      const top3Ids = recs.filter(r => r.prerequisitesMet).slice(0, 3).map(r => r.course.id);
      setSelectedPlanCourseIds(top3Ids);
    }
  }, [studentProfile, recommendationMode]);

  const toggleRecommendationMode = () => {
    setRecommendationMode(prev => prev === 'semantic-embeddings' ? 'legacy-tfidf' : 'semantic-embeddings');
  };

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setStudentProfile(updatedProfile);
    if (currentUser) {
      saveStudentProfileCloud(currentUser.uid, updatedProfile);
    }
  };

  const handleSaveProgrammeRules = (updatedRules: AcademicProgrammeRules) => {
    setProgrammeRules(updatedRules);
    saveStoredProgrammeRules(updatedRules);
    if (currentUser) {
      saveProgrammeRulesCloud(currentUser.uid, updatedRules);
    }
  };

  const handleTogglePlanCourse = (courseId: string) => {
    let nextIds: string[];
    if (selectedPlanCourseIds.includes(courseId)) {
      nextIds = selectedPlanCourseIds.filter(id => id !== courseId);
    } else {
      nextIds = [...selectedPlanCourseIds, courseId];
    }
    setSelectedPlanCourseIds(nextIds);
    if (currentUser) {
      saveSemesterPlanCloud(currentUser.uid, nextIds);
    }
  };

  const handleClearPlan = () => {
    setSelectedPlanCourseIds([]);
    if (currentUser) {
      saveSemesterPlanCloud(currentUser.uid, []);
    }
  };

  const handleChangeCareerTrack = (trackId: string) => {
    const nextProfile = {
      ...studentProfile,
      targetCareerTrackId: trackId
    };
    setStudentProfile(nextProfile);
    if (currentUser) {
      saveStudentProfileCloud(currentUser.uid, nextProfile);
    }
  };

  const handleRequestAiInsight = async () => {
    setIsLoadingAiInsight(true);
    try {
      const res = await fetch('/api/recommendations/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: studentProfile,
          topRecommendations: recommendations.slice(0, 5)
        })
      });

      const data = await res.json();
      setAiInsight(data);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setIsLoadingAiInsight(false);
    }
  };

  const handleExportPlan = async () => {
    try {
      const selectedCourses = recommendations.filter(r => selectedPlanCourseIds.includes(r.course.id)).map(r => r.course);
      const res = await fetch('/api/curriculum/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: studentProfile,
          selectedCourses,
          aiInsight
        })
      });

      const data = await res.json();
      
      // Download markdown file
      const blob = new Blob([data.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'BTech_IT_Curriculum_Plan.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        programmeRules={programmeRules}
        onOpenProgrammeRules={() => setIsProgrammeRulesModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCounselor={() => setIsCounselorModalOpen(true)}
        onOpenWalkthrough={() => setIsWalkthroughModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDatabaseExport={() => setIsDatabaseExportModalOpen(true)}
        onOpenSiwesPortal={() => setIsSiwesPortalOpen(true)}
        onOpenCompliance={() => setIsComplianceModalOpen(true)}
        currentUser={currentUser}
        selectedPlanCount={selectedPlanCourseIds.length}
        totalCredits={recommendations.filter(r => selectedPlanCourseIds.includes(r.course.id)).reduce((sum, r) => sum + r.course.credits, 0)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-10 space-y-5 sm:space-y-6">
        
        {/* Interactive Top Student Academic Status & Metrics Bar */}
        <TopStudentDashboardBar
          studentProfile={studentProfile}
          programmeRules={programmeRules}
          onUpdateProfile={(updated) => handleSaveProfile({ ...studentProfile, ...updated })}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenProgrammeRulesModal={() => setIsProgrammeRulesModalOpen(true)}
          onOpenCounselorModal={() => setIsCounselorModalOpen(true)}
          onOpenSiwesPortal={() => setIsSiwesPortalOpen(true)}
          onOpenCompliance={() => setIsComplianceModalOpen(true)}
          selectedPlanCourseIds={selectedPlanCourseIds}
          totalPlannedCredits={recommendations.filter(r => selectedPlanCourseIds.includes(r.course.id)).reduce((sum, r) => sum + r.course.credits, 0)}
        />

        {/* Welcome Section & Platform Introduction Banner */}
        <WelcomePanel
          onOpenWalkthrough={() => setIsWalkthroughModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenCounselor={() => setIsCounselorModalOpen(true)}
          onLoadDemoProfile={handleSaveProfile}
        />
        
        {activeTab === 'recommendations' && (
          <RecommendationDashboard
            recommendations={recommendations}
            studentProfile={studentProfile}
            programmeRules={programmeRules}
            selectedPlanCourseIds={selectedPlanCourseIds}
            onTogglePlanCourse={handleTogglePlanCourse}
            onOpenSyllabusModal={course => setActiveSyllabusCourse(course)}
            onOpenCounselor={() => setIsCounselorModalOpen(true)}
            onOpenCompliance={() => setIsComplianceModalOpen(true)}
            onOpenSiwesPortal={() => setIsSiwesPortalOpen(true)}
            recommendationMode={recommendationMode}
            onToggleRecommendationMode={toggleRecommendationMode}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumMap
            studentProfile={studentProfile}
            selectedPlanCourseIds={selectedPlanCourseIds}
            onTogglePlanCourse={handleTogglePlanCourse}
            onOpenSyllabusModal={course => setActiveSyllabusCourse(course)}
          />
        )}

        {activeTab === 'career' && (
          <CareerPathwayMatrix
            studentProfile={studentProfile}
            skillGapMatrix={skillGapMatrix}
            onChangeCareerTrack={handleChangeCareerTrack}
          />
        )}

        {activeTab === 'planner' && (
          <SemesterPlanner
            selectedPlanCourseIds={selectedPlanCourseIds}
            studentProfile={studentProfile}
            programmeRules={programmeRules}
            onOpenProgrammeRulesModal={() => setIsProgrammeRulesModalOpen(true)}
            onRemovePlanCourse={handleTogglePlanCourse}
            onClearPlan={handleClearPlan}
            aiInsight={aiInsight}
            isLoadingAiInsight={isLoadingAiInsight}
            onRequestAiInsight={handleRequestAiInsight}
            onExportPlan={handleExportPlan}
            onOpenDatabaseExport={() => setIsDatabaseExportModalOpen(true)}
            onOpenSyllabusModal={course => setActiveSyllabusCourse(course)}
            onTogglePlanCourse={handleTogglePlanCourse}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 sm:px-8 text-xs text-slate-500 dark:text-slate-400 shrink-0 mt-12 sm:mt-16 transition-colors">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {programmeRules.institutionShortCode} • {programmeRules.schoolShortCode} • {programmeRules.programme}
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Semester Units: {programmeRules.minSemesterUnits}–{programmeRules.maxSemesterUnits} | Graduation: {programmeRules.graduationRequirementUnits} Cr
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsProgrammeRulesModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Configure Handbook Rules
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400 dark:text-slate-500">NUC CCMAS Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {isProfileModalOpen && (
        <ProfileSetup
          profile={studentProfile}
          programmeRules={programmeRules}
          onOpenProgrammeRulesModal={() => setIsProgrammeRulesModalOpen(true)}
          onSaveProfile={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isProgrammeRulesModalOpen && (
        <ProgrammeRulesModal
          currentRules={programmeRules}
          onSaveRules={handleSaveProgrammeRules}
          onClose={() => setIsProgrammeRulesModalOpen(false)}
        />
      )}

      {isCounselorModalOpen && (
        <AiCounselorModal
          profile={studentProfile}
          currentUser={currentUser}
          selectedPlanCourseIds={selectedPlanCourseIds}
          onTogglePlanCourse={handleTogglePlanCourse}
          onSelectCourse={setActiveSyllabusCourse}
          onClose={() => setIsCounselorModalOpen(false)}
        />
      )}

      {isWalkthroughModalOpen && (
        <WelcomeWalkthroughModal
          onClose={() => setIsWalkthroughModalOpen(false)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenCounselor={() => setIsCounselorModalOpen(true)}
          onLoadDemoProfile={handleSaveProfile}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          user={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
          onOpenDatabaseExport={() => setIsDatabaseExportModalOpen(true)}
        />
      )}

      {isDatabaseExportModalOpen && (
        <DatabaseExportModal
          studentProfile={studentProfile}
          selectedPlanCourseIds={selectedPlanCourseIds}
          currentUser={currentUser}
          onClose={() => setIsDatabaseExportModalOpen(false)}
        />
      )}

      {isSiwesPortalOpen && (
        <SiwesPortalModal
          isOpen={isSiwesPortalOpen}
          onClose={() => setIsSiwesPortalOpen(false)}
          studentProfile={studentProfile}
          onUpdateProfile={handleSaveProfile}
          programmeRules={programmeRules}
          allCourses={BTECH_IT_COURSES}
        />
      )}

      {isComplianceModalOpen && (
        <ComplianceModal
          isOpen={isComplianceModalOpen}
          onClose={() => setIsComplianceModalOpen(false)}
          studentProfile={studentProfile}
          programmeRules={programmeRules}
          allCourses={BTECH_IT_COURSES}
          plannedCourseIds={selectedPlanCourseIds}
          onOpenSiwesPortal={() => {
            setIsComplianceModalOpen(false);
            setIsSiwesPortalOpen(true);
          }}
          onOpenProgrammeRules={() => {
            setIsComplianceModalOpen(false);
            setIsProgrammeRulesModalOpen(true);
          }}
        />
      )}

      <SyllabusModal
        course={activeSyllabusCourse}
        onClose={() => setActiveSyllabusCourse(null)}
        onOpenSiwesPortal={() => setIsSiwesPortalOpen(true)}
      />

    </div>
  );
}
