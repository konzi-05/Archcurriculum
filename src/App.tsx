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
import { GithubDeploymentModal } from './components/GithubDeploymentModal';

export default function App() {
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
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState<boolean>(false);
  const [activeSyllabusCourse, setActiveSyllabusCourse] = useState<Course | null>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCounselor={() => setIsCounselorModalOpen(true)}
        onOpenGithubGuide={() => setIsGithubGuideOpen(true)}
        selectedPlanCount={selectedPlanCourseIds.length}
        totalCredits={recommendations.filter(r => selectedPlanCourseIds.includes(r.course.id)).reduce((sum, r) => sum + r.course.credits, 0)}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
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
          />
        )}

      </main>

      {/* High Density Footer */}
      <footer className="h-8 bg-slate-900 border-t border-slate-700 px-4 flex items-center justify-between text-[10px] text-slate-500 font-mono shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="uppercase tracking-wider">B.Tech IT Academic Standards • AICTE Model Curriculum Compliant</span>
          <span className="text-blue-400 font-semibold">Express.js Engine • Gemini 3.6 Flash</span>
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

      {isGithubGuideOpen && (
        <GithubDeploymentModal
          onClose={() => setIsGithubGuideOpen(false)}
        />
      )}

      <SyllabusModal
        course={activeSyllabusCourse}
        onClose={() => setActiveSyllabusCourse(null)}
      />

    </div>
  );
}
