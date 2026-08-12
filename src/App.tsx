import React, { useState, useEffect } from 'react';
import { StudentProfile, RecommendedCourseResult, SkillGapItem, Course, AiInsightResponse } from './types/curriculum';
import { INITIAL_STUDENT_PROFILE } from './data/btechItCurriculum';
import { generateCourseRecommendations, calculateSkillGapMatrix } from './services/recommendationEngine';

import { Header } from './components/Header';
import { ProfileSetup } from './components/ProfileSetup';
import { RecommendationDashboard } from './components/RecommendationDashboard';
import { CurriculumMap } from './components/CurriculumMap';
import { CareerPathwayMatrix } from './components/CareerPathwayMatrix';
import { SemesterPlanner } from './components/SemesterPlanner';
import { SyllabusModal } from './components/SyllabusModal';
import { AiCounselorModal } from './components/AiCounselorModal';
import { WelcomePanel } from './components/WelcomePanel';
import { WelcomeWalkthroughModal } from './components/WelcomeWalkthroughModal';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
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

  // Recalculate recommendations & skill gap when profile updates
  useEffect(() => {
    const recs = generateCourseRecommendations(studentProfile);
    const gaps = calculateSkillGapMatrix(studentProfile);
    setRecommendations(recs);
    setSkillGapMatrix(gaps);

    // Auto-preselect top 3 recommended electives into plan if planner is empty
    if (selectedPlanCourseIds.length === 0) {
      const top3Ids = recs.filter(r => r.prerequisitesMet).slice(0, 3).map(r => r.course.id);
      setSelectedPlanCourseIds(top3Ids);
    }
  }, [studentProfile]);

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setStudentProfile(updatedProfile);
  };

  const handleTogglePlanCourse = (courseId: string) => {
    if (selectedPlanCourseIds.includes(courseId)) {
      setSelectedPlanCourseIds(prev => prev.filter(id => id !== courseId));
    } else {
      setSelectedPlanCourseIds(prev => [...prev, courseId]);
    }
  };

  const handleClearPlan = () => {
    setSelectedPlanCourseIds([]);
  };

  const handleChangeCareerTrack = (trackId: string) => {
    setStudentProfile(prev => ({
      ...prev,
      targetCareerTrackId: trackId
    }));
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
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCounselor={() => setIsCounselorModalOpen(true)}
        onOpenWalkthrough={() => setIsWalkthroughModalOpen(true)}
        selectedPlanCount={selectedPlanCourseIds.length}
        totalCredits={recommendations.filter(r => selectedPlanCourseIds.includes(r.course.id)).reduce((sum, r) => sum + r.course.credits, 0)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-10 space-y-6 sm:space-y-8">
        
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
            selectedPlanCourseIds={selectedPlanCourseIds}
            onTogglePlanCourse={handleTogglePlanCourse}
            onOpenSyllabusModal={course => setActiveSyllabusCourse(course)}
            onOpenCounselor={() => setIsCounselorModalOpen(true)}
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
            onRemovePlanCourse={handleTogglePlanCourse}
            onClearPlan={handleClearPlan}
            aiInsight={aiInsight}
            isLoadingAiInsight={isLoadingAiInsight}
            onRequestAiInsight={handleRequestAiInsight}
            onExportPlan={handleExportPlan}
            onOpenSyllabusModal={course => setActiveSyllabusCourse(course)}
            onTogglePlanCourse={handleTogglePlanCourse}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 sm:px-8 text-xs text-slate-500 dark:text-slate-400 shrink-0 mt-12 sm:mt-16 transition-colors">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600 dark:text-slate-300">B.Tech Information Technology Academic Planner • AICTE Model Curriculum</span>
          <span className="text-slate-400 dark:text-slate-500">Curriculum Architect</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {isProfileModalOpen && (
        <ProfileSetup
          profile={studentProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isCounselorModalOpen && (
        <AiCounselorModal
          profile={studentProfile}
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

      <SyllabusModal
        course={activeSyllabusCourse}
        onClose={() => setActiveSyllabusCourse(null)}
      />

    </div>
  );
}
