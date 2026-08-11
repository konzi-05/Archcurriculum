export type CourseType = 'Core' | 'Elective' | 'Lab' | 'Project' | 'Humanities';

export type AcademicDomain = 
  | 'Math & Foundational CS'
  | 'Software Engineering'
  | 'AI & Data Science'
  | 'Cloud & Systems'
  | 'Cybersecurity & Networks'
  | 'Hardware & Embedded';

export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  type: CourseType;
  domain: AcademicDomain;
  prerequisites: string[]; // Course IDs
  corequisites?: string[];
  difficulty: number; // 1 to 5 scale
  workloadHours: number; // estimated hours per week
  skillsAcquired: string[];
  syllabus: string[];
  description: string;
  bloomLevel: BloomLevel;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  keySkills: string[];
  recommendedElectiveIds: string[];
  iconName: string;
  averageSalaryUSD: string;
  industryDemand: 'Critical' | 'High' | 'Moderate';
}

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface StudentProfile {
  name: string;
  rollNumber: string;
  institution: string;
  currentSemester: number;
  targetCareerTrackId: string;
  completedCourseIds: string[];
  grades: Record<string, Grade>; // courseId -> Grade
  skillLevels: Record<string, number>; // skill -> 1 to 10 score
  weeklyStudyHoursBudget: number; // e.g. 25-45 hours
  preferredPace: 'Light' | 'Balanced' | 'Intensive';
  interests: string[];
}

export interface RecommendationBreakdown {
  prerequisiteScore: number; // 0 to 100
  careerMatchScore: number;  // 0 to 100
  skillGapScore: number;     // 0 to 100
  workloadBalanceScore: number; // 0 to 100
  difficultyFitScore: number; // 0 to 100
}

export interface RecommendedCourseResult {
  course: Course;
  matchScore: number; // 0 to 100 overall
  breakdown: RecommendationBreakdown;
  matchReasons: string[];
  warningFlags: string[];
  prerequisitesMet: boolean;
  missingPrerequisites: Course[];
}

export interface SkillGapItem {
  skill: string;
  currentLevel: number; // 0 to 100
  requiredLevel: number; // 0 to 100
  gap: number;
  coveredByRecommendedCourses: string[]; // course names
}

export interface AiInsightResponse {
  summary: string;
  careerReadinessIndex: number; // 0 to 100
  semesterStrategy: string;
  topSkillGaps: string[];
  actionableSteps: string[];
  suggestedCertifications: string[];
  industryTrends: string;
}

export interface PlanSemesterPayload {
  selectedCourseIds: string[];
  studentProfile: StudentProfile;
}
