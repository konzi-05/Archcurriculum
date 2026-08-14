export type CourseType = 'Core' | 'Elective' | 'Lab' | 'Project' | 'Humanities';

export type AcademicDomain = 
  | 'Math & Foundational CS'
  | 'Software Engineering'
  | 'AI & Data Science'
  | 'Cloud & Systems'
  | 'Cybersecurity & Networks'
  | 'Hardware & Embedded';

export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export type AcademicLevel = '100L' | '200L' | '300L' | '400L' | '500L';

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
  // Accreditation & Curriculum Alignment Standards:
  nucCcmasCode?: string;      // Nigerian Universities Commission CCMAS Code (e.g., CCMAS-COS101, CCMAS-IFT301)
  futMinnaCode?: string;      // Federal University of Technology, Minna Dept. Course Code (e.g., IFT 111, IFT 211, IFT 311, IFT 411, IFT 599)
  ieeeAcmStandard?: string;   // IEEE/ACM IT2017 & CS2023 Curricula guideline alignment
  acmKnowledgeArea?: string;  // ACM IT2017 Body of Knowledge area (e.g., Information Management, Networking, Security)
  academicLevel?: AcademicLevel; // 100L to 500L
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
  acmSpecializationArea?: string; // ACM/IEEE Curricula Track
}

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface StudentProfile {
  name: string;
  rollNumber: string;
  institution: string;
  department?: string;
  faculty?: string;
  program?: string;
  currentSemester: number;
  academicLevel?: AcademicLevel;
  targetCareerTrackId: string;
  completedCourseIds: string[];
  grades: Record<string, Grade>; // courseId -> Grade
  skillLevels: Record<string, number>; // skill -> 1 to 10 score
  weeklyStudyHoursBudget: number; // e.g. 25-45 hours
  preferredPace: 'Light' | 'Balanced' | 'Intensive';
  interests: string[];
}

export interface SemanticEmbeddingVector {
  vector: number[];
  dimensions: number;
  domainWeights: Record<string, number>;
  latentConcepts: string[];
}

export interface SemanticMatchDetails {
  cosineSimilarity: number; // 0 to 100%
  euclideanDistance: number;
  semanticOverlapConcepts: string[];
  embeddingModel: string;
  tfidfScore: number; // For comparative analysis in FYP
  tfidfVsEmbeddingDelta: number;
  dimensionBreakdown: Array<{
    dimension: string;
    studentTrackWeight: number;
    courseWeight: number;
    alignment: number;
  }>;
}

export interface RecommendationBreakdown {
  prerequisiteScore: number; // 0 to 100
  careerMatchScore: number;  // 0 to 100
  skillGapScore: number;     // 0 to 100
  workloadBalanceScore: number; // 0 to 100
  difficultyFitScore: number; // 0 to 100
  semanticEmbeddingScore?: number; // 0 to 100
}

export interface RecommendedCourseResult {
  course: Course;
  matchScore: number; // 0 to 100 overall
  breakdown: RecommendationBreakdown;
  matchReasons: string[];
  warningFlags: string[];
  prerequisitesMet: boolean;
  missingPrerequisites: Course[];
  semanticDetails?: SemanticMatchDetails;
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

export interface SemesterGoal {
  id: string;
  semester: number;
  title: string;
  completed: boolean;
  category: 'Academic' | 'Certification' | 'Project' | 'Career';
}

export type CustomCourseSemesterMap = Record<string, number>;

export const GRADE_POINTS: Record<Grade, number> = {
  'A+': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'F': 0
};

export interface PlanSemesterPayload {
  selectedCourseIds: string[];
  studentProfile: StudentProfile;
}
